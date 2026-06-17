package handlers

import (
	"ajo-tracker/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AddMemberInput struct {
	UserID int `json:"user_id" binding:"required"`
}

func AddMember(c *gin.Context) {
	groupID := c.Param("id")
	var input AddMemberInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	// Find the next position in the group
	var nextPosition int
	posQuery := `SELECT COALESCE(MAX(position), 0) + 1 FROM group_members WHERE group_id = $1`
	err := db.DB.QueryRow(posQuery, groupID).Scan(&nextPosition)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO group_members (group_id, user_id, position) VALUES ($1, $2, $3)`
	_, err = db.DB.Exec(query, groupID, input.UserID, nextPosition)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Member added successfully", "position": nextPosition})
}

func GetGroupMembers(c *gin.Context) {
	groupID := c.Param("id")

	query := `SELECT gm.id, gm.user_id, u.name, u.email, gm.position, gm.has_collected
			  FROM group_members gm
			  INNER JOIN users u ON gm.user_id = u.id
			  WHERE gm.group_id = $1
			  ORDER BY gm.position`

	rows, err := db.DB.Query(query, groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type MemberView struct {
		ID           int    `json:"id"`
		UserID       int    `json:"user_id"`
		Name         string `json:"name"`
		Email        string `json:"email"`
		Position     int    `json:"position"`
		HasCollected bool   `json:"has_collected"`
	}

	var members []MemberView
	for rows.Next() {
		var m MemberView
		rows.Scan(&m.ID, &m.UserID, &m.Name, &m.Email, &m.Position, &m.HasCollected)
		members = append(members, m)
	}

	c.JSON(http.StatusOK, gin.H{"members": members})
}

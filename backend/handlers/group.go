package handlers

import (
	"ajo-tracker/db"
	"ajo-tracker/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateGroup(c *gin.Context) {
	var group models.Group
	userID := c.MustGet("user_id").(int)

	if err := c.ShouldBindJSON(&group); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	query := `INSERT INTO groups (name, description, contribution_amount, frequency, max_members, created_by)
			  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

	err := db.DB.QueryRow(query,
		group.Name,
		group.Description,
		group.ContributionAmount,
		group.Frequency,
		group.MaxMembers,
		userID,
	).Scan(&group.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Automatically add creator as first member
	memberQuery := `INSERT INTO group_members (group_id, user_id, position) VALUES ($1, $2, 1)`
	_, err = db.DB.Exec(memberQuery, group.ID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Group created successfully", "group": group})
}

func GetGroups(c *gin.Context) {
	userID := c.MustGet("user_id").(int)

	query := `SELECT g.id, g.name, g.description, g.contribution_amount, g.frequency, g.max_members, g.created_by, g.created_at
			  FROM groups g
			  INNER JOIN group_members gm ON g.id = gm.group_id
			  WHERE gm.user_id = $1`

	rows, err := db.DB.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var groups []models.Group
	for rows.Next() {
		var g models.Group
		rows.Scan(&g.ID, &g.Name, &g.Description, &g.ContributionAmount, &g.Frequency, &g.MaxMembers, &g.CreatedBy, &g.CreatedAt)
		groups = append(groups, g)
	}

	c.JSON(http.StatusOK, gin.H{"groups": groups})
}

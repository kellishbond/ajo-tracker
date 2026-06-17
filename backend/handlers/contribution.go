package handlers

import (
	"ajo-tracker/db"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type MarkPaidInput struct {
	UserID int     `json:"user_id" binding:"required"`
	Round  int     `json:"round" binding:"required"`
	Amount float64 `json:"amount" binding:"required"`
}

func MarkContributionPaid(c *gin.Context) {
	groupID := c.Param("id")
	var input MarkPaidInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	query := `INSERT INTO contributions (group_id, user_id, round, amount, paid, paid_at)
			  VALUES ($1, $2, $3, $4, true, $5)`

	_, err := db.DB.Exec(query, groupID, input.UserID, input.Round, input.Amount, time.Now())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Contribution marked as paid"})
}

func GetContributions(c *gin.Context) {
	groupID := c.Param("id")
	round := c.Query("round")

	query := `SELECT c.id, c.user_id, u.name, c.round, c.amount, c.paid, c.paid_at
			  FROM contributions c
			  INNER JOIN users u ON c.user_id = u.id
			  WHERE c.group_id = $1 AND c.round = $2`

	rows, err := db.DB.Query(query, groupID, round)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type ContributionView struct {
		ID     int     `json:"id"`
		UserID int     `json:"user_id"`
		Name   string  `json:"name"`
		Round  int     `json:"round"`
		Amount float64 `json:"amount"`
		Paid   bool    `json:"paid"`
		PaidAt *string `json:"paid_at"`
	}

	var contributions []ContributionView
	for rows.Next() {
		var con ContributionView
		rows.Scan(&con.ID, &con.UserID, &con.Name, &con.Round, &con.Amount, &con.Paid, &con.PaidAt)
		contributions = append(contributions, con)
	}

	c.JSON(http.StatusOK, gin.H{"contributions": contributions})
}

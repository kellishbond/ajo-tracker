package handlers

import (
	"ajo-tracker/db"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PayoutStatus struct {
	Round           int    `json:"round"`
	AllPaid         bool   `json:"all_paid"`
	TotalMembers    int    `json:"total_members"`
	PaidCount       int    `json:"paid_count"`
	NextRecipientID int    `json:"next_recipient_id"`
	RecipientName   string `json:"recipient_name"`
	CanPayout       bool   `json:"can_payout"`
}

func GetPayoutStatus(c *gin.Context) {
	groupID := c.Param("id")
	roundStr := c.Query("round")
	round, _ := strconv.Atoi(roundStr)

	// Count total members in the group
	var totalMembers int
	db.DB.QueryRow(`SELECT COUNT(*) FROM group_members WHERE group_id = $1`, groupID).Scan(&totalMembers)

	// Count how many have paid this round
	var paidCount int
	db.DB.QueryRow(`SELECT COUNT(*) FROM contributions WHERE group_id = $1 AND round = $2 AND paid = true`, groupID, round).Scan(&paidCount)

	allPaid := totalMembers > 0 && paidCount == totalMembers

	// Find whose turn it is (position == round number)
	var recipientID int
	var recipientName string
	query := `SELECT u.id, u.name FROM group_members gm
			  INNER JOIN users u ON gm.user_id = u.id
			  WHERE gm.group_id = $1 AND gm.position = $2`
	db.DB.QueryRow(query, groupID, round).Scan(&recipientID, &recipientName)

	status := PayoutStatus{
		Round:           round,
		AllPaid:         allPaid,
		TotalMembers:    totalMembers,
		PaidCount:       paidCount,
		NextRecipientID: recipientID,
		RecipientName:   recipientName,
		CanPayout:       allPaid,
	}

	c.JSON(http.StatusOK, status)
}

func ProcessPayout(c *gin.Context) {
	groupID := c.Param("id")
	roundStr := c.Query("round")
	round, _ := strconv.Atoi(roundStr)

	// Verify all members have paid
	var totalMembers, paidCount int
	db.DB.QueryRow(`SELECT COUNT(*) FROM group_members WHERE group_id = $1`, groupID).Scan(&totalMembers)
	db.DB.QueryRow(`SELECT COUNT(*) FROM contributions WHERE group_id = $1 AND round = $2 AND paid = true`, groupID, round).Scan(&paidCount)

	if totalMembers == 0 || paidCount < totalMembers {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not all members have paid for this round yet"})
		return
	}

	// Mark the recipient (member at position == round) as collected
	updateQuery := `UPDATE group_members SET has_collected = true WHERE group_id = $1 AND position = $2`
	result, err := db.DB.Exec(updateQuery, groupID, round)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No member found at this position"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Payout processed successfully",
		"round":      round,
		"next_round": round + 1,
	})
}

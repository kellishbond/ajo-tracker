package models

type Group struct {
	ID                 int     `json:"id"`
	Name               string  `json:"name"`
	Description        string  `json:"description"`
	ContributionAmount float64 `json:"contribution_amount"`
	Frequency          string  `json:"frequency"`
	MaxMembers         int     `json:"max_members"`
	CreatedBy          int     `json:"created_by"`
	CreatedAt          string  `json:"created_at"`
}

type GroupMember struct {
	ID           int    `json:"id"`
	GroupID      int    `json:"group_id"`
	UserID       int    `json:"user_id"`
	Position     int    `json:"position"`
	HasCollected bool   `json:"has_collected"`
	JoinedAt     string `json:"joined_at"`
}

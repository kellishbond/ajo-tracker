package routes

import (
	"ajo-tracker/handlers"
	"ajo-tracker/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		groups := api.Group("/groups")
		groups.Use(middleware.AuthMiddleware())
		{
			groups.POST("/", handlers.CreateGroup)
			groups.GET("/", handlers.GetGroups)
			groups.GET("/:id", handlers.GetGroup)
			groups.POST("/:id/members", handlers.AddMember)
			groups.GET("/:id/members", handlers.GetGroupMembers)
			groups.POST("/:id/contributions", handlers.MarkContributionPaid)
			groups.GET("/:id/contributions", handlers.GetContributions)
			groups.GET("/:id/payout-status", handlers.GetPayoutStatus)
			groups.POST("/:id/payout", handlers.ProcessPayout)
		}
	}
}

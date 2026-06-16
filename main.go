package main

import (
	"ajo-tracker/db"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db.Connect()

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Ajo Tracker API is running!"})
	})

	port := os.Getenv("PORT")
	r.Run(":" + port)
}

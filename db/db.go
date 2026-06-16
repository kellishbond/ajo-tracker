package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	dbURL := os.Getenv("DB_URL")

	var err error
	DB, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Cannot connect to database:", err)
	}

	fmt.Println("Database connected successfully!")
}

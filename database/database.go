package database

import (
	"runclub/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// Connect with database
func Connect() {
	gormDb, err:= gorm.Open(sqlite.Open("dev.db"), &gorm.Config{})
	
	if err != nil {
	  panic("failed to connect database")
	}

	db = gormDb
}

func Get() *gorm.DB {
	return db
}

func Migrate() {
	db.AutoMigrate(&models.User{}, &models.Event{}, &models.Participant{})
}
package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Date time.Time
	Location string
	IsComplete bool
	Participants []Participant
}
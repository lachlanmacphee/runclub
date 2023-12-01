package models

import (
	"fmt"
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

func (e Event) FormatLocation(location string) string {
	switch location {
	case "albertParkLake":
		return "Albert Park Lake"
	case "southMelbourneBeach":
		return "South Melbourne Beach"
	default:
		fmt.Println("Something went wrong while converting location.")
		return "N/A"
	}
}

func (e Event) FormatDate(date time.Time) string {
	return date.Format("Monday, January 2, 2006")
}
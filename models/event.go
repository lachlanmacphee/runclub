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
			return "Invalid Location"
	}
}

func (e Event) FormatDate(date time.Time) string {
	return date.Format("Monday, January 2, 2006")
}

func (e Event) GetLocationImage(location string) string {
	switch location {
		case "albertParkLake":
			return "https://www.onlymelbourne.com.au/image/ico-albertpark.jpg"
		case "southMelbourneBeach":
			return "https://elslighting.com.au/wp-content/uploads/2020/05/SMLSC_3-1024x767.jpg"
		default:
			fmt.Println("Something went wrong while obtaining the location image.")
			return "N/A"
	}
}
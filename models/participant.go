package models

import (
	"gorm.io/gorm"
)

type Participant struct {
	gorm.Model
	Name string
	Bib int
	Time int
	Distance string
	EventID int
}
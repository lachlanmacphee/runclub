package models

import (
	"fmt"

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

func (p Participant) FormatTime(inSeconds int) string {
	minutes := inSeconds / 60
	seconds := inSeconds % 60
	str := fmt.Sprintf("%02d:%02d", minutes, seconds)
	return str
}
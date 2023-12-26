package models

import (
	"time"

	"gorm.io/gorm"
)

type Session struct {
	gorm.Model
	Email string
	Token string
	Expiry time.Time
}

func (s Session) isExpired() bool {
	return s.Expiry.Before(time.Now())
}
package handlers

import (
	"net/http"
	"runclub/database"
	"runclub/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(c *fiber.Ctx) error {
	sessionToken := c.Cookies("session_token")

	if sessionToken == "" {
		// If the cookie is not set, return an unauthorized status
		return c.Status(http.StatusUnauthorized).SendString("Unauthorized")
	}

	db := database.Get()
	var session models.Session
	err := db.Where("token = ?", sessionToken).First(&session).Error

	if err != nil {
		return c.Status(http.StatusUnauthorized).SendString("Unauthorized")
	}

	if session.Expiry.Before(time.Now()) {
		db.Delete(session)
		return c.Status(http.StatusUnauthorized).SendString("Session expired")
	}
	
	return c.Next()
}
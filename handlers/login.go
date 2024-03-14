package handlers

import (
	"net/http"
	"runclub/database"
	"runclub/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Login(c *fiber.Ctx) error {
	var creds models.LoginCredentials

	if err := c.BodyParser(&creds); err != nil {
		return c.Status(http.StatusBadRequest).SendString("Bad Request")
	}

	var user models.User
	db := database.Get()
	db.Where("email = ?", creds.Email).First(&user)

	if user.Password != creds.Password {
		return c.Status(http.StatusUnauthorized).SendString("Unauthorised")
	}

	sessionToken := uuid.NewString()
	expiresAt := time.Now().Add(15 * time.Minute)

	session := models.Session{Email: creds.Email, Token: sessionToken, Expiry: expiresAt}
	db.Create(&session)

	c.Cookie(&fiber.Cookie{
        Name:  "session_token",
        Value: sessionToken,
		Expires: expiresAt,
    })

	c.Set("HX-Redirect", "/pastevents")

	return nil
}

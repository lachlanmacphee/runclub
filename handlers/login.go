package handlers

import (
	"net/http"
	"runclub/database"
	"runclub/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Credentials struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	var creds Credentials

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
	expiresAt := time.Now().Add(120 * time.Second)

	session := models.Session{Email: creds.Email, Token: sessionToken, Expiry: expiresAt}
	db.Create(&session)

	c.Cookie(&fiber.Cookie{
        Name:  "session_token",
        Value: sessionToken,
		Expires: expiresAt,
    })

	c.Redirect("/pastevents")
	
	return nil
}

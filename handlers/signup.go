package handlers

import (
	"fmt"
	"net/http"
	"runclub/database"
	"runclub/models"

	"github.com/gofiber/fiber/v2"
)

func Signup(c *fiber.Ctx) error {
	var creds models.SignupCredentials

	if err := c.BodyParser(&creds); err != nil {
		return c.Status(http.StatusBadRequest).SendString("Bad Request")
	}

	db := database.Get()
	user := models.User{Email: creds.Email, Password: creds.Password, Name: creds.Name, Role: creds.Role }
	err := db.Create(&user).Error
	
	if err != nil {
		fmt.Println(err)
	}

	c.Set("HX-Redirect", "/login")

	return nil
}

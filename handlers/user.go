package handlers

import (
	"fmt"
	"runclub/database"
	"runclub/models"

	"github.com/gofiber/fiber/v2"
)

func GetUsers(c *fiber.Ctx) error {
	var users []models.User
	db := database.Get()
	err := db.Find(&users).Error
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(users)
}
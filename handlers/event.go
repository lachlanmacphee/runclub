package handlers

import (
	"fmt"
	"runclub/database"
	"runclub/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetEvents(c *fiber.Ctx) error {
	var events []models.Event
	db := database.Get()
	err := db.Find(&events).Error
	if err != nil {
		fmt.Println(err)
	}
	return c.JSON(events)
}

func CreateEvent(c *fiber.Ctx) error {
	payload := struct {
		Date  string `json:"date"`
		Location string `json:"location"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return err
	}

	const shortForm = "2006-01-02"
	time, _ := time.Parse(shortForm, payload.Date)

	db := database.Get()
	event := models.Event{Date: time, Location: payload.Location}
	err := db.Create(&event).Error
	
	if err != nil {
		fmt.Println(err)
	}

	c.Set("HX-Redirect", fmt.Sprintf("/participants/%d", event.ID))
	
	return c.Next()
}
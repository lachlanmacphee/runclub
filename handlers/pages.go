package handlers

import (
	"errors"
	"fmt"
	"runclub/database"
	"runclub/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Home(c *fiber.Ctx) error {
	return c.Render("pages/home/index", nil, "layout/main")
}

func Event(c *fiber.Ctx) error {
	return c.Render("pages/events/index", nil, "layout/main")
}

func Participants(c *fiber.Ctx) error {
	db := database.Get()

	eventIdInt, err := strconv.Atoi(c.Params("eventId"))
	if err != nil {
		fmt.Println(err)
	}

	var event models.Event
	err = db.First(&event, eventIdInt).Error
	if (errors.Is(err, gorm.ErrRecordNotFound)) {
		return c.Redirect("/events")
	}

	var participants []models.Participant
	err = db.Find(&participants, models.Participant{EventID: eventIdInt}).Error
	if err != nil {
		fmt.Println(err)
	}

	return c.Render("pages/participants/index", fiber.Map{
		"eventId": c.Params("eventId"),
		"participants": participants,
	}, "layout/main")
}

func Timing(c *fiber.Ctx) error {
	return c.Render("pages/timing/index", fiber.Map{
		"arr": []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20},
	}, "layout/main")
}

func Faq(c *fiber.Ctx) error {
	return c.Render("pages/faq/index", nil, "layout/main")
}

func Contact(c *fiber.Ctx) error {
	return c.Render("pages/contact/index", nil, "layout/main")
}
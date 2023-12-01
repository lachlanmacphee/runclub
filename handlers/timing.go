package handlers

import (
	"runclub/database"
	"runclub/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func TimeParticipant(c *fiber.Ctx) error {
	payload := struct {
		Time   string `json:"time"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return err
	}

	time, convErr := strconv.Atoi(payload.Time)
	if convErr != nil {
		panic(convErr)
	}

	eventId, convErr := strconv.Atoi(c.Params("eventId"))
	if convErr != nil {
		panic(convErr)
	}

	bib, convErr := strconv.Atoi(c.Params("bib"))
	if convErr != nil {
		panic(convErr)
	}

	db := database.Get()
	db.Model(&models.Participant{}).Where("bib = ? AND event_id = ?", bib, eventId).Update("time", time)
	
	return c.Render("pages/timing/disabledButton", fiber.Map{
		"bib": bib,
	})
}
package handlers

import (
	"fmt"
	"runclub/database"
	"runclub/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func AddParticipant(c *fiber.Ctx) error {
	payload := struct {
		Bib   string `json:"bib"`
		Name  string `json:"name"`
		Distance string `json:"distance"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return err
	}

	bibNum, convErr := strconv.Atoi(payload.Bib)
	if convErr != nil {
		panic(convErr)
	}

	eventId, convErr := strconv.ParseUint(c.Params("id"), 10, 64)
	if convErr != nil {
		panic(convErr)
	}

	db := database.Get()
	participant := models.Participant{Bib: bibNum, Name: payload.Name, Distance: payload.Distance, EventID: eventId}
	err := db.Create(&participant).Error
	
	if err != nil {
		fmt.Println(err)
	}
	
	return c.Render("pages/participants/row", fiber.Map{
		"bib": participant.Bib,
		"name": participant.Name,
		"distance": participant.Distance,
	})
}
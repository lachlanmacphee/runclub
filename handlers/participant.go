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

	eventId, convErr := strconv.Atoi(c.Params("id"))
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

func GetParticipantsByDate(c *fiber.Ctx) error {
	date := c.Query("date")

	db := database.Get()
	dateDbFormat := date + " 00:00:00+00:00"

	var event models.Event
	err := db.Where("date = ?", dateDbFormat).First(&event).Error
	if err != nil {
		fmt.Println(err)
	}

	var participants []models.Participant
	err = db.Where("event_id = ?", event.ID).Find(&participants).Error
	if err != nil {
		fmt.Println(err)
	}

	return c.Render("pages/participants/table", fiber.Map{
		"participants": participants,
	})
}

func GetParticipants(c *fiber.Ctx) error {
	payload := struct {
		Name  string `json:"name"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return err
	}

	if payload.Name == "" {
		return c.SendString("<tr><td>No results...</td></tr>")
	}

	db := database.Get()
	var names []string
	err := db.Model(&models.Participant{}).Where("name LIKE ?", "%" + payload.Name + "%").Distinct().Pluck("name", &names).Error
	
	if len(names) == 0 {
		return c.SendString("<tr><td>No results...</td></tr>")
	}
	
	if err != nil {
		fmt.Println(err)
	}
	
	return c.Render("pages/participants/searchResults", fiber.Map{
		"names": names,
	})
}

func ChooseParticipant(c *fiber.Ctx) error {
	payload := struct {
		Name  string `json:"name"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return err
	}
	
	return c.Render("pages/participants/nameInput", fiber.Map{
		"name": payload.Name,
	})
}
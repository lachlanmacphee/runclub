package handlers

import (
	"errors"
	"fmt"
	"runclub/database"
	"runclub/models"
	"runclub/views"
	"strconv"
	"time"

	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"gorm.io/gorm"
)

func Render(c *fiber.Ctx, component templ.Component, options ...func(*templ.ComponentHandler)) error {
	componentHandler := templ.Handler(component)
	for _, o := range options {
		o(componentHandler)
	}
	return adaptor.HTTPHandler(componentHandler)(c)
}

func Home(c *fiber.Ctx) error {
	return Render(c, views.Layout(views.Home()))
}

func LoginPage(c *fiber.Ctx) error {
	return Render(c, views.Layout(views.Login()))
}

func SignupPage(c *fiber.Ctx) error {
	return Render(c, views.Layout(views.Signup()))
}

func Setup(c *fiber.Ctx) error {
	return Render(c, views.Layout(views.Setup()))
}

func Faq(c *fiber.Ctx) error {
	return Render(c, views.Layout(views.FAQ()))
}

func Contact(c *fiber.Ctx) error {
	return Render(c, views.Layout(views.Contact()))
}

func PastEvents(c *fiber.Ctx) error {
	db := database.Get()
	today := time.Now()
	todayDbFormat := today.Format("2006-01-02 00:00:00+00:00")
	todayHtmlFormat := today.Format("2006-01-02")

	var event models.Event
	err := db.Where("date = ?", todayDbFormat).First(&event).Error
	if err != nil {
		fmt.Println(err)
	}

	var participants []models.Participant
	err = db.Where("event_id = ?", event.ID).Find(&participants).Error
	if err != nil {
		fmt.Println(err)
	}

	return Render(c, views.Layout(views.PastEvents(participants, todayHtmlFormat)))
}

func Event(c *fiber.Ctx) error {
	db := database.Get()

	var events []models.Event
	err := db.Find(&events, "is_complete = ?", false).Error
	if (err != nil) {
		fmt.Println(err)
		return c.Redirect("/")
	}

	return Render(c, views.Layout(views.Event(events, time.Now().Format("2006-01-02"))))
	
}

func Participants(c *fiber.Ctx) error {
	db := database.Get()

	eventIdInt, err := strconv.Atoi(c.Params("eventId"))
	if err != nil {
		fmt.Println(err)
	}

	// If the event doesn't exist or it's complete, redirect to events.
	var event models.Event
	err = db.First(&event, eventIdInt).Error
	if (errors.Is(err, gorm.ErrRecordNotFound) || event.IsComplete) {
		return c.Redirect("/events")
	}

	var participants []models.Participant
	err = db.Order("bib desc").Find(&participants, models.Participant{EventID: eventIdInt}).Error
	if err != nil {
		fmt.Println(err)
	}

	return Render(c, views.Layout(views.Participants(c.Params("eventId"), participants)))
	
}

func Timing(c *fiber.Ctx) error {
	db := database.Get()

	eventIdInt, err := strconv.Atoi(c.Params("eventId"))
	if err != nil {
		fmt.Println(err)
	}

	// If the event doesn't exist or it's complete, redirect to events.
	var event models.Event
	err = db.First(&event, eventIdInt).Error
	if (errors.Is(err, gorm.ErrRecordNotFound) || event.IsComplete) {
		return c.Redirect("/events")
	}

	var participants []models.Participant
	err = db.Find(&participants, models.Participant{EventID: eventIdInt}).Error
	if err != nil {
		fmt.Println(err)
	}

	return Render(c, views.Layout(views.Timing(c.Params("eventId"), participants)))
	
}
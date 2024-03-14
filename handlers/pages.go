package handlers

import (
	"errors"
	"fmt"
	"runclub/database"
	"runclub/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Home(c *fiber.Ctx) error {
	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/home/index", nil, "layout/main")
	}

	return c.Render("pages/home/index", nil)
}

func LoginPage(c *fiber.Ctx) error {
	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/login/index", nil, "layout/main")
	}

	return c.Render("pages/login/index", nil)
}

func SignupPage(c *fiber.Ctx) error {
	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/signup/index", nil, "layout/main")
	}

	return c.Render("pages/signup/index", nil)
}

func Setup(c *fiber.Ctx) error {
	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/setup/index", nil, "layout/main")
	}

	return c.Render("pages/setup/index", nil)
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

	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/pastEvents/index", fiber.Map{
			"participants": participants,
			"today": todayHtmlFormat,
		}, "layout/main")
	}

	return c.Render("pages/pastEvents/index", fiber.Map{
		"participants": participants,
		"today": time.Now().Format("2006-01-02"),
	},)
}

func Event(c *fiber.Ctx) error {
	db := database.Get()

	var events []models.Event
	err := db.Find(&events, "is_complete = ?", false).Error
	if (err != nil) {
		fmt.Println(err)
		return c.Redirect("/")
	}

	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/events/index", fiber.Map{
			"events": events,
			"today": time.Now().Format("2006-01-02"),
		}, "layout/main")
	}

	return c.Render("pages/events/index", fiber.Map{
		"events": events,
		"today": time.Now().Format("2006-01-02"),
	})
	
	
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

	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/participants/index", fiber.Map{
			"eventId": c.Params("eventId"),
			"participants": participants,
		}, "layout/main")
	}

	return c.Render("pages/participants/index", fiber.Map{
		"eventId": c.Params("eventId"),
		"participants": participants,
	})
	
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

	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/timing/index", fiber.Map{
			"participants": participants,
			"eventId": c.Params("eventId"),
		}, "layout/main")
	}

	return c.Render("pages/timing/index", fiber.Map{
		"participants": participants,
		"eventId": c.Params("eventId"),
	})
	
}

func Faq(c *fiber.Ctx) error {
	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/faq/index", nil, "layout/main")
	}

	return c.Render("pages/faq/index", nil)
}

func Contact(c *fiber.Ctx) error {
	if hxRequest := c.Get("HX-Request"); hxRequest == "" {
		return c.Render("pages/contact/index", nil, "layout/main")
	}

	return c.Render("pages/contact/index", nil)
}
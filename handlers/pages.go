package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func Home(c *fiber.Ctx) error {
	return c.Render("pages/home/index", nil, "layout/main")
}

func Event(c *fiber.Ctx) error {
	return c.Render("pages/events/index", nil, "layout/main")
}

func Participants(c *fiber.Ctx) error {
	return c.Render("pages/participants/index", fiber.Map{
		"eventId": c.Params("eventId"),
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
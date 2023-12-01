package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func Home(c *fiber.Ctx) error {
	return c.Render("home", nil, "layouts/main")
}

func Event(c *fiber.Ctx) error {
	return c.Render("events", nil, "layouts/main")
}

func Faq(c *fiber.Ctx) error {
	return c.Render("faq", nil, "layouts/main")
}

func Contact(c *fiber.Ctx) error {
	return c.Render("contact", nil, "layouts/main")
}
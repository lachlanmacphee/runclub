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

func Faq(c *fiber.Ctx) error {
	return c.Render("pages/faq/index", nil, "layout/main")
}

func Contact(c *fiber.Ctx) error {
	return c.Render("pages/contact/index", nil, "layout/main")
}
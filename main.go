package main

import (
	"log"
	"runclub/database"
	"runclub/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {

	database.Connect()

	// database.Migrate()

	// Create a new engine
    engine := html.New("./views", ".html")

    // Pass the engine to the Views
    app := fiber.New(fiber.Config{
        Views: engine,
    })

	// Pages
    app.Get("/", handlers.Home)
	app.Get("/events", handlers.Event)
	app.Get("/participants/:eventId", handlers.Participants)
	app.Get("/timing/:eventId", handlers.Timing)
	app.Get("/faq", handlers.Faq)
	app.Get("/contact", handlers.Contact)

	// API - Events
	app.Get("/api/event", handlers.GetEvents)
	app.Post("/api/event", handlers.CreateEvent)

	// API - Participants
	app.Post("/api/participant/:id", handlers.AddParticipant)

    log.Fatal(app.Listen(":5173"))
}
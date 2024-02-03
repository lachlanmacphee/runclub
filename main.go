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
	api := app.Group("/api")

	app.Static("/", "./public")

	// Unauthenticated Pages
    app.Get("/", handlers.Home)
	app.Get("/login", handlers.LoginPage)
	app.Get("/signup", handlers.SignupPage)

	// Unauthenticated API
	api.Post("/login", handlers.Login)
	api.Post("/signup", handlers.Signup)

	app.Use(handlers.AuthMiddleware)

	// Authenticated Pages
	app.Get("/welcome", handlers.Welcome)
	app.Get("/setup", handlers.Setup)
	app.Get("/pastevents", handlers.PastEvents)
	app.Get("/events", handlers.Event)
	app.Get("/participants/:eventId", handlers.Participants)
	app.Get("/timing/:eventId", handlers.Timing)
	app.Get("/faq", handlers.Faq)
	app.Get("/contact", handlers.Contact)
	
	// Authenticated API

	// API - Events
	api.Get("/event", handlers.GetEvents)
	api.Post("/event", handlers.CreateEvent)

	// API - Participants
	participant := api.Group("/participant")
	participant.Get("/date", handlers.GetParticipantsByDate)
	participant.Post("/event/:id", handlers.AddParticipant)
    participant.Post("/find", handlers.GetParticipants)

	// API - Timing
	api.Post("/timing/:eventId/:bib", handlers.TimeParticipant)

	// API - Contacts
	api.Post("/contact", handlers.SendEmail)

    log.Fatal(app.Listen(":5173"))
}
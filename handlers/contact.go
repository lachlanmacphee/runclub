package handlers

import (
	"fmt"
	"net/smtp"

	"github.com/gofiber/fiber/v2"
)

func SendEmail(c *fiber.Ctx) error {
	payload := struct {
		FirstName  string `json:"firstName"`
		LastName string `json:"lastName"`
		EmailAddress string `json:"emailAddress"`
		PhoneNumber string `json:"phoneNumber"`
		Subject string `json:"subject"`
		Comments string `json:"comments"`
	}{}

	// Message.
	message := []byte(fmt.Sprintf(`
	From: %s %s
	Phone: %s
	Subject: %s
	Comments: %s
	`, payload.FirstName, payload.LastName, payload.PhoneNumber, payload.Subject, payload.Comments))
  
	// smtp server configuration.
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
  
	from := "your-email-address-here"
	password := "your-email-password-here"
  
	to := []string{
	  "your-email-address-here",
	}
	
	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)
	
	// Sending email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, payload.EmailAddress, to, message)
	if err != nil {
	  fmt.Println(err)
	}

	return c.SendStatus(200)
}
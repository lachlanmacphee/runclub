package types

type SignupCredentials struct {
	Name string `json:"name"`
	Role string `json:"role"`
	Email string `json:"email"`
	Password string `json:"password"`
}
type LoginCredentials struct {
	Email string `json:"email"`
	Password string `json:"password"`
}
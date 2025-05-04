package usersHandler

import (
	"fmt"
	"net/http"
)

type usersHandler struct{}

func New() *usersHandler {
	return &usersHandler{}
}

func (u *usersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		fmt.Fprintln(w, "GET /users")
	case "POST":
		fmt.Fprintln(w, "POST /users")
	case "PUT":
		fmt.Fprintln(w, "PUT /users")
	case "DELETE":
		fmt.Fprintln(w, "DELETE /users")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

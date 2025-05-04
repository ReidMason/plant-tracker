package usersHandler

import (
	"fmt"
	"net/http"

	apiResponse "github.com/ReidMason/plant-tracker/src/httpHandlers/models"
	"github.com/ReidMason/plant-tracker/src/httpHandlers/usersHandler/userDtos"
	usersService "github.com/ReidMason/plant-tracker/src/services"
)

type usersHandler struct {
	usersService usersService.GetUsersService
}

func New(usersService usersService.GetUsersService) *usersHandler {
	return &usersHandler{
		usersService: usersService,
	}
}

func (u *usersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		users := u.usersService.GetUsers()
		apiResponse.Ok(w, userDtos.FromStoreUsers(users))
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

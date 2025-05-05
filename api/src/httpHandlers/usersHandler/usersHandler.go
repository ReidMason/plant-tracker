package usersHandler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	apiResponse "github.com/ReidMason/plant-tracker/src/httpHandlers/models"
	"github.com/ReidMason/plant-tracker/src/httpHandlers/usersHandler/userDtos"
	usersStore "github.com/ReidMason/plant-tracker/src/stores/usersStore"
)

type UsersHandlerService interface {
	GetUsers() []usersStore.User
	GetUserByID(id int) *usersStore.User
	CreateUser(name string) usersStore.User
}

type usersHandler struct {
	usersService UsersHandlerService
}

func New(usersService UsersHandlerService) *usersHandler {
	return &usersHandler{
		usersService: usersService,
	}
}

func (u *usersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	if strings.HasPrefix(path, "/users/") {
		u.handleSingleUser(w, r)
		return
	}

	switch r.Method {
	case "GET":
		users := u.usersService.GetUsers()
		apiResponse.Ok(w, userDtos.FromStoreUsers(users))
	case "POST":
		u.handleCreateUser(w, r)
	case "PUT":
		fmt.Fprintln(w, "PUT /users")
	case "DELETE":
		fmt.Fprintln(w, "DELETE /users")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (u *usersHandler) handleSingleUser(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.PathValue("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	switch r.Method {
	case "GET":
		user := u.usersService.GetUserByID(userID)
		if user == nil {
			apiResponse.NotFound(w)
			return
		}
		apiResponse.Ok(w, userDtos.FromStoreUser(*user))
	case "PUT":
		fmt.Fprintln(w, "PUT /users/{id}")
	case "DELETE":
		fmt.Fprintln(w, "DELETE /users/{id}")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (u *usersHandler) handleCreateUser(w http.ResponseWriter, r *http.Request) {
	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		apiResponse.InternalServerError[any](w, []string{"Failed to read request body"})
		return
	}
	defer r.Body.Close()

	// Parse request body
	var createUserDto userDtos.CreateUserDto
	err = json.Unmarshal(body, &createUserDto)
	if err != nil {
		apiResponse.BadRequest[any](w, []string{"Failed to parse request body"})
		return
	}

	// Validate request
	if createUserDto.Name == "" {
		apiResponse.BadRequest[any](w, []string{"Name is required"})
		return
	}

	// Create user
	newUser := u.usersService.CreateUser(createUserDto.Name)
	apiResponse.Created(w, newUser)
}

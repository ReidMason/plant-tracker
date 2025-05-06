package usersService

import (
	"math/rand"
	"time"

	usersStore "github.com/ReidMason/plant-tracker/src/stores/usersStore"
)

// Available colours for users
var colours = []string{
	"#F44336", // Red
	"#E91E63", // Pink
	"#9C27B0", // Purple
	"#673AB7", // Deep Purple
	"#3F51B5", // Indigo
	"#2196F3", // Blue
	"#03A9F4", // Light Blue
	"#00BCD4", // Cyan
	"#009688", // Teal
	"#4CAF50", // Green
	"#8BC34A", // Light Green
	"#CDDC39", // Lime
	"#FFEB3B", // Yellow
	"#FFC107", // Amber
	"#FF9800", // Orange
	"#FF5722", // Deep Orange
}

// GetRandomColour returns a random colour from the colours slice
func GetRandomColour() string {
	rand.Seed(time.Now().UnixNano())
	return colours[rand.Intn(len(colours))]
}

type GetUsersService interface {
	GetUsers() []usersStore.User
	GetUserByID(id int) *usersStore.User
	CreateUser(name string) usersStore.User
}

type UsersService struct {
	usersStore usersStore.UsersStore
}

func New(usersStore usersStore.UsersStore) *UsersService {
	return &UsersService{
		usersStore: usersStore,
	}
}

func (u *UsersService) GetUsers() []usersStore.User {
	return u.usersStore.GetUsers()
}

func (u *UsersService) GetUserByID(id int) *usersStore.User {
	return u.usersStore.GetUserByID(id)
}

func (u *UsersService) CreateUser(name string) usersStore.User {
	// Generate a random colour for the new user
	colour := GetRandomColour()
	return u.usersStore.CreateUser(name, colour)
}

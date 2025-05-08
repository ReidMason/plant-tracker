package usersService

import (
	"context"
	"math/rand"
	"time"

	"github.com/ReidMason/plant-tracker/src/stores/database"
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
	GetUsers() ([]database.User, error)
	GetUserById(id int64) (database.User, error)
	CreateUser(name string) (database.User, error)
}

type UsersService struct {
	usersStore usersStore.UsersStore
	ctx        context.Context
}

func New(ctx context.Context, usersStore usersStore.UsersStore) *UsersService {
	return &UsersService{
		usersStore: usersStore,
		ctx:        ctx,
	}
}

func (u *UsersService) GetUsers() ([]database.User, error) {
	return u.usersStore.GetUsers(u.ctx)
}

func (u *UsersService) GetUserById(id int64) (database.User, error) {
	return u.usersStore.GetUserById(u.ctx, id)
}

func (u *UsersService) CreateUser(name string) (database.User, error) {
	return u.usersStore.CreateUser(u.ctx, database.CreateUserParams{
		Name:   name,
		Colour: GetRandomColour(),
	})
}

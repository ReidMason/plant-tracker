package usersService

import usersStore "github.com/ReidMason/plant-tracker/src/stores/usersStore"

type GetUsersService interface {
	GetUsers() []usersStore.User
	GetUserByID(id int) *usersStore.User
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

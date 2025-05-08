package userDtos

import (
	"github.com/ReidMason/plant-tracker/src/stores/database"
)

type UserResponseDto struct {
	Name   string `json:"name"`
	Colour string `json:"colour"`
	Id     int64  `json:"id"`
}

func FromStoreUsers(users []database.User) []*UserResponseDto {
	usersDto := make([]*UserResponseDto, len(users))
	for i, user := range users {
		usersDto[i] = FromStoreUser(user)
	}

	return usersDto
}

func FromStoreUser(user database.User) *UserResponseDto {
	return &UserResponseDto{
		Id:     user.ID,
		Name:   user.Name,
		Colour: user.Colour,
	}
}

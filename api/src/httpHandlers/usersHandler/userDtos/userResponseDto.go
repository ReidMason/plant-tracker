package userDtos

import usersStore "github.com/ReidMason/plant-tracker/src/stores/usersStore"

type UserResponseDto struct {
	Name   string `json:"name"`
	Id     int    `json:"id"`
	Colour string `json:"colour"`
}

func FromStoreUsers(users []usersStore.User) []*UserResponseDto {
	usersDto := make([]*UserResponseDto, len(users))
	for i, user := range users {
		usersDto[i] = FromStoreUser(user)
	}

	return usersDto
}

func FromStoreUser(user usersStore.User) *UserResponseDto {
	return &UserResponseDto{
		Id:     user.GetId(),
		Name:   user.GetName(),
		Colour: user.GetColour(),
	}
}

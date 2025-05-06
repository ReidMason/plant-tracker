package usersStore

type User struct {
	name   string
	id     int
	colour string
}

func (u *User) GetId() int {
	return u.id
}

func (u *User) GetName() string {
	return u.name
}

func (u *User) GetColour() string {
	return u.colour
}

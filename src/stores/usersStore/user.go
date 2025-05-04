package usersStore

type User struct {
	name string
	id   int
}

func (u *User) GetId() int {
	return u.id
}

func (u *User) GetName() string {
	return u.name
}

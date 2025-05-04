package usersStore

type UsersStore interface {
	GetUsers() []User
	GetUserByID(id int) *User
}

type InMemoryUsersStore struct {
	users []User
}

func NewInMemoryUsersStore() *InMemoryUsersStore {
	return &InMemoryUsersStore{
		users: []User{
			{id: 1, name: "John Doe"},
			{id: 2, name: "Jane Smith"},
			{id: 3, name: "Alice Johnson"},
		},
	}
}

func (s *InMemoryUsersStore) GetUsers() []User {
	return s.users
}

func (s *InMemoryUsersStore) GetUserByID(id int) *User {
	for _, user := range s.users {
		if user.id == id {
			return &user
		}
	}
	return nil
}

package usersStore

type UsersStore interface {
	GetUsers() []User
	GetUserByID(id int) *User
	CreateUser(name string) User
}

type InMemoryUsersStore struct {
	users  []User
	nextId int
}

func NewInMemoryUsersStore() *InMemoryUsersStore {
	return &InMemoryUsersStore{
		users: []User{
			{id: 1, name: "John Doe"},
			{id: 2, name: "Jane Smith"},
			{id: 3, name: "Alice Johnson"},
		},
		nextId: 4, // Start IDs after the initial users
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

func (s *InMemoryUsersStore) CreateUser(name string) User {
	newUser := User{
		id:   s.nextId,
		name: name,
	}

	s.users = append(s.users, newUser)
	s.nextId++

	return newUser
}

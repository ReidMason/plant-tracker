package plantstore

type PlantsStore interface {
	GetPlantsByUserId(userId int) []Plant
	GetPlantById(id int) *Plant
	CreatePlant(name string, userId int) Plant
}

type InMemoryPlantsStore struct {
	plants []Plant
	nextId int
}

func NewInMemoryPlantsStore() *InMemoryPlantsStore {
	return &InMemoryPlantsStore{
		plants: []Plant{
			{id: 1, userId: 1, name: "Plant 1"},
			{id: 2, userId: 1, name: "Plant 2"},
			{id: 3, userId: 1, name: "Plant 3"},
		},
		nextId: 4, // Start IDs after the initial plants
	}
}

func (s *InMemoryPlantsStore) GetPlantsByUserId(userId int) []Plant {
	userPlants := make([]Plant, 0)
	for _, plant := range s.plants {
		if plant.userId == userId {
			userPlants = append(userPlants, plant)
		}
	}
	return userPlants
}

func (s *InMemoryPlantsStore) GetPlantById(id int) *Plant {
	for _, plant := range s.plants {
		if plant.id == id {
			return &plant
		}
	}
	return nil
}

func (s *InMemoryPlantsStore) CreatePlant(name string, userId int) Plant {
	newPlant := Plant{
		id:     s.nextId,
		userId: userId,
		name:   name,
	}

	s.plants = append(s.plants, newPlant)
	s.nextId++

	return newPlant
}

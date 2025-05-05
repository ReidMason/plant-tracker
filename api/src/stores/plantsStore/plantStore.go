package plantstore

type PlantsStore interface {
	GetPlantsByUserId(userId int) []Plant
	GetPlantById(id int) *Plant
}

type InMemoryPlantsStore struct {
	plants []Plant
}

func NewInMemoryPlantsStore() *InMemoryPlantsStore {
	return &InMemoryPlantsStore{
		plants: []Plant{
			{id: 1, userId: 1, name: "Plant 1"},
			{id: 2, userId: 1, name: "Plant 2"},
			{id: 3, userId: 1, name: "Plant 3"},
		},
	}
}

func (s *InMemoryPlantsStore) GetPlantsByUserId(userId int) []Plant {
	var userPlants []Plant
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

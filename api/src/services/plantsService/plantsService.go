package plantsService

import plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"

type GetPlantsService interface {
	GetPlantsByUserId(userId int) []plantstore.Plant
	GetPlantById(id int) *plantstore.Plant
}

type PlantsService struct {
	plantsStore plantstore.PlantsStore
}

func New(plantsStore plantstore.PlantsStore) *PlantsService {
	return &PlantsService{
		plantsStore: plantsStore,
	}
}

func (p *PlantsService) GetPlantsByUserId(userId int) []plantstore.Plant {
	return p.plantsStore.GetPlantsByUserId(userId)
}

func (p *PlantsService) GetPlantById(id int) *plantstore.Plant {
	return p.plantsStore.GetPlantById(id)
}

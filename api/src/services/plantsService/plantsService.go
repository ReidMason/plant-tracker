package plantsService

import (
	"context"

	"github.com/ReidMason/plant-tracker/src/stores/database"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type GetPlantsService interface {
	GetPlantsByUserId(userId int64) ([]database.Plant, error)
	GetPlantById(id int64) (database.Plant, error)
	CreatePlant(name string, userId int64) (database.Plant, error)
}

type PlantsService struct {
	plantsStore plantstore.PlantsStore
	ctx         context.Context
}

func New(ctx context.Context, plantsStore plantstore.PlantsStore) *PlantsService {
	return &PlantsService{
		plantsStore: plantsStore,
		ctx:         ctx,
	}
}

func (p *PlantsService) GetPlantsByUserId(userId int64) ([]database.Plant, error) {
	return p.plantsStore.GetPlantsByUserId(p.ctx, userId)
}

func (p *PlantsService) GetPlantById(id int64) (database.Plant, error) {
	return p.plantsStore.GetPlantById(p.ctx, id)
}

func (p *PlantsService) CreatePlant(name string, userId int64) (database.Plant, error) {
	return p.plantsStore.CreatePlant(p.ctx, database.CreatePlantParams{
		Name:   name,
		Userid: userId,
	})
}

package plantsService

import (
	"context"

	"github.com/ReidMason/plant-tracker/src/stores/database"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type GetPlantsService interface {
	GetPlantsByUserId(ctx context.Context, userId int64) ([]database.Plant, error)
	GetPlantById(ctx context.Context, id int64) (database.Plant, error)
	CreatePlant(ctx context.Context, name string, userId int64) (database.Plant, error)
}

type PlantsService struct {
	plantsStore plantstore.PlantsStore
}

func New(plantsStore plantstore.PlantsStore) *PlantsService {
	return &PlantsService{
		plantsStore: plantsStore,
	}
}

func (p *PlantsService) GetPlantsByUserId(ctx context.Context, userId int64) ([]database.Plant, error) {
	return p.plantsStore.GetPlantsByUserId(ctx, userId)
}

func (p *PlantsService) GetPlantById(ctx context.Context, id int64) (database.Plant, error) {
	return p.plantsStore.GetPlantById(ctx, id)
}

func (p *PlantsService) CreatePlant(ctx context.Context, name string, userId int64) (database.Plant, error) {
	return p.plantsStore.CreatePlant(ctx, database.CreatePlantParams{
		Name:   name,
		Userid: userId,
	})
}

package plantstore

import (
	"context"

	"github.com/ReidMason/plant-tracker/src/stores/database"
)

type PlantsStore interface {
	GetPlantsByUserId(ctx context.Context, userId int64) ([]database.Plant, error)
	GetPlantById(ctx context.Context, id int64) (database.Plant, error)
	CreatePlant(ctx context.Context, arg database.CreatePlantParams) (database.Plant, error)
}

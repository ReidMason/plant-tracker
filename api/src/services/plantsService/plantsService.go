package plantsService

import (
	"context"
	"time"

	"github.com/ReidMason/plant-tracker/src/services/eventsService"
	"github.com/ReidMason/plant-tracker/src/stores/database"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type GetPlantsService interface {
	GetPlantsByUserId(ctx context.Context, userId int64) ([]Plant, error)
	GetPlantById(ctx context.Context, id int64) (database.Plant, error)
	CreatePlant(ctx context.Context, name string, userId int64) (database.Plant, error)
}

type PlantsService struct {
	plantsStore plantstore.PlantsStore
	eventsStore eventsService.EventsService
}

type Plant struct {
	LatestWaterEvent database.Event
	NextWaterDue     time.Time
	Name             string
	Id               int64
}

func DatabasePlantToPlantModel(plant database.Plant) Plant {
	return Plant{
		Id:               plant.ID,
		Name:             plant.Name,
		LatestWaterEvent: database.Event{},
	}
}

func New(plantsStore plantstore.PlantsStore, eventsStore eventsService.EventsService) *PlantsService {
	return &PlantsService{
		plantsStore: plantsStore,
		eventsStore: eventsStore,
	}
}

func (p *PlantsService) GetPlantsByUserId(ctx context.Context, userId int64) ([]Plant, error) {
	plantsResult := make([]Plant, 0)

	plants, err := p.plantsStore.GetPlantsByUserId(ctx, userId)
	if err != nil {
		return plantsResult, err
	}

	for _, plant := range plants {
		plantsResult = append(plantsResult, DatabasePlantToPlantModel(plant))
	}

	for i, plant := range plantsResult {
		latestWaterEvent, err := p.eventsStore.GetLatestWaterEventByPlantId(ctx, plant.Id)
		if err != nil || latestWaterEvent == (database.Event{}) {
			continue
		}
		plantsResult[i].LatestWaterEvent = latestWaterEvent
		plantsResult[i].NextWaterDue = calculateNextWaterTime(latestWaterEvent.Timestamp)
	}

	return plantsResult, nil
}

func calculateNextWaterTime(lastWaterTime time.Time) time.Time {
	return lastWaterTime.AddDate(0, 0, 7)
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

package plantsService

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/ReidMason/plant-tracker/src/services/eventsService"
	"github.com/ReidMason/plant-tracker/src/stores/database"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type GetPlantsService interface {
	GetPlantsByUserId(ctx context.Context, userId int64) ([]Plant, error)
	GetPlantById(ctx context.Context, id int64) (Plant, error)
	CreatePlant(ctx context.Context, name string, userId int64) (database.Plant, error)
	UpdatePlant(ctx context.Context, id int64, name string) (Plant, error)
}

type PlantsService struct {
	plantsStore plantstore.PlantsStore
	eventsStore eventsService.EventsService
}

type Plant struct {
	LatestWaterEvent      database.Event
	LatestFertilizerEvent database.Event
	NextWaterDue          time.Time
	NextFertilizerDue     time.Time
	Name                  string
	Id                    int64
}

func DatabasePlantToPlantModel(plant database.Plant) Plant {
	return Plant{
		Id:                    plant.ID,
		Name:                  plant.Name,
		LatestWaterEvent:      database.Event{},
		LatestFertilizerEvent: database.Event{},
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
		// Get latest water and fertilizer events in a single query
		latestWaterEvent, latestFertilizerEvent, err := p.eventsStore.GetLatestWaterAndFertilizerEvents(ctx, plant.Id)
		if err != nil {
			// If there's an error, continue with the plant without events
			continue
		}

		// Set water event data if available
		if latestWaterEvent != (database.Event{}) {
			plantsResult[i].LatestWaterEvent = latestWaterEvent
			plantsResult[i].NextWaterDue = calculateNextWaterTime(latestWaterEvent.Timestamp)
		}

		// Set fertilizer event data if available
		if latestFertilizerEvent != (database.Event{}) {
			plantsResult[i].LatestFertilizerEvent = latestFertilizerEvent
			plantsResult[i].NextFertilizerDue = calculateNextFertilizerTime(latestFertilizerEvent.Timestamp)
		}
	}

	return plantsResult, nil
}

func calculateNextWaterTime(lastWaterTime time.Time) time.Time {
	return lastWaterTime.AddDate(0, 0, 7)
}

func calculateNextFertilizerTime(lastFertilizerTime time.Time) time.Time {
	return lastFertilizerTime.AddDate(0, 0, 30) // 30 days for fertilizer
}

func (p *PlantsService) GetPlantById(ctx context.Context, id int64) (Plant, error) {
	plant, err := p.plantsStore.GetPlantById(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Plant{}, nil
		}
		return Plant{}, err
	}
	model := DatabasePlantToPlantModel(plant)

	// Get latest water and fertilizer events in a single query
	latestWaterEvent, latestFertilizerEvent, err := p.eventsStore.GetLatestWaterAndFertilizerEvents(ctx, model.Id)
	if err == nil {
		// Set water event data if available
		if latestWaterEvent != (database.Event{}) {
			model.LatestWaterEvent = latestWaterEvent
			model.NextWaterDue = calculateNextWaterTime(latestWaterEvent.Timestamp)
		}

		// Set fertilizer event data if available
		if latestFertilizerEvent != (database.Event{}) {
			model.LatestFertilizerEvent = latestFertilizerEvent
			model.NextFertilizerDue = calculateNextFertilizerTime(latestFertilizerEvent.Timestamp)
		}
	}

	return model, nil
}

func (p *PlantsService) CreatePlant(ctx context.Context, name string, userId int64) (database.Plant, error) {
	return p.plantsStore.CreatePlant(ctx, database.CreatePlantParams{
		Name:   name,
		Userid: userId,
	})
}

func (p *PlantsService) UpdatePlant(ctx context.Context, id int64, name string) (Plant, error) {
	_, err := p.plantsStore.UpdatePlant(ctx, database.UpdatePlantParams{
		ID:   id,
		Name: name,
	})
	if err != nil {
		return Plant{}, err
	}
	// Fetch the updated plant and its latest water event
	return p.GetPlantById(ctx, id)
}

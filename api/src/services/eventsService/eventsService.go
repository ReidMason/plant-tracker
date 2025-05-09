package eventsService

import (
	"context"
	"time"

	"github.com/ReidMason/plant-tracker/src/stores/database"
	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
	plantsStore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type EventsService interface {
	GetEventsByPlantId(ctx context.Context, plantId int64) ([]database.Event, error)
	CreateWateringEvent(ctx context.Context, plantId int64, note string) (database.Event, error)
	GetEventById(ctx context.Context, id int64) (database.Event, error)
	GetLatestWaterEventByPlantId(ctx context.Context, plantid int64) (database.Event, error)
}

type eventsService struct {
	eventsStore eventsStore.EventsStore
	plantsStore plantsStore.PlantsStore
}

func New(eventsStore eventsStore.EventsStore, plantsStore plantsStore.PlantsStore) *eventsService {
	return &eventsService{
		eventsStore: eventsStore,
		plantsStore: plantsStore,
	}
}

func (s *eventsService) GetLatestWaterEventByPlantId(ctx context.Context, plantId int64) (database.Event, error) {
	return s.eventsStore.GetLatestWaterEventByPlantId(ctx, plantId)
}

func (s *eventsService) GetEventsByPlantId(ctx context.Context, plantId int64) ([]database.Event, error) {
	return s.eventsStore.GetEventsByPlantId(ctx, plantId)
}

func (s *eventsService) CreateWateringEvent(ctx context.Context, plantId int64, note string) (database.Event, error) {
	plant, err := s.plantsStore.GetPlantById(ctx, plantId)
	if err != nil {
		return database.Event{}, err
	}

	if plant == (database.Plant{}) {
		return database.Event{}, plantsErrorNotFound
	}

	var wateringEventTypeId int32 = 1
	return s.eventsStore.CreateEvent(ctx, database.CreateEventParams{
		Plantid:   plantId,
		Eventtype: wateringEventTypeId,
		Note:      "",
		Timestamp: time.Now(),
	})
}

func (s *eventsService) GetEventById(ctx context.Context, id int64) (database.Event, error) {
	return s.eventsStore.GetEventById(ctx, id)
}

type plantsError string

func (e plantsError) Error() string {
	return string(e)
}

const (
	plantsErrorNotFound plantsError = "plant not found"
)

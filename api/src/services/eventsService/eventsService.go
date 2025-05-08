package eventsService

import (
	"context"
	"time"

	"github.com/ReidMason/plant-tracker/src/stores/database"
	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
	plantsStore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type EventsService interface {
	GetEventsByPlantId(plantId int64) ([]database.Event, error)
	CreateWateringEvent(plantId int64, note string) (database.Event, error)
	GetEventById(id int64) (database.Event, error)
}

type eventsService struct {
	ctx         context.Context
	eventsStore eventsStore.EventsStore
	plantsStore plantsStore.PlantsStore
}

func New(ctx context.Context, eventsStore eventsStore.EventsStore, plantsStore plantsStore.PlantsStore) *eventsService {
	return &eventsService{
		ctx:         ctx,
		eventsStore: eventsStore,
		plantsStore: plantsStore,
	}
}

func (s *eventsService) GetEventsByPlantId(plantId int64) ([]database.Event, error) {
	return s.eventsStore.GetEventsByPlantId(s.ctx, plantId)
}

func (s *eventsService) CreateWateringEvent(plantId int64, note string) (database.Event, error) {
	plant, err := s.plantsStore.GetPlantById(s.ctx, plantId)
	if err != nil {
		return database.Event{}, err
	}

	if plant == (database.Plant{}) {
		return database.Event{}, plantsErrorNotFound
	}

	var wateringEventTypeId int32 = 1
	return s.eventsStore.CreateEvent(s.ctx, database.CreateEventParams{
		Plantid:   plantId,
		Eventtype: wateringEventTypeId,
		Note:      "",
		Timestamp: time.Now(),
	})
}

func (s *eventsService) GetEventById(id int64) (database.Event, error) {
	return s.eventsStore.GetEventById(s.ctx, id)
}

type plantsError string

func (e plantsError) Error() string {
	return string(e)
}

const (
	plantsErrorNotFound plantsError = "plant not found"
)

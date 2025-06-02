package eventsService

import (
	"context"
	"fmt"
	"time"

	"github.com/ReidMason/plant-tracker/src/stores/database"
	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
	plantsStore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type EventsService interface {
	GetEventsByPlantId(ctx context.Context, plantId int64) ([]database.Event, error)
	CreateEvent(ctx context.Context, plantId int64, eventType int32, note string) (database.Event, error)
	CreateWateringEvent(ctx context.Context, plantId int64, note string) (database.Event, error)
	CreateFertilizeEvent(ctx context.Context, plantId int64, note string) (database.Event, error)
	GetEventById(ctx context.Context, id int64) (database.Event, error)
	GetLatestEventsByTypeForPlant(ctx context.Context, plantid int64) ([]database.Event, error)
	GetLatestWaterAndFertilizerEvents(ctx context.Context, plantid int64) (waterEvent, fertilizerEvent database.Event, err error)
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

func (s *eventsService) GetEventsByPlantId(ctx context.Context, plantId int64) ([]database.Event, error) {
	return s.eventsStore.GetEventsByPlantId(ctx, plantId)
}

func (s *eventsService) CreateEvent(ctx context.Context, plantId int64, eventType int32, note string) (database.Event, error) {
	plant, err := s.plantsStore.GetPlantById(ctx, plantId)
	if err != nil {
		return database.Event{}, err
	}

	if plant == (database.Plant{}) {
		return database.Event{}, plantsErrorNotFound
	}

	return s.eventsStore.CreateEvent(ctx, database.CreateEventParams{
		Plantid:   plantId,
		Eventtype: eventType,
		Note:      note,
		Timestamp: time.Now(),
	})
}

func (s *eventsService) CreateWateringEvent(ctx context.Context, plantId int64, note string) (database.Event, error) {
	return s.CreateEvent(ctx, plantId, 1, note)
}

func (s *eventsService) CreateFertilizeEvent(ctx context.Context, plantId int64, note string) (database.Event, error) {
	fmt.Println("Creating fertilize event")
	return s.CreateEvent(ctx, plantId, 2, note)
}

func (s *eventsService) GetEventById(ctx context.Context, id int64) (database.Event, error) {
	return s.eventsStore.GetEventById(ctx, id)
}

func (s *eventsService) GetLatestEventsByTypeForPlant(ctx context.Context, plantId int64) ([]database.Event, error) {
	return s.eventsStore.GetLatestEventsByTypeForPlant(ctx, plantId)
}

// GetLatestWaterAndFertilizerEvents efficiently gets both water and fertilizer events in a single query
func (s *eventsService) GetLatestWaterAndFertilizerEvents(ctx context.Context, plantId int64) (waterEvent, fertilizerEvent database.Event, err error) {
	events, err := s.eventsStore.GetLatestEventsByTypeForPlant(ctx, plantId)
	if err != nil {
		return database.Event{}, database.Event{}, err
	}

	// Separate the events by type
	for _, event := range events {
		switch event.Eventtype {
		case 1: // Water event
			waterEvent = event
		case 2: // Fertilizer event
			fertilizerEvent = event
		}
	}

	return waterEvent, fertilizerEvent, nil
}

type plantsError string

func (e plantsError) Error() string {
	return string(e)
}

const (
	plantsErrorNotFound plantsError = "plant not found"
)

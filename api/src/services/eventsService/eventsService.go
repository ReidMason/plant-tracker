package eventsService

import (
	"context"
	"time"

	"github.com/ReidMason/plant-tracker/src/stores/database"
	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
	plantsStore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

// EventsService defines the interface for event-related operations
type EventsService interface {
	GetEventsByPlantId(plantId int64) ([]database.Event, error)
	CreateWateringEvent(plantId int64, note string) (database.Event, error)
	GetEventById(id int64) (database.Event, error)
}

// eventsService implements EventsService
type eventsService struct {
	ctx         context.Context
	eventsStore eventsStore.EventsStore
	plantsStore plantsStore.PlantsStore
}

// New creates a new events service
func New(ctx context.Context, eventsStore eventsStore.EventsStore, plantsStore plantsStore.PlantsStore) *eventsService {
	return &eventsService{
		ctx:         ctx,
		eventsStore: eventsStore,
		plantsStore: plantsStore,
	}
}

// GetEventsByPlantId returns all events for a specific plant
func (s *eventsService) GetEventsByPlantId(plantId int64) ([]database.Event, error) {
	return s.eventsStore.GetEventsByPlantId(s.ctx, plantId)
}

// CreateWateringEvent creates a new watering event for a plant
func (s *eventsService) CreateWateringEvent(plantId int64, note string) (database.Event, error) {
	// Verify the plant exists
	plant, err := s.plantsStore.GetPlantById(s.ctx, plantId)
	if err != nil {
		return database.Event{}, err
	}

	if plant == (database.Plant{}) {
		return database.Event{}, plantsErrorNotFound
	}

	// Create the watering event with the current time
	var wateringEventTypeId int32 = 1
	return s.eventsStore.CreateEvent(s.ctx, database.CreateEventParams{
		Plantid:   plantId,
		Eventtype: wateringEventTypeId,
		Note:      "",
		Timestamp: time.Now(),
	})
}

// GetEventById returns an event by its ID
func (s *eventsService) GetEventById(id int64) (database.Event, error) {
	return s.eventsStore.GetEventById(s.ctx, id)
}

// Custom error types
type plantsError string

func (e plantsError) Error() string {
	return string(e)
}

const (
	plantsErrorNotFound plantsError = "plant not found"
)

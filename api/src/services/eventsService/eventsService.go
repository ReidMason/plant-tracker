package eventsService

import (
	"time"

	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
	plantsStore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

// EventsService defines the interface for event-related operations
type EventsService interface {
	GetEventsByPlantId(plantId int) []eventsStore.Event
	CreateWateringEvent(plantId int, note string) (eventsStore.Event, error)
	GetEventById(id int) *eventsStore.Event
}

// eventsService implements EventsService
type eventsService struct {
	eventsStore eventsStore.EventsStore
	plantsStore plantsStore.PlantsStore
}

// New creates a new events service
func New(eventsStore eventsStore.EventsStore, plantsStore plantsStore.PlantsStore) *eventsService {
	return &eventsService{
		eventsStore: eventsStore,
		plantsStore: plantsStore,
	}
}

// GetEventsByPlantId returns all events for a specific plant
func (s *eventsService) GetEventsByPlantId(plantId int) []eventsStore.Event {
	return s.eventsStore.GetEventsByPlantId(plantId)
}

// CreateWateringEvent creates a new watering event for a plant
func (s *eventsService) CreateWateringEvent(plantId int, note string) (eventsStore.Event, error) {
	// Verify the plant exists
	plant := s.plantsStore.GetPlantById(plantId)
	if plant == nil {
		return eventsStore.Event{}, plantsErrorNotFound
	}

	// Create the watering event with the current time
	return s.eventsStore.CreateEvent(
		plantId,
		eventsStore.EventTypeWatering,
		note,
		time.Now(),
	), nil
}

// GetEventById returns an event by its ID
func (s *eventsService) GetEventById(id int) *eventsStore.Event {
	return s.eventsStore.GetEventById(id)
}

// Custom error types
type plantsError string

func (e plantsError) Error() string {
	return string(e)
}

const (
	plantsErrorNotFound plantsError = "plant not found"
)

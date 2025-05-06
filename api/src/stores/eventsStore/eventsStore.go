package eventsStore

import (
	"time"
)

// EventsStore defines the interface for event-related data operations
type EventsStore interface {
	GetEventsByPlantId(plantId int) []Event
	CreateEvent(plantId int, eventType EventType, note string, timestamp time.Time) Event
	GetEventById(id int) *Event
}

// InMemoryEventsStore implements EventsStore with an in-memory data store
type InMemoryEventsStore struct {
	events []Event
	nextId int
}

// NewInMemoryEventsStore creates a new in-memory events store
func NewInMemoryEventsStore() *InMemoryEventsStore {
	return &InMemoryEventsStore{
		events: []Event{},
		nextId: 1, // Start IDs at 1
	}
}

// GetEventsByPlantId returns all events for a specific plant
func (s *InMemoryEventsStore) GetEventsByPlantId(plantId int) []Event {
	var plantEvents []Event

	for _, event := range s.events {
		if event.plantId == plantId {
			plantEvents = append(plantEvents, event)
		}
	}

	return plantEvents
}

// CreateEvent adds a new event for a plant
func (s *InMemoryEventsStore) CreateEvent(plantId int, eventType EventType, note string, timestamp time.Time) Event {
	newEvent := Event{
		id:        s.nextId,
		plantId:   plantId,
		type_:     eventType,
		note:      note,
		timestamp: timestamp,
	}

	s.events = append(s.events, newEvent)
	s.nextId++

	return newEvent
}

// GetEventById returns an event by its ID
func (s *InMemoryEventsStore) GetEventById(id int) *Event {
	for _, event := range s.events {
		if event.id == id {
			return &event
		}
	}

	return nil
}

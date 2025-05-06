package eventsStore

import (
	"time"
)

// EventType represents different types of events that can happen to plants
type EventType string

const (
	EventTypeWatering EventType = "watering"
	// Future event types can be added here:
	// EventTypeFertilizing EventType = "fertilizing"
	// EventTypePruning    EventType = "pruning"
	// EventTypeRepotting  EventType = "repotting"
)

// Event represents an event that happened to a plant
type Event struct {
	id        int
	plantId   int
	type_     EventType
	note      string
	timestamp time.Time
}

// GetId returns the id of the event
func (e *Event) GetId() int {
	return e.id
}

// GetPlantId returns the plant id associated with the event
func (e *Event) GetPlantId() int {
	return e.plantId
}

// GetType returns the type of the event
func (e *Event) GetType() EventType {
	return e.type_
}

// GetNote returns the note associated with the event
func (e *Event) GetNote() string {
	return e.note
}

// GetTimestamp returns when the event occurred
func (e *Event) GetTimestamp() time.Time {
	return e.timestamp
}

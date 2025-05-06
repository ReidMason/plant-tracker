package eventDtos

import (
	"time"

	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
)

// EventResponseDto represents an event returned to the client
type EventResponseDto struct {
	Id        int       `json:"id"`
	PlantId   int       `json:"plantId"`
	Type      string    `json:"type"`
	Note      string    `json:"note"`
	Timestamp time.Time `json:"timestamp"`
}

// FromStoreEvents converts multiple store events to response DTOs
func FromStoreEvents(events []eventsStore.Event) []*EventResponseDto {
	eventsDto := make([]*EventResponseDto, len(events))
	for i, event := range events {
		eventsDto[i] = FromStoreEvent(event)
	}

	return eventsDto
}

// FromStoreEvent converts a single store event to a response DTO
func FromStoreEvent(event eventsStore.Event) *EventResponseDto {
	return &EventResponseDto{
		Id:        event.GetId(),
		PlantId:   event.GetPlantId(),
		Type:      string(event.GetType()),
		Note:      event.GetNote(),
		Timestamp: event.GetTimestamp(),
	}
}

package eventDtos

import (
	"time"

	"github.com/ReidMason/plant-tracker/src/stores/database"
)

// EventResponseDto represents an event returned to the client
type EventResponseDto struct {
	Id        int64     `json:"id"`
	PlantId   int64     `json:"plantId"`
	TypeId    int32     `json:"type"`
	Note      string    `json:"note"`
	Timestamp time.Time `json:"timestamp"`
}

// FromStoreEvents converts multiple store events to response DTOs
func FromStoreEvents(events []database.Event) []EventResponseDto {
	eventsDto := make([]EventResponseDto, len(events))
	for i, event := range events {
		eventsDto[i] = FromStoreEvent(event)
	}

	return eventsDto
}

// FromStoreEvent converts a single store event to a response DTO
func FromStoreEvent(event database.Event) EventResponseDto {
	return EventResponseDto{
		Id:      event.ID,
		PlantId: event.Plantid,
		TypeId:  event.Eventtype,
		Note:    event.Note,
		// Timestamp: event.Timestamp,
	}
}

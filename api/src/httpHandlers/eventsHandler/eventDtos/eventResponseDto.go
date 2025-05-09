package eventDtos

import (
	"time"

	"github.com/ReidMason/plant-tracker/src/stores/database"
)

type EventResponseDto struct {
	Timestamp time.Time `json:"timestamp"`
	Note      string    `json:"note"`
	Id        int64     `json:"id"`
	PlantId   int64     `json:"plantId"`
	TypeId    int32     `json:"typeId"`
}

func FromStoreEvents(events []database.Event) []EventResponseDto {
	eventsDto := make([]EventResponseDto, len(events))
	for i, event := range events {
		eventsDto[i] = FromStoreEvent(event)
	}

	return eventsDto
}

func FromStoreEvent(event database.Event) EventResponseDto {
	return EventResponseDto{
		Id:        event.ID,
		PlantId:   event.Plantid,
		TypeId:    event.Eventtype,
		Note:      event.Note,
		Timestamp: event.Timestamp,
	}
}

package eventsStore

import (
	"context"

	"github.com/ReidMason/plant-tracker/src/stores/database"
)

type EventsStore interface {
	CreateEvent(ctx context.Context, arg database.CreateEventParams) (database.Event, error)
	GetEventById(ctx context.Context, id int64) (database.Event, error)
	GetEventsByPlantId(ctx context.Context, plantid int64) ([]database.Event, error)
	GetLatestWaterEventByPlantId(ctx context.Context, plantid int64) (database.Event, error)
	GetLatestFertilizerEventByPlantId(ctx context.Context, plantid int64) (database.Event, error)
}

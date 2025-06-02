package plantDtos

import (
	"time"

	"github.com/ReidMason/plant-tracker/src/httpHandlers/eventsHandler/eventDtos"
	"github.com/ReidMason/plant-tracker/src/services/plantsService"
	"github.com/ReidMason/plant-tracker/src/stores/database"
)

type PlantResponseDto struct {
	LastWaterEvent      *eventDtos.EventResponseDto `json:"lastWaterEvent"`
	LastFertilizerEvent *eventDtos.EventResponseDto `json:"lastFertilizerEvent"`
	NextWaterDue        *time.Time                  `json:"nextWaterDue"`
	NextFertilizerDue   *time.Time                  `json:"nextFertilizerDue"`
	Name                string                      `json:"name"`
	Id                  int64                       `json:"id"`
}

func FromStorePlants(plants []database.Plant) []*PlantResponseDto {
	plantsDto := make([]*PlantResponseDto, len(plants))
	for i, plant := range plants {
		plantsDto[i] = FromStorePlant(plant)
	}

	return plantsDto
}

func FromServicePlants(plants []plantsService.Plant) []*PlantResponseDto {
	plantsDto := make([]*PlantResponseDto, len(plants))
	for i, plant := range plants {
		plantsDto[i] = FromServicePlant(plant)
	}

	return plantsDto
}

func FromServicePlant(plant plantsService.Plant) *PlantResponseDto {
	response := &PlantResponseDto{
		Id:   plant.Id,
		Name: plant.Name,
	}

	if plant.LatestWaterEvent != (database.Event{}) {
		response.LastWaterEvent = eventDtos.FromStoreEvent(plant.LatestWaterEvent)
	}

	if plant.LatestFertilizerEvent != (database.Event{}) {
		response.LastFertilizerEvent = eventDtos.FromStoreEvent(plant.LatestFertilizerEvent)
	}

	if plant.NextWaterDue != (time.Time{}) {
		response.NextWaterDue = &plant.NextWaterDue
	}

	if plant.NextFertilizerDue != (time.Time{}) {
		response.NextFertilizerDue = &plant.NextFertilizerDue
	}

	return response
}

func FromStorePlant(plant database.Plant) *PlantResponseDto {
	return &PlantResponseDto{
		Id:   plant.ID,
		Name: plant.Name,
	}
}

package plantDtos

import plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"

type PlantResponseDto struct {
	Id     int    `json:"id"`
	UserId int    `json:"userId"`
	Name   string `json:"name"`
}

func FromStorePlants(plants []plantstore.Plant) []*PlantResponseDto {
	plantsDto := make([]*PlantResponseDto, len(plants))
	for i, plant := range plants {
		plantsDto[i] = FromStorePlant(plant)
	}

	return plantsDto
}

func FromStorePlant(plant plantstore.Plant) *PlantResponseDto {
	return &PlantResponseDto{
		Id:     plant.GetId(),
		UserId: plant.GetUserId(),
		Name:   plant.GetName(),
	}
}

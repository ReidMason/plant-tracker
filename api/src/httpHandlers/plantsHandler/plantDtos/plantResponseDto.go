package plantDtos

import (
	"github.com/ReidMason/plant-tracker/src/stores/database"
)

type PlantResponseDto struct {
	Id     int64  `json:"id"`
	UserId int64  `json:"userId"`
	Name   string `json:"name"`
}

func FromStorePlants(plants []database.Plant) []*PlantResponseDto {
	plantsDto := make([]*PlantResponseDto, len(plants))
	for i, plant := range plants {
		plantsDto[i] = FromStorePlant(plant)
	}

	return plantsDto
}

func FromStorePlant(plant database.Plant) *PlantResponseDto {
	return &PlantResponseDto{
		Id:     plant.ID,
		UserId: plant.Userid,
		Name:   plant.Name,
	}
}

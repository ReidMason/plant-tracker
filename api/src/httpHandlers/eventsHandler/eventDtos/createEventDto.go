package eventDtos

// CreateEventDto represents the data needed to create a new event
type CreateEventDto struct {
	Note    string `json:"note"`
	PlantId int    `json:"plantId"`
}

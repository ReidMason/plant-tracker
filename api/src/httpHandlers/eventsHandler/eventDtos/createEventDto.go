package eventDtos

// CreateEventDto represents the data needed to create a new event
type CreateEventDto struct {
	PlantId int    `json:"plantId"`
	Note    string `json:"note"`
}

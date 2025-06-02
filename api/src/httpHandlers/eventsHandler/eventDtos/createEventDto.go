package eventDtos

// CreateEventDto represents the data needed to create a new event
type CreateEventDto struct {
	EventType int32  `json:"eventType"`
	Note      string `json:"note"`
	PlantId   int    `json:"plantId"`
}

package eventsHandler

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/ReidMason/plant-tracker/src/httpHandlers/eventsHandler/eventDtos"
	apiResponse "github.com/ReidMason/plant-tracker/src/httpHandlers/models"
	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
)

// EventsHandlerService defines the interface for the events service used by the handler
type EventsHandlerService interface {
	GetEventsByPlantId(plantId int) []eventsStore.Event
	CreateWateringEvent(plantId int, note string) (eventsStore.Event, error)
	GetEventById(id int) *eventsStore.Event
}

// eventsHandler implements the HTTP handler for events
type eventsHandler struct {
	eventsService EventsHandlerService
}

// New creates a new events handler
func New(eventsService EventsHandlerService) *eventsHandler {
	return &eventsHandler{
		eventsService: eventsService,
	}
}

// ServeHTTP handles HTTP requests for events
func (h *eventsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path

	// Handle specific event by ID
	if strings.HasPrefix(path, "/events/") && !strings.Contains(path[8:], "/") {
		h.handleSingleEvent(w, r)
		return
	}

	// Handle events for a specific plant
	if strings.HasPrefix(path, "/plants/") && strings.Contains(path, "/events") {
		h.handlePlantEvents(w, r)
		return
	}

	// Handle all events
	switch r.Method {
	case "POST":
		h.handleCreateEvent(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// handleSingleEvent handles requests for a specific event
func (h *eventsHandler) handleSingleEvent(w http.ResponseWriter, r *http.Request) {
	eventIDStr := r.PathValue("id")
	eventID, err := strconv.Atoi(eventIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	event := h.eventsService.GetEventById(eventID)
	if event == nil {
		apiResponse.NotFound(w)
		return
	}

	apiResponse.Ok(w, eventDtos.FromStoreEvent(*event))
}

// handlePlantEvents handles requests for events related to a specific plant
func (h *eventsHandler) handlePlantEvents(w http.ResponseWriter, r *http.Request) {
	plantIDStr := r.PathValue("id")
	plantID, err := strconv.Atoi(plantIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	if r.Method == "GET" {
		events := h.eventsService.GetEventsByPlantId(plantID)
		apiResponse.Ok(w, eventDtos.FromStoreEvents(events))
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

// handleCreateEvent handles requests to create a new event
func (h *eventsHandler) handleCreateEvent(w http.ResponseWriter, r *http.Request) {
	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		apiResponse.InternalServerError[any](w, []string{"Failed to read request body"})
		return
	}
	defer r.Body.Close()

	// Parse request body
	var createEventDto eventDtos.CreateEventDto
	err = json.Unmarshal(body, &createEventDto)
	if err != nil {
		apiResponse.BadRequest[any](w, []string{"Failed to parse request body"})
		return
	}

	// Validate request
	if createEventDto.PlantId <= 0 {
		apiResponse.BadRequest[any](w, []string{"Plant ID is required"})
		return
	}

	// Create watering event
	newEvent, err := h.eventsService.CreateWateringEvent(createEventDto.PlantId, createEventDto.Note)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	// Return the created event
	apiResponse.Created(w, eventDtos.FromStoreEvent(newEvent))
}

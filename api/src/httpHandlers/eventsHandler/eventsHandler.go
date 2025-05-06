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

	// Handle plant events (e.g. /users/{userId}/plants/{plantId}/events)
	if strings.HasPrefix(path, "/users/") && strings.Contains(path, "/plants/") && strings.HasSuffix(path, "/events") {
		h.handlePlantEvents(w, r)
		return
	}

	// If we get here, no route matched
	http.Error(w, "Not found", http.StatusNotFound)
}

// handlePlantEvents handles requests for events related to a specific plant
func (h *eventsHandler) handlePlantEvents(w http.ResponseWriter, r *http.Request) {
	// Extract plant ID from path
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 6 {
		apiResponse.NotFound(w)
		return
	}

	// Get plant ID from the URL
	plantIDStr := parts[4]
	plantID, err := strconv.Atoi(plantIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	switch r.Method {
	case "GET":
		// Get events for the plant
		events := h.eventsService.GetEventsByPlantId(plantID)
		apiResponse.Ok(w, eventDtos.FromStoreEvents(events))
	case "POST":
		// Create a new event for the plant
		h.handleCreateEvent(w, r, plantID)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// handleCreateEvent handles requests to create a new event
func (h *eventsHandler) handleCreateEvent(w http.ResponseWriter, r *http.Request, plantId int) {
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

	// Set the plant ID from the URL parameter
	createEventDto.PlantId = plantId

	// Create watering event
	newEvent, err := h.eventsService.CreateWateringEvent(createEventDto.PlantId, createEventDto.Note)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	// Return the created event
	apiResponse.Created(w, eventDtos.FromStoreEvent(newEvent))
}

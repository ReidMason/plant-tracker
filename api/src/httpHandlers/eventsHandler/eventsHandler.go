package eventsHandler

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/ReidMason/plant-tracker/src/httpHandlers/eventsHandler/eventDtos"
	apiResponse "github.com/ReidMason/plant-tracker/src/httpHandlers/models"
	"github.com/ReidMason/plant-tracker/src/services/eventsService"
)

// eventsHandler implements the HTTP handler for events
type eventsHandler struct {
	eventsService eventsService.EventsService
}

// New creates a new events handler
func New(eventsService eventsService.EventsService) *eventsHandler {
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
	plantId, err := strconv.Atoi(plantIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	ctx := r.Context()
	switch r.Method {
	case "GET":
		// Get events for the plant
		events, err := h.eventsService.GetEventsByPlantId(ctx, int64(plantId))
		if err != nil {
			apiResponse.InternalServerError[any](w, []string{"Failed to get events"})
			return
		}
		apiResponse.Ok(w, eventDtos.FromStoreEvents(events))
	case "POST":
		// Create a new event for the plant
		h.handleCreateEvent(w, r, plantId)
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

	// Validate event type
	if createEventDto.EventType != 1 && createEventDto.EventType != 2 {
		apiResponse.BadRequest[any](w, []string{"Invalid event type"})
		return
	}

	// Create event
	ctx := r.Context()
	newEvent, err := h.eventsService.CreateEvent(ctx, int64(createEventDto.PlantId), createEventDto.EventType, createEventDto.Note)
	if err != nil {
		apiResponse.InternalServerError[any](w, []string{"Failed to create event"})
		return
	}

	// Return the created event
	apiResponse.Created(w, eventDtos.FromStoreEvent(newEvent))
}

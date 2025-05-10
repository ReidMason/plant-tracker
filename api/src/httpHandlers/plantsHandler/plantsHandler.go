package plantsHandler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	apiResponse "github.com/ReidMason/plant-tracker/src/httpHandlers/models"
	"github.com/ReidMason/plant-tracker/src/httpHandlers/plantsHandler/plantDtos"
	"github.com/ReidMason/plant-tracker/src/services/plantsService"
)

type plantsHandler struct {
	plantsService plantsService.GetPlantsService
}

func New(plantsService plantsService.GetPlantsService) *plantsHandler {
	return &plantsHandler{
		plantsService: plantsService,
	}
}

func (p *plantsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path

	// Handle user plants collection (e.g. /users/1/plants)
	if strings.HasPrefix(path, "/users/") && strings.HasSuffix(path, "/plants") && !strings.Contains(path, "/plants/") {
		p.handleUserPlants(w, r)
		return
	}

	// Handle specific plant for user (e.g. /users/1/plants/2)
	if strings.HasPrefix(path, "/users/") && strings.Contains(path, "/plants/") && !strings.Contains(path, "/events") {
		p.handleSingleUserPlant(w, r)
		return
	}

	// If no patterns match, return 404
	http.Error(w, "Not found", http.StatusNotFound)
}

func (p *plantsHandler) handleUserPlants(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from path
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		apiResponse.NotFound(w)
		return
	}

	userIDStr := parts[2]
	userId, err := strconv.Atoi(userIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	ctx := r.Context()
	switch r.Method {
	case "GET":
		plants, err := p.plantsService.GetPlantsByUserId(ctx, int64(userId))
		if err != nil {
			apiResponse.InternalServerError[any](w, []string{"Failed to get plant"})
			return
		}
		apiResponse.Ok(w, plantDtos.FromServicePlants(plants))
	case "POST":
		p.handleCreatePlant(w, r, userId)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (p *plantsHandler) handleSingleUserPlant(w http.ResponseWriter, r *http.Request) {
	// Extract IDs from path (/users/{userId}/plants/{plantId})
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		apiResponse.NotFound(w)
		return
	}

	// Extract plantId (we don't need userId for this operation)
	plantIDStr := parts[4]

	plantId, err := strconv.Atoi(plantIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	ctx := r.Context()
	switch r.Method {
	case "GET":
		plant, err := p.plantsService.GetPlantById(ctx, int64(plantId))
		if err != nil {
			apiResponse.InternalServerError[any](w, []string{"Failed to get plant"})
			return
		}

		if plant.Id == 0 {
			apiResponse.NotFound(w)
			return
		}
		apiResponse.Ok(w, plantDtos.FromServicePlant(plant))
	case "PUT":
		// Parse body for new name
		var req struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Name == "" {
			apiResponse.BadRequest[any](w, []string{"Invalid request body"})
			return
		}
		updatedPlant, err := p.plantsService.UpdatePlant(ctx, int64(plantId), req.Name)
		if err != nil {
			apiResponse.InternalServerError[any](w, []string{"Failed to update plant"})
			return
		}
		apiResponse.Ok(w, plantDtos.FromServicePlant(updatedPlant))
	case "DELETE":
		fmt.Fprintln(w, "DELETE /users/{userId}/plants/{plantId}")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (p *plantsHandler) handleCreatePlant(w http.ResponseWriter, r *http.Request, userId int) {
	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		apiResponse.InternalServerError[any](w, []string{"Failed to read request body"})
		return
	}
	defer r.Body.Close()

	// Parse request body
	var createPlantDto plantDtos.CreatePlantDto
	err = json.Unmarshal(body, &createPlantDto)
	if err != nil {
		apiResponse.BadRequest[any](w, []string{"Failed to parse request body"})
		return
	}

	// Validate request
	if createPlantDto.Name == "" {
		apiResponse.BadRequest[any](w, []string{"Name is required"})
		return
	}

	// Set the userId from the URL parameter
	createPlantDto.UserId = userId

	ctx := r.Context()
	// Create plant
	newPlant, err := p.plantsService.CreatePlant(ctx, createPlantDto.Name, int64(createPlantDto.UserId))
	if err != nil {
		apiResponse.InternalServerError[any](w, []string{"Failed to create plant"})
		return
	}

	// Return created plant
	apiResponse.Created(w, plantDtos.FromStorePlant(newPlant))
}

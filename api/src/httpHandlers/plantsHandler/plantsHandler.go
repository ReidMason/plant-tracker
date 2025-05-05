package plantsHandler

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	apiResponse "github.com/ReidMason/plant-tracker/src/httpHandlers/models"
	"github.com/ReidMason/plant-tracker/src/httpHandlers/plantsHandler/plantDtos"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
)

type PlantsHandlerService interface {
	GetPlantsByUserId(userId int) []plantstore.Plant
	GetPlantById(id int) *plantstore.Plant
}

type plantsHandler struct {
	plantsService PlantsHandlerService
}

func New(plantsService PlantsHandlerService) *plantsHandler {
	return &plantsHandler{
		plantsService: plantsService,
	}
}

func (p *plantsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path

	// Handle direct plant request (e.g. /plants/1)
	if strings.HasPrefix(path, "/plants/") && !strings.Contains(path, "/user/") {
		p.handleSinglePlant(w, r)
		return
	}

	// Handle plants by user request (e.g. /plants/user/1)
	if strings.HasPrefix(path, "/plants/user/") {
		p.handlePlantsByUser(w, r)
		return
	}

	// Handle collection endpoints
	switch r.Method {
	case "GET":
		// Return all plants is not implemented as it's dangerous without pagination
		http.Error(w, "Not implemented - use /plants/user/{userId} instead", http.StatusNotImplemented)
	case "POST":
		fmt.Fprintln(w, "POST /plants")
	case "PUT":
		fmt.Fprintln(w, "PUT /plants")
	case "DELETE":
		fmt.Fprintln(w, "DELETE /plants")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (p *plantsHandler) handleSinglePlant(w http.ResponseWriter, r *http.Request) {
	plantIDStr := r.PathValue("id")
	plantID, err := strconv.Atoi(plantIDStr)
	if err != nil {
		apiResponse.NotFound(w)
		return
	}

	switch r.Method {
	case "GET":
		plant := p.plantsService.GetPlantById(plantID)
		if plant == nil {
			apiResponse.NotFound(w)
			return
		}
		apiResponse.Ok(w, plantDtos.FromStorePlant(*plant))
	case "PUT":
		fmt.Fprintln(w, "PUT /plants/{id}")
	case "DELETE":
		fmt.Fprintln(w, "DELETE /plants/{id}")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (p *plantsHandler) handlePlantsByUser(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from path
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) != 4 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}

	userIDStr := pathParts[3]
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		plants := p.plantsService.GetPlantsByUserId(userID)
		apiResponse.Ok(w, plantDtos.FromStorePlants(plants))
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

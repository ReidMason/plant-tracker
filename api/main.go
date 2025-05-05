package main

import (
	"net/http"

	plantsHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/plantsHandler"
	usersHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/usersHandler"
	plantsService "github.com/ReidMason/plant-tracker/src/services/plantsService"
	usersService "github.com/ReidMason/plant-tracker/src/services/usersService"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
	usersStore "github.com/ReidMason/plant-tracker/src/stores/usersStore"
)

func main() {
	mux := http.NewServeMux()

	// Set up stores
	userStore := usersStore.NewInMemoryUsersStore()
	plantStore := plantstore.NewInMemoryPlantsStore()

	// Set up services
	userService := usersService.New(userStore)
	plantService := plantsService.New(plantStore)

	// Register routes
	mux.Handle("/users", usersHandler.New(userService))
	mux.Handle("/users/{id}", usersHandler.New(userService))

	mux.Handle("/plants", plantsHandler.New(plantService))
	mux.Handle("/plants/{id}", plantsHandler.New(plantService))
	mux.Handle("/plants/user/{userId}", plantsHandler.New(plantService))

	http.ListenAndServe(":8080", mux)
}

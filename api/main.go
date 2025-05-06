package main

import (
	"net/http"

	eventsHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/eventsHandler"
	plantsHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/plantsHandler"
	usersHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/usersHandler"
	eventsService "github.com/ReidMason/plant-tracker/src/services/eventsService"
	plantsService "github.com/ReidMason/plant-tracker/src/services/plantsService"
	usersService "github.com/ReidMason/plant-tracker/src/services/usersService"
	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
	usersStore "github.com/ReidMason/plant-tracker/src/stores/usersStore"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow any origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()

	// Set up stores
	userStore := usersStore.NewInMemoryUsersStore()
	plantStore := plantstore.NewInMemoryPlantsStore()
	eventStore := eventsStore.NewInMemoryEventsStore()

	// Set up services
	userService := usersService.New(userStore)
	plantService := plantsService.New(plantStore)
	eventService := eventsService.New(eventStore, plantStore)

	// Register routes
	mux.Handle("/users", usersHandler.New(userService))
	mux.Handle("/users/{id}", usersHandler.New(userService))

	mux.Handle("/plants", plantsHandler.New(plantService))
	mux.Handle("/plants/{id}", plantsHandler.New(plantService))
	mux.Handle("/plants/user/{userId}", plantsHandler.New(plantService))

	// Register events routes
	mux.Handle("/events", eventsHandler.New(eventService))
	mux.Handle("/events/{id}", eventsHandler.New(eventService))
	mux.Handle("/plants/{id}/events", eventsHandler.New(eventService))

	// Wrap the mux with CORS middleware
	corsHandler := corsMiddleware(mux)

	// Start the server with CORS support
	http.ListenAndServe(":8080", corsHandler)
}

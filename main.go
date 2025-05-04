package main

import (
	"net/http"

	usersHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/usersHandler"
	usersService "github.com/ReidMason/plant-tracker/src/services"
	usersStore "github.com/ReidMason/plant-tracker/src/stores/usersStore"
)

func main() {
	mux := http.NewServeMux()

	usersStore := usersStore.NewInMemoryUsersStore()
	usersService := usersService.New(usersStore)

	mux.Handle("/users", usersHandler.New(usersService))

	http.ListenAndServe(":8080", mux)
}

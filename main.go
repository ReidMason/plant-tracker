package main

import (
	"net/http"

	usersHandler "github.com/ReidMason/plant-tracker/src/httpHandlers"
)

func main() {
	mux := http.NewServeMux()

	mux.Handle("/users", usersHandler.New())

	http.ListenAndServe(":8080", mux)
}

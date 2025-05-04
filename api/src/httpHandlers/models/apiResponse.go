package apiResponse

import (
	"encoding/json"
	"net/http"
)

type apiResponse[T any] struct {
	Data   T        `json:"data,omitempty"`
	Errors []string `json:"errors,omitempty"`
}

func Ok[T any](w http.ResponseWriter, data T) {
	w.WriteHeader(http.StatusOK)
	response := apiResponse[T]{Data: data}
	responseJson, err := json.Marshal(response)
	if err != nil {
		InternalServerError[any](w, []string{"Failed to marshal response"})
		return
	}

	w.Write(responseJson)
}

func InternalServerError[T any](w http.ResponseWriter, errors []string) {
	w.WriteHeader(http.StatusInternalServerError)
	response := apiResponse[T]{Errors: errors}
	responseJson, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.Write(responseJson)
	return
}

func NotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	http.Error(w, "Not Found", http.StatusNotFound)
	return
}

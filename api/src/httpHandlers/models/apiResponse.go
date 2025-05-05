package apiResponse

import (
	"encoding/json"
	"net/http"
)

type apiResponse[T any] struct {
	Data   T        `json:"data,omitempty"`
	Errors []string `json:"errors,omitempty"`
}

func createResponse[T any](data T) apiResponse[T] {
	return apiResponse[T]{Data: data}
}

func createErrorResponse(errors []string) apiResponse[any] {
	return apiResponse[any]{Errors: errors}
}

func writeResponse[T any](w http.ResponseWriter, response apiResponse[T]) {
	responseJson, err := json.Marshal(response)
	if err != nil {
		InternalServerError[any](w, []string{"Failed to marshal response"})
		return
	}

	w.Write(responseJson)
}

func Ok[T any](w http.ResponseWriter, data T) {
	w.WriteHeader(http.StatusOK)
	response := createResponse(data)
	writeResponse(w, response)
}

func InternalServerError[T any](w http.ResponseWriter, errors []string) {
	w.WriteHeader(http.StatusInternalServerError)
	response := createErrorResponse(errors)
	writeResponse(w, response)
}

func NotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	response := createErrorResponse([]string{"Resource not found"})
	writeResponse(w, response)
}

func BadRequest[T any](w http.ResponseWriter, errors []string) {
	w.WriteHeader(http.StatusBadRequest)
	response := createErrorResponse(errors)
	writeResponse(w, response)
}

func Created[T any](w http.ResponseWriter, data T) {
	w.WriteHeader(http.StatusCreated)
	response := createResponse(data)
	writeResponse(w, response)
}

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

func Ok[T any](w http.ResponseWriter, data T) {
	w.WriteHeader(http.StatusOK)
	response := createResponse(data)
	responseJson, err := json.Marshal(response)
	if err != nil {
		InternalServerError[any](w, []string{"Failed to marshal response"})
		return
	}

	w.Write(responseJson)
}

func InternalServerError[T any](w http.ResponseWriter, errors []string) {
	w.WriteHeader(http.StatusInternalServerError)
	response := createErrorResponse(errors)
	responseJson, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.Write(responseJson)
}

func NotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	response := createErrorResponse([]string{"Resource not found"})
	responseJson, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	w.Write(responseJson)
}

func BadRequest[T any](w http.ResponseWriter, errors []string) {
	w.WriteHeader(http.StatusBadRequest)
	response := createErrorResponse(errors)
	responseJson, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	w.Write(responseJson)
}

func Created[T any](w http.ResponseWriter, data T) {
	w.WriteHeader(http.StatusCreated)
	response := createResponse(data)
	responseJson, err := json.Marshal(response)
	if err != nil {
		InternalServerError[any](w, []string{"Failed to marshal response"})
		return
	}

	w.Write(responseJson)
}

package main

import (
	"context"
	"embed"
	"net/http"
	"os"

	"database/sql"

	_ "github.com/lib/pq"

	"github.com/ReidMason/plant-tracker/src/httpHandlers/eventsHandler"
	plantsHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/plantsHandler"
	usersHandler "github.com/ReidMason/plant-tracker/src/httpHandlers/usersHandler"
	eventsService "github.com/ReidMason/plant-tracker/src/services/eventsService"
	plantsService "github.com/ReidMason/plant-tracker/src/services/plantsService"
	usersService "github.com/ReidMason/plant-tracker/src/services/usersService"
	"github.com/ReidMason/plant-tracker/src/stores/database"
	eventsStore "github.com/ReidMason/plant-tracker/src/stores/eventsStore"
	plantstore "github.com/ReidMason/plant-tracker/src/stores/plantsStore"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3"
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

//go:embed migrations/*.sql
var embedMigrations embed.FS

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	mux := http.NewServeMux()

	// Database connection
	ctx := context.Background()

	connectionString := os.Getenv("CONNECTION_STRING")
	if connectionString == "" {
		panic("CONNECTION_STRING environment variable not set")
	}

	// Open *sql.DB for goose migrations
	sqldb, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}
	defer sqldb.Close()

	if err := sqldb.PingContext(ctx); err != nil {
		panic("Failed to connect to database")
	}

	// Database migrations
	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		panic(err)
	}

	if err := goose.Up(sqldb, "migrations"); err != nil {
		panic(err)
	}

	// Open pgx.Conn for sqlc/database
	conn, err := pgx.Connect(ctx, connectionString)
	if err != nil {
		panic("Failed to connect to database (pgx)")
	}
	defer conn.Close(ctx)

	queries := database.New(conn)

	// Set up stores
	plantStore := plantstore.NewInMemoryPlantsStore()
	eventStore := eventsStore.NewInMemoryEventsStore()

	// Set up services
	userService := usersService.New(ctx, queries)
	plantService := plantsService.New(plantStore)
	eventService := eventsService.New(eventStore, plantStore)

	mux.Handle("/users", usersHandler.New(userService))
	mux.Handle("/users/{id}", usersHandler.New(userService))
	mux.Handle("/users/{id}/plants", plantsHandler.New(plantService))
	mux.Handle("/users/{userId}/plants/{plantId}", plantsHandler.New(plantService))
	mux.Handle("/users/{userId}/plants/{plantId}/events", eventsHandler.New(eventService))

	// Wrap the mux with CORS middleware
	corsHandler := corsMiddleware(mux)

	// Start the server with CORS support
	http.ListenAndServe(":8080", corsHandler)
}

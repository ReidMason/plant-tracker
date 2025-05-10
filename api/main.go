package main

import (
	"context"
	"embed"
	"fmt"
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
	"github.com/jackc/pgx/v5/pgxpool"
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
	if _, err := os.Stat(".env"); err == nil {
		if err := godotenv.Load(); err != nil {
			panic("Error loading .env file")
		}
	}

	mux := http.NewServeMux()

	// Database connection
	ctx := context.Background()

	dbConnectionString := "DB_CONNECTION_STRING"
	connectionString := os.Getenv(dbConnectionString)
	if connectionString == "" {
		panic(fmt.Sprintf("%s environment variable not set", dbConnectionString))
	}

	// Open *sql.DB for goose migrations
	sqldb, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}
	defer sqldb.Close()

	if err := sqldb.PingContext(ctx); err != nil {
		fmt.Println(err)
		panic("Failed to connect to database")
	}

	// Database migrations
	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("postgres"); err != nil {
		fmt.Println(err)
		panic(err)
	}

	if err := goose.Up(sqldb, "migrations"); err != nil {
		fmt.Println(err)
		panic(err)
	}

	// Open pgxpool.Pool for sqlc/database
	pool, err := pgxpool.New(ctx, connectionString)
	if err != nil {
		fmt.Println(err)
		panic("Failed to connect to database (pgxpool)")
	}
	defer pool.Close()

	queries := database.New(pool)

	// Set up services
	userService := usersService.New(queries)
	eventService := eventsService.New(queries, queries)
	plantService := plantsService.New(queries, eventService)

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

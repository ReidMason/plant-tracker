-- name: GetEventsByPlantId :many
SELECT * FROM events WHERE plantId = $1;

-- name: GetEventById :one
SELECT * FROM events WHERE id = $1;

-- name: CreateEvent :one
INSERT INTO events (plantId, eventType, note, timestamp)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetLatestWaterEventByPlantId :one
SELECT id, plantid, eventtype, note, timestamp
FROM events
WHERE plantid = $1 AND eventtype = 1
ORDER BY timestamp DESC
LIMIT 1; 

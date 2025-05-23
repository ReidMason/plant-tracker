-- name: GetPlantsByUserId :many
SELECT * FROM plants WHERE userId = $1;

-- name: GetPlantById :one
SELECT * FROM plants WHERE id = $1;

-- name: CreatePlant :one
INSERT INTO plants (name, userId) VALUES ($1, $2)
RETURNING *; 

-- name: UpdatePlant :one
UPDATE plants
SET name = $2
WHERE id = $1
RETURNING *;

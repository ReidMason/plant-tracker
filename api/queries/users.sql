-- name: GetUsers :many
SELECT * FROM users;

-- name: GetUserById :one
SELECT * FROM users
WHERE id = $1;

-- name: CreateUser :one
INSERT INTO users (
  name,
  colour
) VALUES (
  $1, $2
)
RETURNING *;

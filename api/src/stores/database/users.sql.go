// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: users.sql

package database

import (
	"context"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (
  name,
  colour
) VALUES (
  $1, $2
)
RETURNING id, name, colour
`

type CreateUserParams struct {
	Name   string
	Colour string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, createUser, arg.Name, arg.Colour)
	var i User
	err := row.Scan(&i.ID, &i.Name, &i.Colour)
	return i, err
}

const getUserById = `-- name: GetUserById :one
SELECT id, name, colour FROM users
WHERE id = $1
`

func (q *Queries) GetUserById(ctx context.Context, id int64) (User, error) {
	row := q.db.QueryRow(ctx, getUserById, id)
	var i User
	err := row.Scan(&i.ID, &i.Name, &i.Colour)
	return i, err
}

const getUsers = `-- name: GetUsers :many
SELECT id, name, colour FROM users
`

func (q *Queries) GetUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.Query(ctx, getUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(&i.ID, &i.Name, &i.Colour); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

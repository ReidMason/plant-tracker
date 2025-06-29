// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: events.sql

package database

import (
	"context"
	"time"
)

const createEvent = `-- name: CreateEvent :one
INSERT INTO events (plantId, eventType, note, timestamp)
VALUES ($1, $2, $3, $4)
RETURNING id, plantid, eventtype, note, timestamp
`

type CreateEventParams struct {
	Plantid   int64
	Eventtype int32
	Note      string
	Timestamp time.Time
}

func (q *Queries) CreateEvent(ctx context.Context, arg CreateEventParams) (Event, error) {
	row := q.db.QueryRow(ctx, createEvent,
		arg.Plantid,
		arg.Eventtype,
		arg.Note,
		arg.Timestamp,
	)
	var i Event
	err := row.Scan(
		&i.ID,
		&i.Plantid,
		&i.Eventtype,
		&i.Note,
		&i.Timestamp,
	)
	return i, err
}

const getEventById = `-- name: GetEventById :one
SELECT id, plantid, eventtype, note, timestamp FROM events WHERE id = $1
`

func (q *Queries) GetEventById(ctx context.Context, id int64) (Event, error) {
	row := q.db.QueryRow(ctx, getEventById, id)
	var i Event
	err := row.Scan(
		&i.ID,
		&i.Plantid,
		&i.Eventtype,
		&i.Note,
		&i.Timestamp,
	)
	return i, err
}

const getEventsByPlantId = `-- name: GetEventsByPlantId :many
SELECT id, plantid, eventtype, note, timestamp FROM events WHERE plantId = $1
`

func (q *Queries) GetEventsByPlantId(ctx context.Context, plantid int64) ([]Event, error) {
	rows, err := q.db.Query(ctx, getEventsByPlantId, plantid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Event
	for rows.Next() {
		var i Event
		if err := rows.Scan(
			&i.ID,
			&i.Plantid,
			&i.Eventtype,
			&i.Note,
			&i.Timestamp,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getLatestEventsByTypeForPlant = `-- name: GetLatestEventsByTypeForPlant :many
SELECT DISTINCT ON (eventtype) id, plantid, eventtype, note, timestamp
FROM events 
WHERE plantid = $1 AND eventtype IN (1, 2)
ORDER BY eventtype, timestamp DESC
`

func (q *Queries) GetLatestEventsByTypeForPlant(ctx context.Context, plantid int64) ([]Event, error) {
	rows, err := q.db.Query(ctx, getLatestEventsByTypeForPlant, plantid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Event
	for rows.Next() {
		var i Event
		if err := rows.Scan(
			&i.ID,
			&i.Plantid,
			&i.Eventtype,
			&i.Note,
			&i.Timestamp,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

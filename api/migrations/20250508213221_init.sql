-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

CREATE TABLE users (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  colour TEXT NOT NULL
);

CREATE TABLE plants (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  userId BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE eventTypes (
  id INT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO eventTypes (id, name)
VALUES (1, 'Water');

CREATE TABLE events (
  id BIGSERIAL NOT NULL PRIMARY KEY,
	plantId   BIGINT NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  eventType INT NOT NULL REFERENCES eventTypes(id) ON DELETE CASCADE,
	note      TEXT NOT NULL,
	timestamp TIMESTAMPTZ NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS plants;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd

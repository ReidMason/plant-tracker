-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

CREATE TABLE users (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  colour TEXT NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXSITS users;
-- +goose StatementEnd

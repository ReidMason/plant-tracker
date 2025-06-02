-- +goose Up
-- +goose StatementBegin
INSERT INTO eventTypes (id, name)
VALUES (2, 'Fertilize');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM eventTypes WHERE id = 2;
-- +goose StatementEnd 
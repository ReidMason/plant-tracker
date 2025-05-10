# Build stage
FROM golang:latest AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./server 

# Runtime stage
FROM scratch
WORKDIR /app
COPY --from=builder /app/server .
CMD ["./server"] 

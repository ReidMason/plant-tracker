# Build stage
FROM golang:latest AS builder
WORKDIR /app
COPY . .
RUN go build -o ./server 

# Runtime stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/server .
CMD ["./server"] 

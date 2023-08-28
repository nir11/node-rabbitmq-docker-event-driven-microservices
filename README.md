# Event Driven Microservices with Node.js & RabbitMQ & Docker: Cat Adoption Center

![cat-addoption-architecture](https://github.com/nir11/node-rabbitmq-docker-event-driven-microservices/blob/main/assets/cat-adoption-center-architecture.png)

## Description

### This repository implements an Event Driven Architecture for microservices using:

- Node.js services
- RabbitMQ (message broker)
- MongoDB
- Docker

### The repository represents the backend for a cat adoption center application, which is managed by the following microservices:

1. **User Service:** For user management.
2. **Cat Service:** For cat management.
3. **Notifications Service:** Sends notifications to users.
4. **RabbitMQ Message Broker:** For asynchronous communication between the microservices.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js version 16 or higher
- Docker: [Install Docker](https://docs.docker.com/get-docker/)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the repository's root directory.

## Usage

1. Open a terminal window.
2. Navigate to each service within the `services` directory, then install and build each one using the following commands:
   ```
   yarn
   yarn build
   ```
3. Navigate to the repository's root directory.
4. Run the following command to start the application:

   ```
   docker-compose up
   ```

## Docker Containers

### RabbitMQ

- **Image:** rabbitmq:3-management
- **Ports:** 5672 (AMQP), 15672 (Management UI)
- **Healthcheck:** RabbitMQ status check
- **Volumes:** rabbitmq_data (for persistent data)

### MongoDB

- **Image:** mongo:latest
- **Port:** 27017
- **Volumes:** mongodb_data (for persistent data)

### User Service

- Custom microservice for user-related operations.
- **Built from:** `./services/user-service` context.
- **Port:** 3001
- **Environment variables:**
  - NODE_ENV: production
  - PORT: 3000
  - MONGODB_URI: mongodb://mongodb:27017
  - AMQP_URI: amqp://guest:guest@rabbitmq:5672
  - Depends on: MongoDB (service_started), RabbitMQ (service_healthy)

### Cat Service

- Custom microservice for cat-related operations.
- **Built from:** `./services/cat-service` context.
- **Port:** 3002
- **Environment variables:**
  - NODE_ENV: production
  - PORT: 3000
  - MONGODB_URI: mongodb://mongodb:27017
  - AMQP_URI: amqp://guest:guest@rabbitmq:5672
  - Depends on: MongoDB (service_started), RabbitMQ (service_healthy)

### Notifications Service

- Custom microservice for sending notifications.
- **Built from:** `./services/notifications-service` context.
- **Port:** 3003
- **Environment variables:**
  - NODE_ENV: production
  - PORT: 3000
  - MONGODB_URI: mongodb://mongodb:27017
  - AMQP_URI: amqp://guest:guest@rabbitmq:5672
  - Depends on: MongoDB (service_started), RabbitMQ (service_healthy)

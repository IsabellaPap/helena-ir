# helena-ir
Development of app for the utilisation of the HELENA-IR risk score for developing insulin resistance in  adolescents.

## Prerequisites
- Docker

## Getting Started
To get started with this project, first clone the repository:

```bash
git clone https://github.com/IsabellaPap/helena-ir.git
cd helena-ir
```
## Running the Application with Docker Compose

To run this application using Docker Compose, which will build and start both the frontend and backend services, follow these steps:

1. **Start the Docker application**: Ensure that Docker is running on your machine.

2. **Build and Run with Docker Compose**: From the root of the cloned repository (where the `docker-compose.yml` file is located), execute the following command:

   ```bash
   docker compose up --build
   ```

## Accessing the Application

- The React front-end is accessible at http://localhost:3000.
- The FastAPI back-end is accessible at http://localhost:8000.
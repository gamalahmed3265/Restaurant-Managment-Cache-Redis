# Bites - Node, Redis, TypeScript & Express Backend

This repository serves as a robust example of a Node.js backend leveraging the power of Redis. It demonstrates how to integrate Redis with Node.js to build high-performance applications, utilizing modern Redis features like RedisJSON, RediSearch, and Bloom filters.

## Stack Overview

- **Runtime**: Node.js
- **Framework**: Express with TypeScript
- **Database**: Redis (using `redis` client)
  - _Data Types Used_: Hashes, Lists, Sets, Sorted Sets, Strings
  - _Modules_: RedisJSON, RediSearch, RedisBloom
- **Validation**: Zod
- **Infrastructure**: Docker, Nginx, GitHub Actions

## Quick Start (Docker)

The easiest way to run the application is using Docker. This will spin up the Node.js app, a Redis instance, and an Nginx reverse proxy.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine.

### Running the App

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Redis-ts-zod-nodejs
    ```

2.  **Start the services:**

    ```bash
    docker-compose up -d --build
    ```

3.  **Access the application:**
    - **API**: `http://localhost/api/v1/...` (via Nginx)
    - **Swagger Documentation**: `http://localhost/docs`
    - **Redis**: Exposed on port `6379`

4.  **Stop the services:**
    ```bash
    docker-compose down
    ```

## Local Development (Manual Setup)

If you prefer to run the application locally without Docker for development:

### Prerequisites

- Node.js (v20+)
- Pnpm (referenced in `package.json`, but `npm` works too)
- A running Redis Stack instance (Required for JSON/Search features). See [Redis Install Guide](https://redis.io/docs/latest/operate/oss_and_stack/install/).

### Setup

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Environment Variables:**
    Ensure you have an `.env` file (or set variables) matching your Redis configuration.
3.  **Run in Development Mode:**

    ```bash
    pnpm run dev
    ```

    The server will start on port `4000` (default).

4.  **Build for Production:**
    ```bash
    pnpm run build
    pnpm start
    ```

## Architecture

- **Nginx**: Acts as a reverse proxy, listening on port 80 and forwarding requests to the Node.js application.
- **Node.js**: The core application logic, running on port 4000.
- **Redis**: The primary data store, used for caching and data persistence with advanced data configurations.

## CI/CD

This project uses **GitHub Actions** for Continuous Integration.

- **Workflow**: `.github/workflows/ci.yml`
- **Triggers**: Pushes and Pull Requests to the `main` branch.
- **Steps**:
  - Installs dependencies.
  - Runs build scripts (`pnpm build`).
  - Verifies Docker image creation.

## Tutorial Reference

This code is based on the concepts from [this YouTube Video](https://youtu.be/dQV0xzOeGzU).

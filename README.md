# Real-time Leaderboard System

This project is a real-time leaderboard system that allows users to submit their scores, view the leaderboard, and see their rank for different games. The system uses **Redis** to store and retrieve scores efficiently, ensuring real-time updates to the leaderboard.

## Tech Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building the RESTful API.
- **Prisma**: ORM for interacting with the database (PostgreSQL or MySQL).
- **Redis**: In-memory database for real-time leaderboard management.
- **TypeScript**: For type safety and scalability.
- **JWT**: For user authentication and session management.
- **Bcrypt**: For hashing passwords.
- **PostgreSQL/MySQL**: Relational database for persistent user and game data storage.

## Features Implemented

- **User Authentication**: Users can register, log in, and their sessions are managed with JWT.
- **Score Submission**: Users can submit scores for different games.
- **Real-time Leaderboard**: Displays a global leaderboard that ranks users based on their scores.
- **User Rankings**: Users can view their current rank in the leaderboard.
- **Pagination**: Implemented pagination for leaderboard results.
- **Date-based Filtering**: Users can filter leaderboard scores by specifying a date range.
- **Top Players Report**: Future implementation will allow generating top player reports for a specific period.

## How to Setup Locally

### Prerequisites

- **Node.js** installed.
- **PostgreSQL** or **MySQL** as a relational database.
- **Redis** installed locally.
- **Git** for cloning the repository.

### Steps to Set Up the Project

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/real-time-leaderboard.git
   cd real-time-leaderboard
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Setup .env.example file**

   ```env
    DATABASE_URL=""
    REDIS_HOST=""
    REDIS_PORT=""
    REDIS_PASSWORD=""
   ```

4. **Run Prisma migrations (for setting up database schema)**

   ```bash
   npx prisma migrate dev
   ```

5. **Build the project**

   ```bash
   npm run build --watch
   ```

6. **Start the project locally**

   ```bash
   npm start
   ```

## API Routes

### User Authentication

#### Register a new user

- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Responses**:
  - 201: User successfully created.
  - 401: Invalid fields or user already exists.
  - 500: Internal server error.

#### Log in a user

- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Responses**:
  - 201: Login successful with JWT token set in cookies.
  - 400: Invalid credientials.
  - 404: User not found.
  - 500: Internal server error.

### Score Management

#### Submit a score for a game

- **URL**: `/api/v1/score/:gameId`
- **Method**: `POST`
- **Params**:
  `gameId`: The ID of the game.
- **Body**:

  ```json
  {
    "score": 1500
  }
  ```

- **Responses**:
  - 200: Score successfully submitted and Redis leaderboard updated.
  - 404: Game not found.
  - 500: Internal Server Error.

#### Update user's score for a game

- **URL**: `/api/v1/score/:gameId/update`
- **Method**: `PUT`
- **Params**:
  `gameId`: The ID of the game.
- Body:
  ```json
  {
    "score": 1800
  }
  ```
- **Responses**:
  - **200**: Score successfully updated.
  - **404**: Game or user not found.
  - **500**: Internal Server Error.

### Leaderboard

#### Get the leaderboard for a game (with pagination)

- **URL**: `/api/v1/leaderboard/:gameId`
- **Method**: `GET`
- **Params**:
  `gameId`: The ID of the game.
- **Query Parameters**:
  `page`: (optional) Page number, default is 1.
  `limit`: (optional) Results per page, default is 10.
- **Responses**:
  - **200**: Leaderboard fetched successfully with pagination.
  - **404**: Game not found.
  - **500**: Internal Server Error.

#### Get the current user rank for a game

- **URL**: `/api/v1/leaderboard/:gameId/rank`
- **Method**: `GET`
- **Params**:
  `gameId`: The ID of the game.
- **Responses**:
  - **200**: Rank fetched successfully.
  - **404**: User or game not found.
  - **500**: Internal Server Error.

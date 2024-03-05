# myFlix Movie API

This project is a backend application, built as the server side for the myFlix Movie API. This project was developed using Node.js and Express, and utilizes MongoDB for data persistence.

## Features

- Full CRUD operations on movies, users, directors, and genres.
- Secure authentication and authorization with JWT.
- Password hashing for user security.
- Validation of request data for reliability.
- Connection to MongoDB Atlas for data storage.
- Logging of requests to monitor and debug issues.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository to your local machine.
2. Install MongoDB on your machine.
3. Run `npm install` to install all required dependencies.
4. Set up your environment variables in a `.env` file, including your MongoDB URI and your JWT secret key.
5. Use `node index.js` to start the server.

## Usage

After starting the server, you can use Postman or any other API testing tool to test the API endpoints. The API URL is:

- Base URL: https://myflix-api-98798a311278.herokuapp.com/ 

### The API allows you to:
- Get a list of all movies, directors, genres, and users.
- Register a new user and update user information.
- Allow users to add or remove movies from their list of favorites.
- Authenticate users and secure endpoints using JWT.

## Technologies Used

- Node.js
- Express
- MongoDB Atlas/Mongoose
- JWT for authentication
- Postman for testing

## Dependencies

- bcrypt: 5.1.1
- body-parser: 1.20.2
- cors: 2.8.5
- express: 4.18.2
- express-validator: 7.0.1
- jsonwebtoken: 9.0.2
- method-override: 3.0.0
- mongodb: 6.3.0
- mongoose: 8.0.3
- morgan: 1.10.0
- passport: 0.7.0
- passport-jwt: 4.0.1
- passport-local: 1.0.0
- path: 0.12.7
- uuid: 9.0.1

## API Documentation

Refer to the `/documentation` endpoint to view the full API documentation. This includes detailed information on each endpoint, required parameters, and example responses.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

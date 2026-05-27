# Glow Client Care API

This is my Module Two API project using Node, Express, MongoDB, and Mongoose.

## Project Description

This API manages skincare clients and their treatment plans.

The two collections are:

- Clients
- Treatment Plans

A Treatment Plan belongs to a Client by using a Mongoose ObjectId reference.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Dotenv
- Nodemon
- Postman

## Models

### Client

- firstName: String
- email: String
- age: Number
- isActive: Boolean
- skinConcerns: Array

### Treatment Plan

- client: ObjectId reference to Client
- serviceName: String
- sessions: Number
- price: Number
- treatmentDate: Date

## Relationship

A Treatment Plan belongs to a Client.

This relationship is created using a Mongoose ObjectId reference in the Treatment Plan schema.

When creating a Treatment Plan, the Client ID from MongoDB is used to connect the Treatment Plan to the Client collection.

## API Routes

### Client Routes

GET /api/v1/clients  
GET /api/v1/clients/:id  
POST /api/v1/clients  
PUT /api/v1/clients/:id  
DELETE /api/v1/clients/:id  

### Treatment Plan Routes

GET /api/v1/treatment-plans  
GET /api/v1/treatment-plans/:id  
POST /api/v1/treatment-plans  
PUT /api/v1/treatment-plans/:id  
DELETE /api/v1/treatment-plans/:id  

## Second Collection Features

For the second collection, Treatment Plans, I added:

- select("-__v") to remove the version field from response payloads
- populate("client", "-__v") to display the connected Client information
- Not-found checks for ID functions
- A messages module for hardcoded response messages
- Client ID validation before creating a Treatment Plan

## Messages Module

Hardcoded response messages are stored in:

app/messages/messages.js

This keeps messages like "Client not found" and "Treatment plan not found" organized in one place.

## Error Handling

The API uses try/catch blocks, validation, and status codes for successful requests, bad requests, and not found errors.

For ID functions, the API checks if the object exists first. If it does not exist, it returns a not-found response.

## How to Run

Run these commands:

npm install  
npm run dev  

Server runs on:

http://localhost:3000

## Video Links

### Module Two API Walkthrough

https://youtu.be/B_kkCnbXZsU

### Second Collection Assignment Walkthrough

https://youtu.be/b5OqWOq9tQs

### Third collection walk through

https://youtu.be/cPijSOlHzmg
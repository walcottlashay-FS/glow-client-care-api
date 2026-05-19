# Glow Client Care API

This is my Module Two API project using Node, Express, MongoDB, and Mongoose.

## Project Description

This API manages skincare clients and their treatment plans.

The two collections are:

- Clients
- Treatment Plans

A Treatment Plan has a Client relationship using a Mongoose ObjectId reference.

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

## Relationship

A Treatment Plan has a Client. This relationship is created using a Mongoose ObjectId reference in the Treatment Plan schema.

## Error Handling

The API uses try/catch blocks, validation, and status codes for successful requests, bad requests, and not found errors.

## How to Run

```bash
npm install
npm run dev

Video link: 
https://youtu.be/B_kkCnbXZsU 
# Event Ticket Booking System

## Overview

The Event Ticket Booking System is a full-stack web application that allows users to browse events, view available seats, reserve seats temporarily, and confirm bookings. The system prevents double booking through atomic seat reservation logic and includes a reservation countdown timer.

---

## Features

### User Management

* User Registration
* User Login
* JWT-based Authentication

### Event Management

* View all available events
* View event details
* Display venue and total seat count

### Seat Booking

* View seat layout
* Select available seats
* Reserve seats temporarily
* Confirm bookings
* Reservation countdown timer
* Automatic reservation expiry

### Booking Protection

* Prevents double booking
* Atomic seat reservation updates
* Real-time seat status management

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

---

## Project Structure

```text
event-booking-app
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── .env
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── pages
│   │   ├── services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## Database Collections

### Users

```json
{
  "_id": "...",
  "name": "Rohit",
  "email": "rohit@test.com",
  "password": "hashed_password"
}
```

### Events

```json
{
  "_id": "...",
  "name": "Movie Night",
  "dateTime": "2026-06-30T18:00:00.000Z",
  "venue": "Hall A",
  "totalSeats": 50
}
```

### Seats

```json
{
  "_id": "...",
  "eventId": "...",
  "seatNumber": "A1",
  "status": "available"
}
```

### Reservations

```json
{
  "_id": "...",
  "userId": "...",
  "eventId": "...",
  "seatNumbers": ["A1", "A2"],
  "expiresAt": "2026-06-30T18:10:00.000Z"
}
```

---

## Seat Status Flow

```text
Available → Reserved → Booked
```

### Status Colors

| Status    | Color  |
| --------- | ------ |
| Available | Green  |
| Selected  | Blue   |
| Reserved  | Orange |
| Booked    | Red    |

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd event-booking-app
```

---

## Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/event-booking

JWT_SECRET=yourSecretKey
```

Start backend server:

```bash
npm run dev
```

Expected Output:

```text
MongoDB Connected
Server running on port 5000
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React application:

```bash
npm start
```

Application URL:

```text
http://localhost:3000
```

---

## API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Rohit",
  "email": "rohit@test.com",
  "password": "123456"
}
```

---

#### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "rohit@test.com",
  "password": "123456"
}
```

---

### Events

#### Get All Events

```http
GET /api/events
```

---

#### Get Event Details

```http
GET /api/events/:id
```

---

### Bookings

#### Reserve Seats

```http
POST /api/bookings/reserve
```

Request:

```json
{
  "userId": "userId",
  "eventId": "eventId",
  "seatNumbers": ["A1", "A2"]
}
```

---

#### Confirm Booking

```http
POST /api/bookings
```

Request:

```json
{
  "reservationId": "reservationId"
}
```

---

## Design Decisions

### Preventing Double Booking

Seat reservations use atomic MongoDB update operations. Only seats with status `available` can be reserved.

### Reservation Expiry

Reservations expire after 10 minutes. Expired reservations cannot be booked.

### Booking Confirmation

Once confirmed, reserved seats are converted into booked seats and cannot be reserved again.

### Scalability

The application uses separate controllers, routes, and models to maintain clean architecture and support future enhancements.

---

## Assumptions

* A fixed test user ID is currently used in the frontend for demonstration purposes.
* Authentication APIs are implemented and tested separately.
* Events and seats are pre-created for testing and demonstration.

---

## Future Improvements

* Payment Gateway Integration
* Email Notifications
* Admin Dashboard
* Seat Categories (VIP, Premium, Regular)
* Event Search & Filtering
* User Booking History

---

## Author

**L. Rohit Kumar**

Full Stack Developer

Tech Stack: React.js, Node.js, Express.js, MongoDB Atlas

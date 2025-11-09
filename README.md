# Parking lot API

A complete RESTful API backend for managing smart parking operations, built with NestJS, Prisma ORM, and PostgreSQL.

## Features

- Complete CRUD operations for all entities
- JWT-based authentication
- Password hashing with bcrypt
- Automated parking session management
- Real-time parking space status tracking
- Dynamic pricing calculation based on vehicle type
- Input validation with class-validator
- Modular architecture following NestJS best practices

## Technology Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT with Passport
- **Validation**: class-validator + class-transformer

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL database

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_parking?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION="7d"
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

4. Run database migrations:

```bash
npx prisma migrate dev --name init
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## Database Schema

### Entities

1. **Sector** - Parking area sections (A, B, C, etc.)
2. **ParkingSpace** - Individual parking spots (1-10 per sector)
3. **VehicleType** - Vehicle categories with pricing rates
4. **Vehicle** - Registered vehicles with license plates
5. **User** - System users (Admin/Operator roles)
6. **ParkingSession** - Active and completed parking sessions

### Relationships

- One Sector has many ParkingSpaces (1:N)
- One VehicleType has many Vehicles (1:N)
- One Vehicle has many ParkingSessions (1:N)
- One ParkingSpace has many ParkingSessions (1:N)
- One User can register many ParkingSessions (1:N)

## API Endpoints

Base URL: `http://localhost:3000`

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Sectors

#### List all sectors
```http
GET /api/sectors
```

#### Get sector by ID
```http
GET /api/sectors/:id
```

#### Create sector
```http
POST /api/sectors
Content-Type: application/json

{
  "name": "A",
  "description": "Main parking area"
}
```

#### Update sector
```http
PUT /api/sectors/:id
Content-Type: application/json

{
  "name": "A",
  "description": "Updated description"
}
```

#### Delete sector
```http
DELETE /api/sectors/:id
```

### Parking Spaces

#### List all parking spaces (with filters)
```http
GET /api/parking-spaces
GET /api/parking-spaces?sectorId=uuid
GET /api/parking-spaces?status=AVAILABLE
```

#### Get parking space by ID
```http
GET /api/parking-spaces/:id
```

#### Create parking space
```http
POST /api/parking-spaces
Content-Type: application/json

{
  "number": 1,
  "sectorId": "uuid",
  "status": "AVAILABLE"
}
```

Status options: `AVAILABLE`, `OCCUPIED`, `RESERVED`, `OUT_OF_SERVICE`, `MAINTENANCE`

#### Update parking space
```http
PUT /api/parking-spaces/:id
Content-Type: application/json

{
  "status": "MAINTENANCE"
}
```

#### Delete parking space
```http
DELETE /api/parking-spaces/:id
```

### Vehicle Types

#### List all vehicle types
```http
GET /api/vehicle-types
```

#### Get vehicle type by ID
```http
GET /api/vehicle-types/:id
```

#### Create vehicle type
```http
POST /api/vehicle-types
Content-Type: application/json

{
  "name": "Car",
  "ratePerMinute": 0.50,
  "description": "Standard car parking"
}
```

#### Update vehicle type
```http
PUT /api/vehicle-types/:id
Content-Type: application/json

{
  "ratePerMinute": 0.75
}
```

#### Delete vehicle type
```http
DELETE /api/vehicle-types/:id
```

### Vehicles

#### List all vehicles
```http
GET /api/vehicles
```

#### Get vehicle by ID
```http
GET /api/vehicles/:id
```

#### Get vehicle by license plate
```http
GET /api/vehicles/license/:licensePlate
```

#### Create vehicle
```http
POST /api/vehicles
Content-Type: application/json

{
  "licensePlate": "ABC-123",
  "brand": "Toyota",
  "model": "Camry",
  "color": "Blue",
  "vehicleTypeId": "uuid"
}
```

#### Update vehicle
```http
PUT /api/vehicles/:id
Content-Type: application/json

{
  "color": "Red"
}
```

#### Delete vehicle
```http
DELETE /api/vehicles/:id
```

### Users

#### List all users
```http
GET /api/users
```

#### Get user by ID
```http
GET /api/users/:id
```

#### Create user
```http
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "OPERATOR"
}
```

Roles: `ADMIN`, `OPERATOR`

#### Update user
```http
PUT /api/users/:id
Content-Type: application/json

{
  "firstName": "Jane",
  "isActive": true
}
```

#### Deactivate user
```http
DELETE /api/users/:id
```

Note: This sets `isActive` to `false` instead of deleting the record.

### Parking Sessions

#### List all parking sessions (with filters)
```http
GET /api/parking-sessions
GET /api/parking-sessions?status=ACTIVE
GET /api/parking-sessions?startDate=2025-01-01&endDate=2025-12-31
```

Status options: `ACTIVE`, `COMPLETED`

#### Get parking session by ID
```http
GET /api/parking-sessions/:id
```

#### Check-in vehicle (Create session)
```http
POST /api/parking-sessions
Content-Type: application/json

{
  "vehicleId": "uuid",
  "parkingSpaceId": "uuid",
  "checkInUserId": "uuid"
}
```

This will:
- Create an ACTIVE parking session
- Set parking space status to OCCUPIED
- Record check-in time

#### Check-out vehicle
```http
PUT /api/parking-sessions/:id/checkout
Content-Type: application/json

{
  "checkOutUserId": "uuid"
}
```

This will:
- Calculate duration in minutes
- Calculate total amount (duration × ratePerMinute)
- Set session status to COMPLETED
- Set parking space status to AVAILABLE
- Record check-out time

#### Delete parking session (Admin only)
```http
DELETE /api/parking-sessions/:id
```

## Amount Calculation

When a vehicle checks out, the system automatically calculates:

```
Duration (minutes) = checkOutTime - checkInTime (rounded up)
Total Amount = Duration × Vehicle Type Rate Per Minute
```

Example:
- Check-in: 2025-01-01 10:00:00
- Check-out: 2025-01-01 12:35:00
- Duration: 155 minutes
- Rate: $0.50/minute
- Total Amount: $77.50

## Validation Rules

- **Sector name**: Required, string
- **Parking space number**: Integer between 1-10
- **License plate**: Required, unique
- **Email**: Valid email format, unique
- **Password**: Minimum 6 characters
- **Rate per minute**: Non-negative number

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful GET/PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication errors
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entries

## Project Structure

```
src/
├── auth/                   # JWT authentication module
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   └── auth.service.ts
├── parking-sessions/       # Parking session management
├── parking-spaces/         # Parking space CRUD
├── prisma/                 # Prisma service
├── sectors/                # Sector management
├── users/                  # User management
├── vehicle-types/          # Vehicle type management
├── vehicles/               # Vehicle CRUD
├── app.module.ts           # Main application module
└── main.ts                 # Application entry point

prisma/
└── schema.prisma          # Database schema
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Input validation and sanitization
- SQL injection protection (Prisma ORM)
- CORS enabled

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio
```

## License

MIT

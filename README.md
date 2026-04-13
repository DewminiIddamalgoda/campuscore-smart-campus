# Smart Campus Resource Management System


## Features

### Core Features
   **CRUD Operations**: Create, Read, Update, Delete resources
   **Search & Filter**: Filter by type, location, capacity, and status
  **Booking Workflow**: Create, review, update, approve, reject, cancel, and delete bookings
  **Conflict Checking**: Prevent overlapping bookings on the same resource and date
   **Smart Suitability Badge**: Intelligent resource recommendations
   **RESTful API**: Clean Spring Boot backend with proper HTTP methods
   **Modern UI**: React frontend with Bootstrap styling


## Technology Stack

### Backend
- **Spring Boot 3.2.5** - REST API framework
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **Validation** - Input validation
- **Lombok** - Boilerplate reduction

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Bootstrap 5** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
PAF_Assignment/
├── smart-campus-api/          # Spring Boot backend
│   ├── src/main/java/com/groupxx/smartcampus/
│   │   ├── controller/         # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access
│   │   ├── entity/            # JPA entities
│   │   ├── dto/               # Data transfer objects
│   │   ├── enums/             # Enums
│   │   └── exception/         # Exception handling
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql           # Sample data
│   └── pom.xml
├── smart-campus-client/        # React frontend
│   ├── src/
│   │   ├── api/              # API calls
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── .github/workflows/
│   └── ci.yml                 # GitHub Actions
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resources` | Create new resource |
| GET | `/api/resources` | Get all resources |
| GET | `/api/resources/{id}` | Get resource by ID |
| PUT | `/api/resources/{id}` | Update resource |
| DELETE | `/api/resources/{id}` | Delete resource |
| GET | `/api/resources/search` | Search/filter resources |
| POST | `/api/bookings` | Create booking request |
| GET | `/api/bookings` | Get all bookings (optional filters) |
| GET | `/api/bookings/{id}` | Get booking by ID |
| PUT | `/api/bookings/{id}` | Update booking details |
| PATCH | `/api/bookings/{id}/status` | Update booking status |
| DELETE | `/api/bookings/{id}` | Delete booking |

### Booking Query Filters

`GET /api/bookings` supports:
- `resourceId`
- `bookingDate` (`yyyy-MM-dd`)
- `status` (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`)

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Database Setup
1. Create MySQL database: `smart_campus_db`
2. Update database credentials in `smart-campus-api/src/main/resources/application.properties`
3. The application will auto-create tables on startup

### Backend Setup
```bash
cd smart-campus-api
.\mvnw.cmd spring-boot:run
```
The API will be available at `http://localhost:8080/api`

### Frontend Setup
```bash
cd smart-campus-client
npm install
npm run dev
```
The UI will be available at `http://localhost:3000`

## Sample Data
The system includes 10 sample resources with various types and configurations:
- Lecture halls (150-300 capacity)
- Computer labs (25-40 capacity)
- Meeting rooms (8-20 capacity)
- Equipment resources

## Usage Examples

### Create Booking
```bash
POST /api/bookings
{
  "resourceId": "<resource-id>",
  "bookedByName": "Jane Doe",
  "bookedByEmail": "jane@example.com",
  "purpose": "Final year project presentation",
  "attendeeCount": 20,
  "bookingDate": "2026-04-20",
  "startTime": "10:00",
  "endTime": "11:00",
  "notes": "Need projector and microphone"
}
```

### Update Booking Status
```bash
PATCH /api/bookings/{id}/status
{
  "status": "APPROVED"
}
```

### Search Resources
```bash
# Search for labs with minimum 30 capacity
GET /api/resources/search?type=LAB&minCapacity=30

# Search for active resources in Block A
GET /api/resources/search?location=Block+A&status=ACTIVE
```

### Create Resource
```bash
POST /api/resources
{
  "name": "Lab C-301",
  "type": "LAB",
  "capacity": 35,
  "location": "3rd Floor, Block C",
  "status": "ACTIVE",
  "availableFrom": "09:00",
  "availableTo": "17:00",
  "description": "Computer lab with 35 workstations"
}
```

## Smart Suitability Badge Logic

The system calculates badges based on:
1. **Resource Status** - OUT_OF_SERVICE → "Temporarily unavailable"
2. **Availability Window** - <4 hours → "Limited availability"
3. **Type & Capacity**:
   - LECTURE_HALL + >80 capacity → "Best for lectures"
   - MEETING_ROOM + ≤15 capacity → "Best for small meetings"
   - LAB → "Best for practical labs"
   - MEETING_ROOM + >15 capacity → "Best for large meetings"
   - LECTURE_HALL + ≤80 capacity → "Best for medium lectures"
   - EQUIPMENT → "Equipment rental"
   - Default → "Available"

## GitHub Actions CI/CD

The project includes automated CI/CD pipeline:
- **Backend**: Java 17 setup, Maven build, test execution
- **Frontend**: Node.js setup, dependency installation, build process
- **Triggers**: Push to main/develop branches, pull requests

## Testing

### API Testing with Postman
Import the following collection for testing:

```json
{
  "info": {
    "name": "Smart Campus API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Resources",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/resources"
      }
    },
    {
      "name": "Create Resource",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/resources",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Lab\",\n  \"type\": \"LAB\",\n  \"capacity\": 30,\n  \"location\": \"Test Location\",\n  \"status\": \"ACTIVE\"\n}"
        }
      }
    }
  ]
}
```

### Booking API Smoke Test Flow
1. Create booking: `POST /api/bookings` (expect `201 Created` and `PENDING` status)
2. Fetch booking: `GET /api/bookings/{id}` (expect same booking data)
3. Approve booking: `PATCH /api/bookings/{id}/status` with `APPROVED`
4. Cancel booking: `PATCH /api/bookings/{id}/status` with `CANCELLED`
5. Verify list: `GET /api/bookings` includes updated status

## Booking Validation and Conflict Rules

### Backend Validation
- Booking date must be today or a future date
- Start time must be earlier than end time
- Attendee count must be positive and within selected resource capacity
- Booking time must be within resource available window
- Only `ACTIVE` resources can be booked

### Conflict Checking
- Conflicts are checked against `PENDING` and `APPROVED` bookings
- Conflict key: same resource + same booking date + overlapping time range
- Overlap rule: existing start < requested end AND existing end > requested start

### Status Workflow
- Default new status: `PENDING`
- Supported statuses: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`
- `CANCELLED` and `REJECTED` bookings cannot transition further
- `APPROVED` bookings cannot transition to `REJECTED`

### Frontend Booking UX Validation
- Date picker blocks past dates
- Client validation enforces `startTime < endTime`
- Client validation enforces attendee count <= selected resource capacity
- Backend field validation errors are shown as per-field messages
- Reset action clears form values and validation/feedback state

## Member Contributions

### Member 2: Booking Workflow + Conflict Checking
- Designed booking data model and DTO-based request/response flow
- Implemented booking endpoints for create/read/update/status update/delete
- Implemented booking conflict detection and status transition rules
- Added booking UI page with queue, filters, approval actions, and conflict preview
- Added frontend validation and backend error mapping for user-friendly feedback

## Error Handling

The API provides proper HTTP status codes:
- `200 OK` - Successful operations
- `201 Created` - Resource created successfully
- `204 No Content` - Resource deleted successfully
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

Error responses include:
```json
{
  "message": "Resource not found with id 5",
  "status": 404,
  "timestamp": "2026-04-06T10:20:00"
}
```




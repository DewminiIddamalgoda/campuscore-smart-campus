# Smart Campus Resource Management System

## Overview
This is Component 1 of the Smart Campus project - **Facilities & Assets Catalogue / Resource Management**. This system manages campus resources such as lecture halls, labs, meeting rooms, and equipment.

## Features

### Core Features
- ✅ **CRUD Operations**: Create, Read, Update, Delete resources
- ✅ **Search & Filter**: Filter by type, location, capacity, and status
- ✅ **Smart Suitability Badge**: Intelligent resource recommendations
- ✅ **RESTful API**: Clean Spring Boot backend with proper HTTP methods
- ✅ **Modern UI**: React frontend with Bootstrap styling

### Unique Feature: Smart Suitability Badge
The system automatically calculates and displays suitability badges:
- 🎓 **Best for lectures** - Large lecture halls (>80 capacity)
- 👥 **Best for small meetings** - Small meeting rooms (≤15 capacity)
- 🔬 **Best for practical labs** - All lab resources
- ⏰ **Limited availability** - Resources with <4 hours availability
- 🚫 **Temporarily unavailable** - Out of service resources

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
mvn clean install
mvn spring-boot:run
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

## Future Enhancements

- [ ] Authentication and authorization
- [ ] Resource booking system
- [ ] Real-time availability updates
- [ ] Mobile-responsive design improvements
- [ ] Advanced analytics dashboard
- [ ] Resource maintenance scheduling

## Team Contribution

This component represents **Member 1's contribution** to the Smart Campus project:
- **Module**: Facilities & Assets Catalogue / Resource Management
- **Endpoints**: 6 REST API endpoints with different HTTP methods
- **Unique Feature**: Smart Suitability Badge system
- **Technologies**: Spring Boot + React + GitHub Actions

## Viva Preparation

**Key talking points for viva:**
- "My component is Module A, Facilities and Assets Catalogue"
- "I implemented resource management for lecture halls, labs, meeting rooms, and equipment"
- "My backend supports create, read, update, delete, and search/filter operations using RESTful endpoints"
- "I used proper validation, exception handling, and HTTP status codes"
- "On the frontend I built pages for resource listing, details, and admin resource management"
- "As an additional innovation, I added a smart suitability badge that helps users quickly identify the most appropriate resource based on type, capacity, status, and availability"

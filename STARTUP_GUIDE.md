# Smart Campus Project - Startup Guide

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MongoDB (or use the provided cloud MongoDB URI)
- Maven
- Git

## Project Structure

```
campuscore-smart-campus/
  smart-campus-api/          # Spring Boot Backend
  smart-campus-client/        # React Frontend
```

## Step 1: Start the Backend (Spring Boot API)

### Navigate to API Directory
```bash
cd smart-campus-api
```

### Build and Run the Application
```bash
# Using Maven Wrapper (Recommended)
./mvnw clean install
./mvnw spring-boot:run

# Or using system Maven
mvn clean install
mvn spring-boot:run
```

### Verify Backend is Running
The API will be available at:
- **Base URL**: `http://localhost:8080/api`
- **Health Check**: `http://localhost:8080/api/actuator/health`
- **Resources Endpoint**: `http://localhost:8080/api/resources`

### MongoDB Configuration
The application is configured to use MongoDB Atlas with the URI:
```
mongodb+srv://admin:1234@cluster0.qx6ugwo.mongodb.net/smart_campus_db?retryWrites=true&w=majority
```

## Step 2: Start the Frontend (React Client)

### Navigate to Client Directory
```bash
cd smart-campus-client
```

### Install Dependencies
```bash
npm install
```

### Start the Development Server
```bash
npm start
```

### Verify Frontend is Running
The React application will be available at:
- **URL**: `http://localhost:5173`
- **Home Page**: `http://localhost:5173/`
- **Resources**: `http://localhost:5173/resources`
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard`

## Step 3: Access the Application

### User Interface
1. **Home Page**: `http://localhost:5173/`
   - View campus information and features
   - Navigate to resources
   - Access admin dashboard (button in slide 3)

2. **Resources Page**: `http://localhost:5173/resources`
   - Browse all campus resources
   - Filter by type, capacity, location, status
   - View resource details

3. **Admin Dashboard**: `http://localhost:5173/admin/dashboard`
   - View analytics and statistics
   - Monitor resource utilization
   - Access management tools

4. **Admin Resources**: `http://localhost:5173/admin/resources`
   - Add, edit, delete resources
   - Manage resource status
   - Advanced filtering and search

### Sample Data
The application automatically seeds 20 sample resources on startup, including:
- 5 Lecture Halls
- 5 Laboratories  
- 5 Meeting Rooms
- 5 Equipment items

## Step 4: Testing the Application

### API Testing
Use these curl commands or Postman to test the API:

```bash
# Get all resources
curl http://localhost:8080/api/resources

# Get resource by ID
curl http://localhost:8080/api/resources/{id}

# Create new resource
curl -X POST http://localhost:8080/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Resource",
    "type": "LECTURE_HALL",
    "capacity": 50,
    "location": "Building A",
    "status": "ACTIVE",
    "availableFrom": "08:00",
    "availableTo": "18:00",
    "description": "Test resource description"
  }'
```

### Frontend Testing
1. Navigate through all pages
2. Test resource filtering and search
3. Try admin CRUD operations
4. Verify responsive design on different screen sizes

## Step 5: Common Issues & Solutions

### Backend Issues
**Port Already in Use**
```bash
# Kill process on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8081
```

**MongoDB Connection Issues**
- Verify MongoDB URI is correct
- Check network connectivity
- Ensure MongoDB Atlas IP whitelist includes your IP

### Frontend Issues
**Port Already in Use**
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm start -- --port 3000
```

**Dependency Issues**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Step 6: Development Workflow

### Making Changes
1. **Backend**: Modify Java files in `smart-campus-api/src/main/java/`
2. **Frontend**: Modify React files in `smart-campus-client/src/`
3. **Styles**: Edit CSS files in `smart-campus-client/src/styles/`

### Hot Reload
- **Backend**: Restart manually after changes
- **Frontend**: Automatic hot reload on save

### Building for Production
```bash
# Backend
./mvnw clean package

# Frontend
npm run build
```

## Step 7: Key Features to Explore

1. **Admin Dashboard Analytics**
   - Resource distribution charts
   - Status overview
   - Trend indicators

2. **Resource Management**
   - Full CRUD operations
   - Advanced filtering
   - Status management

3. **User Interface**
   - Modern responsive design
   - Smooth animations
   - Intuitive navigation

4. **Database Integration**
   - MongoDB with Spring Data
   - Automatic data seeding
   - Real-time updates

## Support

For any issues:
1. Check console logs for errors
2. Verify all services are running
3. Ensure MongoDB connection is active
4. Review the application logs in the backend

---

**Project is now ready to use!** Start both services and explore the Smart Campus Resource Management System.

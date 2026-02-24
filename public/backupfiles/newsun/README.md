# .NET Hello World Web Application with Admin Dashboard

This is a comprehensive web application built with ASP.NET Core 8.0 and Docker that includes a public homepage, admin authentication, and a complete admin dashboard with JSON data management.

## Features

- 🏠 **Public Homepage** - Beautiful "Hello World" landing page
- 🔐 **Admin Authentication** - Secure cookie-based login system
- 👑 **Admin Dashboard** - Complete user management interface
- 📊 **Data Management** - CRUD operations with JSON file storage
- 📈 **Statistics** - Real-time user analytics and metrics
- 🐳 **Docker Support** - Fully containerized application

## Files

- `Program.cs` - Main web application with authentication and API endpoints
- `Models.cs` - Data models and service classes
- `data.json` - JSON database file for user data
- `HelloWorldApp.csproj` - Web project file with authentication packages
- `Dockerfile` - Docker configuration for web app
- `docker-compose.yml` - Docker Compose configuration with port mapping

## Running the Application

### Option 1: Using Docker Compose (Recommended)

1. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. Open your browser and navigate to: http://localhost:8080

### Option 2: Using Docker directly

1. Build the Docker image:
   ```bash
   docker build -t hello-world-dotnet .
   ```

2. Run the container with port mapping:
   ```bash
   docker run -p 8080:8080 hello-world-dotnet
   ```

3. Open your browser and navigate to: http://localhost:8080

### Option 3: Running locally (requires .NET 8.0 SDK)

1. Restore dependencies:
   ```bash
   dotnet restore
   ```

2. Run the application:
   ```bash
   dotnet run
   ```

3. Open your browser and navigate to: http://localhost:5000 or https://localhost:5001

## Admin Access

### Login Credentials
- **Username:** `admin`
- **Password:** `password123`

### Admin Features
- 📊 **Dashboard Statistics** - View total users, active users, departments, and new users
- 👥 **User Management** - View, add, edit, and delete users
- 🔍 **Real-time Data** - All changes are saved to `data.json` immediately
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Endpoints

### Public Endpoints
- **GET /** - Main HTML page with styled "Hello World" message
- **GET /api/hello** - JSON API endpoint returning hello world data

### Admin Endpoints (Authentication Required)
- **GET /admin/login** - Admin login page
- **POST /admin/login** - Process admin login
- **GET /admin/dashboard** - Admin dashboard interface
- **GET /admin/logout** - Logout and redirect to home

### API Endpoints (Authentication Required)
- **GET /api/users** - Get all users
- **GET /api/users/{id}** - Get user by ID
- **POST /api/users** - Create new user
- **PUT /api/users/{id}** - Update existing user
- **DELETE /api/users/{id}** - Delete user

## Data Structure

The `data.json` file contains user records with the following structure:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Developer",
  "department": "Engineering",
  "joinDate": "2023-01-15",
  "status": "Active"
}
```

## Security Features

- 🔐 Cookie-based authentication
- 🛡️ Authorization required for admin areas
- 🚫 Automatic redirect to login for unauthorized access
- 🔒 Session management with secure logout

## Requirements

- Docker installed on your system
- For local development: .NET 8.0 SDK

## Sample Data

The application comes with 5 sample users in different departments and roles for demonstration purposes.

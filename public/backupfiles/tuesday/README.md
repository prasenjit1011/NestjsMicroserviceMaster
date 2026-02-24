# Spring Boot Login Dashboard Application

## Original Prompt
**Request:** "java spring boot hibernate : login html page + dashboard page with docker"  
**Modified to:** Use in-memory data storage instead of database for simplicity

A complete Java Spring Boot application with in-memory data storage, featuring user authentication, a responsive dashboard, and Docker containerization.pring Boot Login Dashboard Application

A complete Java Spring Boot application with Hibernate, featuring user authentication, a responsive dashboard, and Docker containerization.

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Interactive dashboard with user management
- **Security**: Spring Security implementation with role-based access
- **In-Memory Data**: Simple in-memory data storage (no database required)
- **Responsive UI**: Bootstrap-based responsive design
- **Docker Support**: Complete containerization with Docker

## Technologies Used

- Java 17
- Spring Boot 3.2.0
- Spring Security
- Thymeleaf
- In-Memory Data Storage
- Bootstrap 5
- Font Awesome
- Chart.js
- Docker

## Project Structure

```
src/
├── main/
│   ├── java/com/example/springlogindashboard/
│   │   ├── SpringLoginDashboardApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── DashboardController.java
│   │   ├── entity/
│   │   │   └── User.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   └── service/
│   │       ├── UserService.java
│   │       └── CustomUserDetailsService.java
│   └── resources/
│       ├── templates/
│       │   ├── login.html
│       │   ├── register.html
│       │   └── dashboard.html
│       └── application.properties
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spring-login-dashboard
   ```

2. **Build the application**
   ```bash
   mvn clean package
   ```

3. **Run with Docker (optional)**
   ```bash
   docker-compose up --build
   ```

4. **Or run locally with Maven**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - You'll be redirected to the login page

### Manual Setup (without Docker)

1. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The application will start with in-memory data storage. No database setup required!

## Usage

### Registration
- Navigate to `/register` to create a new account
- Provide username, email, and password
- After successful registration, you'll be redirected to login

### Login
- Use your registered credentials to login
- Default admin user: username=`admin`, password=`admin`

### Dashboard Features
- **Overview**: Statistics and activity charts
- **Users**: User management with list of all registered users
- **Analytics**: Visual charts showing user distribution and monthly stats
- **Settings**: Application configuration options

## Docker Configuration

The application includes complete Docker configuration:

- **Dockerfile**: Builds the Spring Boot application
- **docker-compose.yml**: Orchestrates the application and MySQL database
- **Environment Variables**: Configured for containerized deployment

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs spring-app
```

## Security Features

- Password encryption using BCrypt
- CSRF protection
- Session management
- Role-based access control
- Secure logout functionality

## Data Storage

The application uses in-memory data storage for simplicity:

- **No Database Required**: All user data is stored in memory
- **Pre-loaded Users**: Application starts with demo users
- **Session Persistence**: Data persists during application runtime
- **Reset on Restart**: Data is cleared when application restarts

## API Endpoints

- `GET /` - Redirects to login
- `GET /login` - Login page
- `POST /perform_login` - Process login
- `GET /register` - Registration page
- `POST /register` - Process registration
- `GET /dashboard` - Main dashboard (authenticated)
- `POST /logout` - Logout

## Customization

### Adding New Features
1. Create new controllers in `controller` package
2. Add corresponding HTML templates in `templates` directory
3. Update navigation in `dashboard.html`

### Styling
- Bootstrap classes are used throughout
- Custom CSS is included in HTML templates
- Icons provided by Font Awesome

### Database Configuration
- No database configuration needed
- All data is stored in memory
- Application starts with pre-loaded demo users

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Not applicable - uses in-memory storage
   - No database setup required

2. **Port Already in Use**
   - Change port in `application.properties`: `server.port=8081`
   - Update docker-compose.yml accordingly

3. **Docker Build Issues**
   - Ensure Docker daemon is running
   - Run `mvn clean package` before `docker-compose up --build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

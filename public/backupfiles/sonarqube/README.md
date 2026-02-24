# Node.js Express CRUD API with Docker & SonarQube

## Features
- Node.js + Express.js REST API
- In-memory user CRUD (Create, Read, Update, Delete)
- Docker & docker-compose support
- SonarQube integration for code quality

## Usage

### Local Development
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start server:
   ```powershell
   npm start
   ```
   The API runs on `http://localhost:3000`.

### API Endpoints
- `POST /users` — Create user `{ name, email }`
- `GET /users` — List all users
- `GET /users/:id` — Get user by ID
- `PUT /users/:id` — Update user `{ name?, email? }`
- `DELETE /users/:id` — Delete user

### Docker
1. Build and run with Docker Compose:
   ```powershell
   docker-compose up --build
   ```
2. The API will be available at `http://localhost:3000`.

### SonarQube Analysis
1. Run SonarQube server with Docker:
   ```powershell
   docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
   # Default login credentials:
   # Username: admin
   # Password: admin
   ```
   This starts SonarQube at http://localhost:9000
2. Wait for SonarQube to finish initializing (check logs with `docker logs sonarqube`).
3. Access SonarQube at [http://localhost:9000](http://localhost:9000) and set up your project if needed.
4. Update `sonar-project.properties` with your SonarQube server details if needed.
5. Set up your project in SonarQube:
   - Log in to SonarQube at http://localhost:9000 (default credentials: admin/admin).
   - Click "Projects" > "Create Project".
   - Enter a project key and name (e.g., sonarqube-node-express-crud).
   - Choose "Manually" for project setup.
   - Generate a token and copy it (you'll use this for analysis).
   - Update `sonar-project.properties` with your project key and token if needed.
6. Run analysis (requires SonarQube CLI):
   ```powershell
   sonar-scanner
   ```
2. Update `sonar-project.properties` with your SonarQube server details if needed.
3. Run analysis (requires SonarQube CLI):
   ```powershell
   sonar-scanner
   ```

## Environment
- See `.env.example` for environment variable usage.

## License
MIT

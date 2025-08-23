# Global Expansion Management API - Setup Instructions

## Quick Start with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd global-expansion-management-api
   ```

2. **Copy environment variables**

   ```bash
   cp .env.example .env
   ```

3. **Start the application with Docker**

   ```bash
   docker-compose up --build
   ```

   This will:
   - Start MySQL and MongoDB containers
   - Build and start the NestJS application
   - **Automatically seed the database with test data**
   - Make the API available at `http://localhost:3000`

4. **Access the API**
   - API Documentation: `http://localhost:3000/api`
   - Application: `http://localhost:3000`

## Test Credentials

### Admin Users

- Email: `admin@expanders360.com`
- Email: `superadmin@expanders360.com`
- Email: `system.admin@expanders360.com`
- Password: `admin123456`

### Client Users

- Email: `john.smith@techcorp.com`
- Email: `maria.garcia@globalretail.com`
- Email: `david.chen@innovatesoft.com`
- And 7 more client accounts...
- Password: `client123456`

## Seeded Data

The application automatically seeds:

- **3 Admin users**
- **10 Client companies** with users
- **15 Vendors** across different regions and services
- **22 Projects** with various statuses and requirements

## Manual Database Seeding

If you need to re-seed the database manually:

```bash
# Inside the container
docker-compose exec app npm run seed

# Or locally (if running without Docker)
npm run seed
```

## Development without Docker

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start MySQL and MongoDB locally**
   - MySQL on port 3306
   - MongoDB on port 27017

3. **Update .env file** for local development

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   MONGODB_URI=mongodb://localhost:27017/expanders360_docs
   ```

4. **Run seeds and start application**
   ```bash
   npm run seed
   npm run start:dev
   ```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new client
- `POST /auth/login` - Login user
- `POST /auth/admin` - Create admin (Admin only)
- `GET /auth/profile` - Get user profile

### Projects (Client only)

- `GET /projects` - Get client's projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Project Matching

- `POST /projects/:id/matches/rebuild` - Rebuild vendor matches

### Vendors (Admin only)

- `GET /vendors` - Get all vendors
- `POST /vendors` - Create vendor
- `GET /vendors/:id` - Get vendor details
- `PATCH /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Delete vendor

### Documents

- `POST /documents/upload` - Upload document
- `GET /documents/search` - Search documents
- `GET /documents/:id/download` - Download document

## Database Ports

- **MySQL**: `localhost:3307` (external), `mysql:3306` (internal)
- **MongoDB**: `localhost:27017` (external), `mongodb:27017` (internal)

## Troubleshooting

### Database Connection Issues

```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs app
docker-compose logs mysql
docker-compose logs mongodb

# Restart services
docker-compose restart
```

### Re-seed Database

```bash
# Stop containers
docker-compose down

# Remove volumes (this will delete all data)
docker-compose down -v

# Start fresh with automatic seeding
docker-compose up --build
```

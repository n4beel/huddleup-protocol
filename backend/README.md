# HuddleUp Backend

A NestJS backend application with Neo4j database integration for social features.

## Features

- 🚀 NestJS framework with TypeScript
- 🗄️ Neo4j Aura database integration
- 🔧 Environment-based configuration
- 🛡️ Input validation with class-validator
- 🌐 CORS enabled for frontend integration
- 📊 Health check endpoint

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Neo4j Aura account

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your Neo4j Aura credentials:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   ```
   # Database Configuration
   NEO4J_URI=neo4j+s://1bcad8f7.databases.neo4j.io
   NEO4J_USERNAME=your-username
   NEO4J_PASSWORD=your-password
   NEO4J_DATABASE=neo4j
   AURA_INSTANCEID=your-instance-id
   AURA_INSTANCENAME=your-instance-name
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check (includes database connection status)
- `GET /cors-test` - Test CORS configuration
- `GET /api/docs` - Swagger API documentation (interactive)

### Upload Endpoints
- `POST /upload/images` - Upload multiple images to Cloudinary (requires JWT authentication)
- `DELETE /upload/image` - Delete an image from Cloudinary (requires JWT authentication)

## Project Structure

```
src/
├── config/
│   └── database.config.ts    # Database configuration
├── database/
│   ├── database.module.ts    # Database module
│   └── neo4j.service.ts      # Neo4j service
├── dto/
│   ├── health-response.dto.ts      # Health response DTO
│   └── cors-test-response.dto.ts   # CORS test response DTO
├── app.controller.ts         # Main controller
├── app.service.ts           # Main service
├── app.module.ts            # Main module
└── main.ts                  # Application bootstrap
```

## Neo4j Integration

The application includes a `Neo4jService` that provides:
- Database connection management
- Query execution methods
- Session management
- Automatic connection verification

### Usage Example

```typescript
// Inject Neo4jService in your service
constructor(private neo4jService: Neo4jService) {}

// Run a read query
const result = await this.neo4jService.runQuery(
  'MATCH (n) RETURN count(n) as total'
);

// Run a write query
await this.neo4jService.runWriteQuery(
  'CREATE (n:User {name: $name})',
  { name: 'John Doe' }
);
```

## API Documentation

The application includes comprehensive Swagger/OpenAPI documentation:

- **Interactive Documentation:** Visit `http://localhost:3000/api/docs` when the server is running
- **API Schema:** Automatically generated from TypeScript decorators
- **Test Endpoints:** Try out API calls directly from the documentation interface
- **Response Models:** Detailed schemas for all API responses

## Development

- **Start in development mode:** `npm run start:dev`
- **Build:** `npm run build`
- **Start production:** `npm run start:prod`
- **Test:** `npm run test`
- **Lint:** `npm run lint`

## Next Steps

This backend is ready for you to add:
- User authentication (JWT)
- Social features modules
- API endpoints for your frontend
- Data models and DTOs
- Business logic services

Happy coding! 🚀
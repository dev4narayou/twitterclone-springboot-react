# Personal Blog App

A full-stack blog application with Spring Boot backend and React frontend.

## Features

- User authentication with JWT
- Create and view blog posts
- Real-time feed
- Responsive design

## Tech Stack

**Backend:**
- Spring Boot 3.5.3
- PostgreSQL
- Spring Security
- JWT Authentication

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites

- Java 21
- Node.js 18+
- Docker (optional)

### Local Development

1. Clone the repository
2. Start the backend:
   ```bash
   cd blogapp2-backend
   ./gradlew bootRun
   ```
3. Start the frontend:
   ```bash
   cd blogapp2-frontend
   npm install
   npm run dev
   ```

### Docker Deployment

```bash
docker-compose up --build
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGINS` - Allowed CORS origins

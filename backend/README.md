# CyberGuard Backend

A comprehensive threat detection and domain analysis API built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Alert Management**: Create, update, and manage security alerts
- **Domain Analysis**: Check domains for suspicious activity using heuristics
- **OSINT Integration**: Automated threat intelligence gathering
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB:**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or start your local MongoDB service
   ```

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/cyberguard` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `JWT_EXPIRE` | Access token expiration | `15m` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `PHISHTANK_API_KEY` | PhishTank API key (optional) | - |
| `VIRUSTOTAL_API_KEY` | VirusTotal API key (optional) | - |
| `ABUSEIPDB_API_KEY` | AbuseIPDB API key (optional) | - |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Alerts
- `GET /api/alerts` - Get all alerts (with filtering)
- `GET /api/alerts/stats` - Get alert statistics
- `GET /api/alerts/:id` - Get single alert
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert
- `PATCH /api/alerts/:id/resolve` - Resolve alert
- `DELETE /api/alerts/:id` - Delete alert

### Domains
- `GET /api/domains` - Get suspicious domains
- `GET /api/domains/stats` - Get domain statistics
- `GET /api/domains/:id` - Get single domain
- `POST /api/domains/check` - Check domain (public)
- `POST /api/domains` - Add suspicious domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain

### OSINT
- `POST /api/osint/fetch` - Trigger OSINT fetch (admin)
- `GET /api/osint/status` - Get fetch status
- `GET /api/osint/sources` - Get available sources

## Demo Credentials

After seeding the database, you can use these credentials:

- **Email**: `admin@cyberguard.com`
- **Password**: `admin123`

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Docker

### Build and run with Docker Compose

```bash
# From project root
docker-compose up --build
```

### Build individual container

```bash
docker build -t cyberguard-backend .
docker run -p 4000:4000 --env-file .env cyberguard-backend
```

## API Examples

### Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Check Domain (Public)
```bash
curl -X POST http://localhost:4000/api/domains/check \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "suspicious-site.com"
  }'
```

### Create Alert (Authenticated)
```bash
curl -X POST http://localhost:4000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Suspicious Activity Detected",
    "description": "Unusual network traffic detected",
    "severity": "high",
    "category": "suspicious_domain",
    "domain": "malicious-site.com"
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── data/               # Sample data files
├── tests/              # Test files
├── server.js           # Main server file
├── package.json        # Dependencies
├── Dockerfile          # Docker configuration
└── README.md           # This file
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Error Handling**: No sensitive data in error responses

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data

### Code Style

The project uses ESLint and Prettier for code formatting. Run:

```bash
npx eslint src/
npx prettier --write src/
```

## Deployment

### Render.com

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with auto-deploy on push

### Docker

Use the provided Dockerfile for containerized deployment:

```bash
docker build -t cyberguard-backend .
docker run -p 4000:4000 cyberguard-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

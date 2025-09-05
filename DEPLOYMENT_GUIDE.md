# CyberGuard Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Docker Compose (Recommended for Demo)
```bash
# Clone and start everything
git clone <repository-url>
cd cyberguard
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:4000
# MongoDB: localhost:27017
```

### Option 2: Local Development
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Backend
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Option 3: Cloud Deployment
- **Backend**: Deploy to Render.com
- **Frontend**: Deploy to Netlify
- **Database**: Use MongoDB Atlas

---

## 🌐 Cloud Deployment (Render + Netlify)

### Backend Deployment (Render.com)

1. **Connect Repository**
   - Go to [Render.com](https://render.com)
   - Connect your GitHub repository
   - Select the `backend` folder

2. **Configure Service**
   ```
   Name: cyberguard-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=4000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cyberguard
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://cyberguard-backend.onrender.com`)

### Frontend Deployment (Netlify)

1. **Connect Repository**
   - Go to [Netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Select the `frontend` folder

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://cyberguard-backend.onrender.com/api
   VITE_APP_NAME=CyberGuard
   VITE_DEMO_MODE=true
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Note the site URL (e.g., `https://cyberguard-frontend.netlify.app`)

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Choose your preferred region

2. **Configure Access**
   - Create a database user
   - Set up IP whitelist (0.0.0.0/0 for demo)
   - Get connection string

3. **Seed Data**
   ```bash
   # Update MONGO_URI in backend .env
   # Run seed command
   cd backend
   npm run seed
   ```

---

## 🐳 Docker Deployment

### Single Container (Backend Only)
```bash
# Build and run backend
cd backend
docker build -t cyberguard-backend .
docker run -p 4000:4000 --env-file .env cyberguard-backend
```

### Multi-Container (Full Stack)
```bash
# Start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Compose Configuration
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://admin:password@mongodb:27017/cyberguard?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      JWT_REFRESH_SECRET: your-super-secret-refresh-key
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:4000/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

---

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Server Configuration
PORT=4000
NODE_ENV=production

# Database
MONGO_URI=mongodb://localhost:27017/cyberguard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# OSINT API Keys (Optional)
PHISHTANK_API_KEY=your-phishtank-api-key
VIRUSTOTAL_API_KEY=your-virustotal-api-key
ABUSEIPDB_API_KEY=your-abuseipdb-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4000/api

# App Configuration
VITE_APP_NAME=CyberGuard
VITE_APP_VERSION=1.0.0

# Demo Configuration
VITE_DEMO_MODE=true
VITE_DEMO_EMAIL=admin@cyberguard.com
VITE_DEMO_PASSWORD=admin123
```

---

## 🚀 Production Deployment Checklist

### Pre-Deployment
- [ ] Update all environment variables
- [ ] Set strong JWT secrets
- [ ] Configure CORS for production domain
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure domain names and SSL
- [ ] Set up monitoring and logging

### Backend Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB URI
- [ ] Set strong JWT secrets
- [ ] Configure rate limiting
- [ ] Set up health checks
- [ ] Configure logging
- [ ] Set up error monitoring

### Frontend Checklist
- [ ] Set production API URL
- [ ] Configure build optimization
- [ ] Set up CDN (optional)
- [ ] Configure caching headers
- [ ] Set up analytics (optional)
- [ ] Test all functionality

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure cookie options
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use strong passwords
- [ ] Enable security headers
- [ ] Set up monitoring

---

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Backend health check
curl https://your-backend-url.com/health

# Expected response
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### Logs
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Render logs
# Check Render dashboard for logs

# Netlify logs
# Check Netlify dashboard for build logs
```

### Database Maintenance
```bash
# Backup database
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/cyberguard"

# Restore database
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/cyberguard" dump/
```

---

## 🔍 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check environment variables
echo $MONGO_URI
echo $JWT_SECRET

# Check MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/cyberguard"

# Check logs
npm run dev
```

#### Frontend Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check environment variables
echo $VITE_API_BASE_URL

# Build locally
npm run build
```

#### Database Connection Issues
```bash
# Test connection
mongosh "your-connection-string"

# Check network access
ping cluster.mongodb.net

# Verify credentials
# Check MongoDB Atlas dashboard
```

#### CORS Issues
```bash
# Check CORS configuration
# Ensure FRONTEND_URL matches your domain
# Check browser console for CORS errors
```

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Implement Redis for session storage
- Use MongoDB replica sets
- Set up CDN for frontend assets

### Performance Optimization
- Enable gzip compression
- Implement caching strategies
- Use database indexing
- Optimize API responses

### Security Scaling
- Implement API rate limiting per user
- Set up WAF (Web Application Firewall)
- Use secrets management service
- Implement audit logging

---

## 🎯 Demo Deployment

### For Hackathon Demo
1. **Use Docker Compose** - Easiest setup
2. **Pre-seed data** - Run `npm run seed`
3. **Use demo credentials** - admin@cyberguard.com / admin123
4. **Test all features** - Ensure everything works
5. **Have backup plan** - Local development setup ready

### For Production Demo
1. **Deploy to cloud** - Use Render + Netlify
2. **Set up monitoring** - Health checks and logs
3. **Configure SSL** - Use HTTPS
4. **Test thoroughly** - All functionality working
5. **Have rollback plan** - Quick revert capability

---

**Remember**: Always test your deployment before the demo. Have a backup plan ready!

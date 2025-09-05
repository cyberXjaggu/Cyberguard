# 🚀 CyberGuard Startup Guide

This guide explains the different ways to start CyberGuard and when to use each method.

## 📋 Available Startup Methods

### **1. Docker Mode (`./start-docker.sh`)**
**Best for**: Production-like environment, consistent setup, hackathon demos

**Requirements**:
- Docker installed and running
- Docker Compose installed

**Features**:
- ✅ Containerized environment
- ✅ Isolated dependencies
- ✅ Consistent across different systems
- ✅ Easy cleanup
- ✅ Production-like setup

**Usage**:
```bash
./start-docker.sh                # Start all containers
./start-docker.sh --status       # Check container status
./start-docker.sh --stop         # Stop containers
./start-docker.sh --clean        # Clean up everything
```

### **2. Local Development Mode (`./start-local.sh`)**
**Best for**: Development, debugging, when Docker isn't available

**Requirements**:
- Node.js 18+ installed
- MongoDB installed locally
- npm installed

**Features**:
- ✅ Fast development cycle
- ✅ Easy debugging
- ✅ Direct access to logs
- ✅ No Docker required
- ✅ Automatic dependency installation

**Usage**:
```bash
./start-local.sh                 # Start with local npm
./start-local.sh --status        # Check service status
./start-local.sh --stop          # Stop services
./start-local.sh --clean         # Clean up processes
```

### **3. Manual Docker Compose**
**Best for**: Advanced users, custom configurations

**Requirements**:
- Docker installed and running
- Docker Compose installed

**Usage**:
```bash
docker-compose up --build        # Start all services
docker-compose down              # Stop all services
docker-compose logs              # View logs
```

### **4. Manual Development Setup**
**Best for**: Learning, understanding the architecture

**Requirements**:
- Node.js 18+
- MongoDB
- npm

**Usage**:
```bash
# Terminal 1: Start MongoDB
docker run -d -p 27017:27017 --name cyberguard-mongodb mongo:7.0

# Terminal 2: Start Backend
cd backend && npm install && npm run seed && npm run dev

# Terminal 3: Start Frontend
cd frontend && npm install && npm run dev
```

## 🎯 **Which Method Should You Use?**

### **For Hackathon Demo**
```bash
# Try Docker first (most impressive)
./start-docker.sh

# If Docker fails, fallback to local
./start-local.sh
```

### **For Development**
```bash
# Use local development for faster iteration
./start-local.sh
```

### **For Production**
```bash
# Use Docker for consistent deployment
./start-docker.sh
```

### **For Learning**
```bash
# Use manual setup to understand the architecture
# Follow Option 4 in README
```

## 🔧 **Troubleshooting**

### **Docker Issues**
```bash
# Check if Docker is running
docker info

# Start Docker service
sudo systemctl start docker

# Check Docker Compose
docker-compose --version
```

### **Local Development Issues**
```bash
# Check Node.js version
node --version

# Check MongoDB
sudo systemctl status mongod

# Install MongoDB
sudo apt install mongodb-org
```

### **Port Conflicts**
```bash
# Check what's using ports
sudo netstat -tulpn | grep :27017
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :5173

# Kill processes if needed
sudo kill -9 <PID>
```

## 📊 **Script Comparison**

| Feature | Docker Script | Local Script | Manual |
|---------|---------------|--------------|---------|
| **Setup Time** | Fast | Fast | Slow |
| **Dependencies** | Docker only | Node.js + MongoDB | All manually |
| **Isolation** | High | Low | None |
| **Debugging** | Harder | Easier | Easiest |
| **Consistency** | High | Medium | Low |
| **Cleanup** | Easy | Easy | Manual |
| **Hackathon Ready** | ✅ | ✅ | ❌ |

## 🎉 **Quick Start Recommendations**

### **Hackathon Demo (5 minutes)**
1. Try `./start-docker.sh` first
2. If Docker fails, use `./start-local.sh`
3. Access http://localhost:5173
4. Login with `admin@cyberguard.com` / `admin123`

### **Development (Daily use)**
1. Use `./start-local.sh` for development
2. Use `./start-docker.sh` for testing
3. Use manual setup for learning

### **Production Deployment**
1. Use `./start-docker.sh` or `docker-compose up`
2. Configure environment variables
3. Set up monitoring and logging

## 🚀 **Pro Tips**

### **For Hackathon Judges**
- **Start with Docker**: Shows technical sophistication
- **Have fallback ready**: Local script if Docker fails
- **Show both methods**: Demonstrate flexibility
- **Explain the choice**: Why you chose each approach

### **For Development**
- **Use local for coding**: Faster iteration
- **Use Docker for testing**: Production-like environment
- **Keep both scripts**: Different use cases

### **For Production**
- **Use Docker**: Consistent deployment
- **Configure properly**: Environment variables
- **Monitor services**: Health checks and logging

---

**Choose the method that best fits your needs! 🎯**

- **Hackathon**: Docker script (with local fallback)
- **Development**: Local script
- **Production**: Docker script
- **Learning**: Manual setup

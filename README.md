# 🛡️ CyberGuard

<div align="center">

![CyberGuard Logo](docs/images/logo.png)

**A comprehensive threat detection and domain analysis platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🎯 Features](#-features) • [🏗️ Architecture](#️-architecture) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [🎯 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [📊 Demo](#-demo)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Rate limiting and CORS protection
- Helmet security headers

### 🚨 **Threat Detection**
- Real-time suspicious domain analysis
- OSINT data integration (PhishTank, VirusTotal, Abuse.ch)
- Automated threat scoring and classification
- Manual domain checking with heuristics
- Alert management and tracking

### 📊 **Dashboard & Analytics**
- Interactive charts and visualizations
- Real-time threat statistics
- Alert severity distribution
- Domain status monitoring
- Historical data analysis

### 🔧 **Technical Features**
- RESTful API with comprehensive endpoints
- MongoDB for data persistence
- Docker containerization
- Automated OSINT data fetching
- Responsive React frontend
- Real-time updates

---

## 🏗️ Architecture

<div align="center">

![Architecture Diagram](docs/images/architecture.png)

</div>

### **Tech Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + Vite | Modern UI with fast development |
| **Backend** | Node.js + Express | RESTful API server |
| **Database** | MongoDB + Mongoose | Document-based data storage |
| **Authentication** | JWT + bcrypt | Secure user authentication |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Charts** | Recharts | Interactive data visualizations |
| **Containerization** | Docker + Docker Compose | Easy deployment and scaling |
| **OSINT** | PhishTank, VirusTotal, Abuse.ch | External threat intelligence |

### **Project Structure**

```
cyberguard/
├── 📁 backend/                 # Node.js API server
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # API route handlers
│   │   ├── 📁 middleware/      # Authentication, validation, etc.
│   │   ├── 📁 models/          # MongoDB schemas
│   │   ├── 📁 routes/          # API endpoints
│   │   ├── 📁 services/        # Business logic
│   │   └── 📁 utils/           # Helper functions
│   ├── 📁 data/                # Sample data files
│   ├── 📁 tests/               # Unit and integration tests
│   └── 📄 Dockerfile           # Backend container config
├── 📁 frontend/                # React application
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 pages/           # Application pages
│   │   ├── 📁 context/         # React Context providers
│   │   ├── 📁 services/        # API client
│   │   └── 📁 utils/           # Frontend utilities
│   └── 📄 Dockerfile           # Frontend container config
├── 📁 docs/                    # Documentation and images
├── 📄 docker-compose.yml       # Multi-container setup
├── 📄 start-docker.sh         # Docker container startup
└── 📄 start-local.sh          # Local development startup
```

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ (for local development)
- Docker & Docker Compose (for Docker mode)
- Git

### **Option 1: Docker Mode (Recommended)**

```bash
# Clone the repository
git clone https://github.com/yourusername/cyberguard.git
cd cyberguard

# Start with Docker
./start-docker.sh
```

### **Option 2: Local Development Mode**

```bash
# Clone the repository
git clone https://github.com/yourusername/cyberguard.git
cd cyberguard

# Start with local npm development
./start-local.sh
```

### **Option 3: Docker Compose (Manual)**

```bash
# Clone and start with Docker Compose
git clone https://github.com/yourusername/cyberguard.git
cd cyberguard
docker-compose up --build
```

### **Option 4: Manual Development Setup**

```bash
# 1. Start MongoDB
docker run -d -p 27017:27017 --name cyberguard-mongodb mongo:7.0

# 2. Start Backend (Terminal 1)
cd backend
npm install
npm run seed
npm run dev

# 3. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

### **Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### **Demo Credentials**

```
Email: admin@cyberguard.com
Password: admin123
```

### **Startup Scripts**

| Script | Purpose | Requirements |
|--------|---------|--------------|
| `./start-docker.sh` | Docker containers | Docker & Docker Compose |
| `./start-local.sh` | Local npm development | Node.js 18+, MongoDB |
| `docker-compose up` | Manual Docker setup | Docker & Docker Compose |

#### **Script Management Commands**

```bash
# Check status
./start-docker.sh --status
./start-local.sh --status

# Stop services
./start-docker.sh --stop
./start-local.sh --stop

# Clean up
./start-docker.sh --clean
./start-local.sh --clean
```

---

## 📖 Documentation

### **API Documentation**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/refresh` | POST | Token refresh |
| `/api/alerts` | GET/POST | List/create alerts |
| `/api/alerts/:id` | GET/PUT/DELETE | Alert management |
| `/api/domains` | GET/POST | List/add domains |
| `/api/domains/check` | POST | Check domain safety |
| `/api/osint/fetch` | POST | Trigger OSINT fetch |
| `/health` | GET | System health check |

### **Environment Variables**

#### Backend (.env)
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/cyberguard
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FRONTEND_URL=http://localhost:5173
PHISHTANK_API_KEY=your-phishtank-api-key
VIRUSTOTAL_API_KEY=your-virustotal-api-key
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=CyberGuard
```

---

## 🛠️ Development

### **Available Scripts**

#### Backend
```bash
npm run dev      # Start development server
npm run start    # Start production server
npm run seed     # Load sample data
npm run test     # Run tests
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### **Testing**

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

### **Code Quality**

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (optional)
- Jest for testing

---

## 🚀 Deployment

### **Docker Deployment**

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

### **Cloud Deployment**

#### **Backend (Render)**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### **Frontend (Netlify)**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### **Production Checklist**

- [ ] Set secure JWT secrets
- [ ] Configure MongoDB Atlas
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backup strategy

---

## 📊 Demo

### **Live Demo Features**

1. **🔐 Authentication**
   - Register new account
   - Login with demo credentials
   - Secure token management

2. **📊 Dashboard**
   - Real-time threat statistics
   - Interactive charts
   - Alert summaries

3. **🚨 Alert Management**
   - View all alerts
   - Filter by severity/status
   - Create manual alerts

4. **🔍 Domain Analysis**
   - Check suspicious domains
   - View threat scores
   - Historical analysis

5. **⚙️ Settings**
   - User profile management
   - System preferences

### **Sample Data**

The application comes with pre-loaded sample data:
- 8 security alerts
- 7 suspicious domains
- 1 admin user account
- OSINT sample feeds

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **How to Contribute**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Use conventional commit messages

### **Issue Reporting**

Found a bug? Have a feature request? Please [open an issue](https://github.com/yourusername/cyberguard/issues) with:

- Clear description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 🏆 Hackathon Features

This project was built for hackathon demonstration with:

- ⚡ **48-72 hour development timeline**
- 🎯 **MVP-focused feature set**
- 🚀 **One-command deployment**
- 📊 **Impressive visualizations**
- 🔒 **Production-ready security**
- 📱 **Responsive design**
- 🐳 **Docker containerization**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **PhishTank** for phishing data
- **VirusTotal** for threat intelligence
- **Abuse.ch** for malware feeds
- **React** and **Node.js** communities
- **Tailwind CSS** for beautiful styling

---

<div align="center">

**Built with ❤️ for cybersecurity professionals**

[⭐ Star this repo](https://github.com/yourusername/cyberguard) • [🐛 Report Bug](https://github.com/yourusername/cyberguard/issues) • [💡 Request Feature](https://github.com/yourusername/cyberguard/issues)

</div>
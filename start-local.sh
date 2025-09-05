#!/bin/bash

# CyberGuard Local Development Startup Script
# This script starts CyberGuard using local npm development (no Docker required)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=30
    local attempt=1

    print_status "Waiting for $service_name to be ready on $host:$port..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z $host $port 2>/dev/null; then
            print_success "$service_name is ready!"
            return 0
        fi
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within $max_attempts seconds"
    return 1
}

# Function to show usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help       Show this help message"
    echo "  -s, --stop       Stop running services"
    echo "  -c, --clean      Clean up processes and logs"
    echo "  --status         Show service status"
    echo ""
    echo "Examples:"
    echo "  $0                # Start all services"
    echo "  $0 --stop         # Stop running services"
    echo "  $0 --clean        # Clean up everything"
    echo "  $0 --status       # Show service status"
}

# Function to stop services
stop_services() {
    print_header "🛑 Stopping CyberGuard services..."
    
    # Stop backend process
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_status "Stopping backend (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
            print_success "Backend stopped"
        fi
        rm -f .backend.pid
    fi
    
    # Stop frontend process
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_status "Stopping frontend (PID: $FRONTEND_PID)..."
            kill $FRONTEND_PID
            print_success "Frontend stopped"
        fi
        rm -f .frontend.pid
    fi
    
    # Stop local MongoDB if running
    if pgrep -x "mongod" > /dev/null; then
        print_status "Stopping local MongoDB..."
        sudo systemctl stop mongod 2>/dev/null || {
            print_warning "Could not stop MongoDB service. You may need to stop it manually."
        }
        print_success "MongoDB stopped"
    fi
    
    print_success "All services stopped"
}

# Function to clean up everything
cleanup() {
    print_header "🧹 Cleaning up CyberGuard..."
    
    # Stop services first
    stop_services
    
    # Remove log files
    rm -f backend.log frontend.log
    
    # Remove PID files
    rm -f .backend.pid .frontend.pid
    
    print_success "Cleanup completed"
}

# Function to show status
show_status() {
    print_header "📊 CyberGuard Status"
    
    echo ""
    echo "Services:"
    
    # Check backend
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo -e "  Backend:  ${GREEN}Running${NC} (PID: $BACKEND_PID)"
        else
            echo -e "  Backend:  ${RED}Stopped${NC}"
        fi
    else
        echo -e "  Backend:  ${YELLOW}Not started${NC}"
    fi
    
    # Check frontend
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            echo -e "  Frontend: ${GREEN}Running${NC} (PID: $FRONTEND_PID)"
        else
            echo -e "  Frontend: ${RED}Stopped${NC}"
        fi
    else
        echo -e "  Frontend: ${YELLOW}Not started${NC}"
    fi
    
    # Check MongoDB
    if pgrep -x "mongod" > /dev/null; then
        echo -e "  MongoDB:  ${GREEN}Running${NC} (Local)"
    else
        echo -e "  MongoDB:  ${RED}Stopped${NC}"
    fi
    
    echo ""
    echo "Access URLs:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:4000"
    echo "  Health:   http://localhost:4000/health"
    echo ""
    echo "Demo Credentials:"
    echo "  Email:    admin@cyberguard.com"
    echo "  Password: admin123"
}

# Main startup function
start_local() {
    print_header "📦 Starting CyberGuard with Local Development..."
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        print_status "Visit: https://nodejs.org/"
        return 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        print_status "Please upgrade Node.js: https://nodejs.org/"
        return 1
    fi
    
    print_success "Node.js $(node -v) is installed"
    
    # Check if npm is installed
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm and try again."
        return 1
    fi
    
    print_success "npm $(npm -v) is installed"
    
    # Check if MongoDB is available locally
    if command_exists mongod; then
        print_status "Checking local MongoDB..."
        if ! pgrep -x "mongod" > /dev/null; then
            print_status "Starting local MongoDB..."
            sudo systemctl start mongod 2>/dev/null || {
                print_warning "Could not start MongoDB service automatically."
                print_status "Please start MongoDB manually:"
                print_status "  sudo systemctl start mongod"
                print_status "  # or"
                print_status "  mongod --dbpath /var/lib/mongodb"
                return 1
            }
        else
            print_success "MongoDB is already running"
        fi
    else
        print_warning "MongoDB is not installed locally."
        print_status "Installing MongoDB..."
        
        # Try to install MongoDB (Ubuntu/Debian)
        if command_exists apt; then
            print_status "Installing MongoDB with apt..."
            
            # Import MongoDB public key
            wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
            
            # Add MongoDB repository
            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
            
            # Update package list
            sudo apt update
            
            # Install MongoDB
            sudo apt install -y mongodb-org
            
            # Start and enable MongoDB
            sudo systemctl start mongod
            sudo systemctl enable mongod
            
            print_success "MongoDB installed and started"
        else
            print_error "Could not install MongoDB automatically."
            print_status "Please install MongoDB manually:"
            print_status "  Ubuntu/Debian: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/"
            print_status "  macOS: brew install mongodb-community"
            print_status "  Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/"
            return 1
        fi
    fi
    
    # Wait for MongoDB to be ready
    wait_for_service localhost 27017 "MongoDB"
    
    # Install backend dependencies
    if [ ! -d "backend/node_modules" ]; then
        print_status "Installing backend dependencies..."
        cd backend && npm install && cd ..
        print_success "Backend dependencies installed"
    else
        print_success "Backend dependencies already installed"
    fi
    
    # Install frontend dependencies
    if [ ! -d "frontend/node_modules" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
        print_success "Frontend dependencies installed"
    else
        print_success "Frontend dependencies already installed"
    fi
    
    # Seed the database
    print_status "Seeding database with sample data..."
    cd backend && npm run seed && cd ..
    print_success "Database seeded with sample data"
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend && npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    print_success "Backend started (PID: $BACKEND_PID)"
    
    # Wait for backend to be ready
    wait_for_service localhost 4000 "Backend API"
    
    # Start frontend in background
    print_status "Starting frontend server..."
    cd frontend && npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    print_success "Frontend started (PID: $FRONTEND_PID)"
    
    # Wait for frontend to be ready
    wait_for_service localhost 5173 "Frontend"
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    print_success "CyberGuard is running with local development!"
    return 0
}

# Main script logic
main() {
    print_header "🚀 CyberGuard Local Development Startup"
    echo "=============================================="
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -s|--stop)
                stop_services
                exit 0
                ;;
            -c|--clean)
                cleanup
                exit 0
                ;;
            --status)
                show_status
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Start local development
    start_local
    
    if [ $? -eq 0 ]; then
        echo ""
        print_header "🎉 CyberGuard is ready!"
        echo "=============================================="
        echo ""
        echo "Access URLs:"
        echo "  🌐 Frontend: http://localhost:5173"
        echo "  🔧 Backend:  http://localhost:4000"
        echo "  ❤️  Health:   http://localhost:4000/health"
        echo ""
        echo "Demo Credentials:"
        echo "  📧 Email:    admin@cyberguard.com"
        echo "  🔑 Password: admin123"
        echo ""
        echo "Management Commands:"
        echo "  📊 Status:   $0 --status"
        echo "  🛑 Stop:     $0 --stop"
        echo "  🧹 Clean:    $0 --clean"
        echo ""
        print_success "Happy coding! 🚀"
    else
        print_error "Failed to start CyberGuard. Check the logs above for details."
        exit 1
    fi
}

# Run main function
main "$@"

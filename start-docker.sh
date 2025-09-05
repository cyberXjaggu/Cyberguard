#!/bin/bash

# CyberGuard Docker Startup Script
# This script starts CyberGuard using Docker containers

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

# Function to show usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help       Show this help message"
    echo "  -s, --stop       Stop Docker containers"
    echo "  -c, --clean      Clean up containers and volumes"
    echo "  --status         Show container status"
    echo ""
    echo "Examples:"
    echo "  $0                # Start all containers"
    echo "  $0 --stop         # Stop containers"
    echo "  $0 --clean        # Clean up everything"
    echo "  $0 --status       # Show container status"
}

# Function to stop containers
stop_containers() {
    print_header "🛑 Stopping CyberGuard containers..."
    
    # Stop and remove containers
    if docker ps -a | grep -q "cyberguard"; then
        print_status "Stopping CyberGuard containers..."
        docker-compose down
        print_success "Containers stopped"
    else
        print_warning "No CyberGuard containers found"
    fi
}

# Function to clean up everything
cleanup() {
    print_header "🧹 Cleaning up CyberGuard Docker setup..."
    
    # Stop containers first
    stop_containers
    
    # Remove containers and volumes
    print_status "Removing containers and volumes..."
    docker-compose down -v --remove-orphans
    
    # Remove images (optional)
    read -p "Do you want to remove Docker images as well? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Removing Docker images..."
        docker rmi cyberguard-backend cyberguard-frontend 2>/dev/null || true
        print_success "Docker images removed"
    fi
    
    print_success "Cleanup completed"
}

# Function to show status
show_status() {
    print_header "📊 CyberGuard Docker Status"
    
    echo ""
    echo "Containers:"
    docker-compose ps
    
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
start_docker() {
    print_header "🐳 Starting CyberGuard with Docker..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        print_status "Start Docker with: sudo systemctl start docker"
        return 1
    fi
    
    print_success "Docker is running"
    
    # Check if Docker Compose is available
    if ! command -v docker-compose > /dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        return 1
    fi
    
    print_success "Docker Compose is available"
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose up --build -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "CyberGuard is running with Docker!"
        return 0
    else
        print_error "Failed to start CyberGuard containers"
        docker-compose logs
        return 1
    fi
}

# Main script logic
main() {
    print_header "🚀 CyberGuard Docker Startup"
    echo "=================================="
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -s|--stop)
                stop_containers
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
    
    # Start Docker containers
    start_docker
    
    if [ $? -eq 0 ]; then
        echo ""
        print_header "🎉 CyberGuard is ready!"
        echo "=================================="
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
        print_success "Happy hacking! 🚀"
    else
        print_error "Failed to start CyberGuard. Check the logs above for details."
        exit 1
    fi
}

# Run main function
main "$@"

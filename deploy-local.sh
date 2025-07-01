#!/bin/bash

# Simple OpenAI - Local Deployment Script
# This script sets up and tests the application locally before Vercel deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Python version
check_python_version() {
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
        if [[ $(echo "$PYTHON_VERSION >= 3.8" | bc -l) -eq 1 ]]; then
            print_success "Python $PYTHON_VERSION found"
            PYTHON_CMD="python3"
        else
            print_error "Python 3.8+ required, found $PYTHON_VERSION"
            exit 1
        fi
    elif command_exists python; then
        PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
        if [[ $(echo "$PYTHON_VERSION >= 3.8" | bc -l) -eq 1 ]]; then
            print_success "Python $PYTHON_VERSION found"
            PYTHON_CMD="python"
        else
            print_error "Python 3.8+ required, found $PYTHON_VERSION"
            exit 1
        fi
    else
        print_error "Python not found. Please install Python 3.8+"
        exit 1
    fi
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d. -f1)
        if [[ $NODE_VERSION -ge 18 ]]; then
            print_success "Node.js $(node --version) found"
        else
            print_error "Node.js 18+ required, found $(node --version)"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi
}

# Function to check npm
check_npm() {
    if command_exists npm; then
        print_success "npm $(npm --version) found"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd api
    
    # Create virtual environment if it doesn't exist
    if [[ ! -d "venv" ]]; then
        print_status "Creating Python virtual environment..."
        $PYTHON_CMD -m venv venv
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Test backend startup
    print_status "Testing backend startup..."
    timeout 10s $PYTHON_CMD app.py &
    BACKEND_PID=$!
    sleep 3
    
    # Check if backend is running
    if curl -s http://127.0.0.1:8000/api/health > /dev/null; then
        print_success "Backend is running successfully"
        kill $BACKEND_PID 2>/dev/null || true
    else
        print_error "Backend failed to start"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    # Test frontend startup
    print_status "Testing frontend startup..."
    timeout 10s npm start &
    FRONTEND_PID=$!
    sleep 5
    
    # Check if frontend is running
    if curl -s http://127.0.0.1:3000 > /dev/null; then
        print_success "Frontend is running successfully"
        kill $FRONTEND_PID 2>/dev/null || true
    else
        print_error "Frontend failed to start"
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
    
    cd ..
}

# Function to run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    # Start backend
    cd api
    source venv/bin/activate
    $PYTHON_CMD app.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 3
    
    # Test API endpoints
    print_status "Testing API endpoints..."
    
    # Health check
    if curl -s http://127.0.0.1:8000/api/health | grep -q "ok"; then
        print_success "Health check passed"
    else
        print_error "Health check failed"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Test API key validation endpoint
    if curl -s -X POST http://127.0.0.1:8000/api/test-key \
        -H "Content-Type: application/json" \
        -d '{"api_key": "sk-proj-invalid-key-for-testing"}' | grep -q "Invalid API Key format"; then
        print_success "API key validation endpoint working"
    else
        print_error "API key validation endpoint failed"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop backend
    kill $BACKEND_PID 2>/dev/null || true
}

# Function to start both services
start_services() {
    print_status "Starting both services..."
    
    # Start backend
    cd api
    source venv/bin/activate
    print_status "Starting backend on http://127.0.0.1:8000"
    $PYTHON_CMD app.py &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    cd frontend
    print_status "Starting frontend on http://127.0.0.1:3000"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for services to start
    sleep 5
    
    # Check if both services are running
    if curl -s http://127.0.0.1:8000/api/health > /dev/null && \
       curl -s http://127.0.0.1:3000 > /dev/null; then
        print_success "Both services are running successfully!"
        echo ""
        echo "🌐 Application URLs:"
        echo "   Frontend: http://127.0.0.1:3000"
        echo "   Backend API: http://127.0.0.1:8000"
        echo "   API Docs: http://127.0.0.1:8000/docs"
        echo ""
        echo "Press Ctrl+C to stop both services"
        
        # Wait for user to stop
        wait
    else
        print_error "Failed to start services"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Main execution
main() {
    echo "🚀 Simple OpenAI - Local Deployment Script"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_python_version
    check_node_version
    check_npm
    
    # Setup services
    setup_backend
    setup_frontend
    
    # Run tests
    run_integration_tests
    
    print_success "All tests passed! Application is ready for local deployment."
    echo ""
    
    # Ask user if they want to start services
    read -p "Do you want to start both services now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Set up signal handler for cleanup
        trap cleanup SIGINT SIGTERM
        start_services
    else
        print_status "Setup complete. You can start services manually:"
        echo ""
        echo "Backend:"
        echo "  cd api && source venv/bin/activate && python app.py"
        echo ""
        echo "Frontend:"
        echo "  cd frontend && npm run dev"
        echo ""
    fi
}

# Run main function
main "$@" 
#!/bin/bash

# Simple OpenAI - UV Local Deployment Script
# This script uses UV for fast Python environment management

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to check UV installation
check_uv() {
    if command_exists uv; then
        UV_VERSION=$(uv --version)
        print_success "UV $UV_VERSION found"
    else
        print_error "UV not found. Please install UV first:"
        echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
        echo "  Or visit: https://docs.astral.sh/uv/getting-started/installation/"
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

# Function to setup backend with UV
setup_backend_uv() {
    print_status "Setting up backend with UV..."
    
    # Check if pyproject.toml exists
    if [[ ! -f "pyproject.toml" ]]; then
        print_error "pyproject.toml not found. Please ensure you're in the project root."
        exit 1
    fi
    
    # Create virtual environment and install dependencies with UV
    print_status "Creating virtual environment and installing dependencies..."
    uv sync
    
    # Test backend startup
    print_status "Testing backend startup..."
    timeout 10s uv run python api/app.py &
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

# Function to run integration tests with UV
run_integration_tests_uv() {
    print_status "Running integration tests with UV..."
    
    # Start backend
    print_status "Starting backend for testing..."
    uv run python api/app.py &
    BACKEND_PID=$!
    
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
    
    # Test session creation
    if curl -s -X POST http://127.0.0.1:8000/api/sessions \
        -H "Content-Type: application/json" \
        -d '{"developer_message": "You are a helpful assistant."}' | grep -q "session_id"; then
        print_success "Session creation endpoint working"
    else
        print_error "Session creation endpoint failed"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop backend
    kill $BACKEND_PID 2>/dev/null || true
}

# Function to start both services with UV
start_services_uv() {
    print_status "Starting both services with UV..."
    
    # Start backend with UV
    print_status "Starting backend on http://127.0.0.1:8000"
    uv run python api/app.py &
    BACKEND_PID=$!
    
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
        echo "📦 UV Environment Info:"
        echo "   Virtual Environment: .venv/"
        echo "   Lock File: uv.lock"
        echo "   Dependencies: pyproject.toml"
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

# Function to show UV environment info
show_uv_info() {
    echo ""
    echo "📋 UV Environment Information:"
    echo "=============================="
    echo "Project: $(uv pip list | grep simple-openai || echo 'Not installed in editable mode')"
    echo "Python: $(uv run python --version)"
    echo "Dependencies:"
    uv pip list --format=freeze | grep -E "(fastapi|uvicorn|openai|pydantic)" || echo "No dependencies found"
    echo ""
    echo "🔧 UV Commands:"
    echo "   uv sync                    - Install all dependencies"
    echo "   uv add <package>           - Add new dependency"
    echo "   uv add --dev <package>     - Add dev dependency"
    echo "   uv run python api/app.py   - Run with UV environment"
    echo "   uv run pytest              - Run tests"
    echo ""
}

# Main execution
main() {
    echo "🚀 Simple OpenAI - UV Local Deployment Script"
    echo "============================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_uv
    check_node_version
    check_npm
    
    # Setup services
    setup_backend_uv
    setup_frontend
    
    # Run tests
    run_integration_tests_uv
    
    print_success "All tests passed! Application is ready for local deployment."
    
    # Show UV information
    show_uv_info
    
    # Ask user if they want to start services
    read -p "Do you want to start both services now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Set up signal handler for cleanup
        trap cleanup SIGINT SIGTERM
        start_services_uv
    else
        print_status "Setup complete. You can start services manually:"
        echo ""
        echo "Backend (with UV):"
        echo "  uv run python api/app.py"
        echo ""
        echo "Frontend:"
        echo "  cd frontend && npm run dev"
        echo ""
        echo "Or use the one-command approach:"
        echo "  uv run python api/app.py & cd frontend && npm run dev"
    fi
}

# Run main function
main "$@" 
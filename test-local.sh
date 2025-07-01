#!/bin/bash

# Simple OpenAI - Local Testing Script
# Comprehensive testing suite for local validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "Running: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "$test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_error "$test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to test backend health
test_backend_health() {
    local response=$(curl -s http://127.0.0.1:8000/api/health)
    if echo "$response" | grep -q '"status":"ok"'; then
        return 0
    else
        return 1
    fi
}

# Function to test API key validation
test_api_key_validation() {
    local response=$(curl -s -X POST http://127.0.0.1:8000/api/test-key \
        -H "Content-Type: application/json" \
        -d '{"api_key": "sk-proj-invalid-key-for-testing"}')
    
    if echo "$response" | grep -q "Invalid API Key format"; then
        return 0
    else
        return 1
    fi
}

# Function to test session creation
test_session_creation() {
    local response=$(curl -s -X POST http://127.0.0.1:8000/api/sessions \
        -H "Content-Type: application/json" \
        -d '{"developer_message": "You are a helpful assistant."}')
    
    if echo "$response" | grep -q "session_id"; then
        return 0
    else
        return 1
    fi
}

# Function to test frontend accessibility
test_frontend_accessibility() {
    local response=$(curl -s http://127.0.0.1:3000)
    if echo "$response" | grep -q "Simple OpenAI"; then
        return 0
    else
        return 1
    fi
}

# Function to test API documentation
test_api_docs() {
    local response=$(curl -s http://127.0.0.1:8000/docs)
    if echo "$response" | grep -q "Swagger UI"; then
        return 0
    else
        return 1
    fi
}

# Function to test CORS headers
test_cors_headers() {
    local response=$(curl -s -I -X OPTIONS http://127.0.0.1:8000/api/health)
    if echo "$response" | grep -q "Access-Control-Allow-Origin"; then
        return 0
    else
        return 1
    fi
}

# Function to test build process
test_build_process() {
    cd frontend
    if npm run build > /dev/null 2>&1; then
        cd ..
        return 0
    else
        cd ..
        return 1
    fi
}

# Function to test Python dependencies
test_python_dependencies() {
    cd api
    source venv/bin/activate
    if python -c "import fastapi, uvicorn, openai, pydantic" > /dev/null 2>&1; then
        cd ..
        return 0
    else
        cd ..
        return 1
    fi
}

# Function to test Node.js dependencies
test_node_dependencies() {
    cd frontend
    if npm list --depth=0 > /dev/null 2>&1; then
        cd ..
        return 0
    else
        cd ..
        return 1
    fi
}

# Function to test port availability
test_port_availability() {
    if ! lsof -i :8000 > /dev/null 2>&1 && ! lsof -i :3000 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to test file structure
test_file_structure() {
    local required_files=(
        "api/app.py"
        "api/requirements.txt"
        "frontend/package.json"
        "frontend/app/page.tsx"
        "frontend/app/layout.tsx"
        "vercel.json"
        "README.md"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            return 1
        fi
    done
    return 0
}

# Function to test environment setup
test_environment_setup() {
    # Check if virtual environment exists
    if [[ ! -d "api/venv" ]]; then
        return 1
    fi
    
    # Check if node_modules exists
    if [[ ! -d "frontend/node_modules" ]]; then
        return 1
    fi
    
    return 0
}

# Function to test configuration files
test_configuration_files() {
    # Test vercel.json syntax
    if python -m json.tool vercel.json > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Main testing function
main() {
    echo "🧪 Simple OpenAI - Local Testing Suite"
    echo "======================================"
    echo ""
    
    # Check if services are running
    print_status "Checking if services are running..."
    
    # Start backend if not running
    if ! curl -s http://127.0.0.1:8000/api/health > /dev/null 2>&1; then
        print_warning "Backend not running. Starting backend for testing..."
        cd api
        source venv/bin/activate
        python app.py &
        BACKEND_PID=$!
        cd ..
        sleep 3
    fi
    
    # Start frontend if not running
    if ! curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
        print_warning "Frontend not running. Starting frontend for testing..."
        cd frontend
        npm run dev &
        FRONTEND_PID=$!
        cd ..
        sleep 5
    fi
    
    echo ""
    print_status "Running comprehensive test suite..."
    echo ""
    
    # File and structure tests
    run_test "File structure validation" "test_file_structure"
    run_test "Configuration files validation" "test_configuration_files"
    run_test "Environment setup validation" "test_environment_setup"
    run_test "Port availability check" "test_port_availability"
    
    # Dependency tests
    run_test "Python dependencies validation" "test_python_dependencies"
    run_test "Node.js dependencies validation" "test_node_dependencies"
    run_test "Frontend build process" "test_build_process"
    
    # Backend API tests
    run_test "Backend health endpoint" "test_backend_health"
    run_test "API key validation endpoint" "test_api_key_validation"
    run_test "Session creation endpoint" "test_session_creation"
    run_test "CORS headers validation" "test_cors_headers"
    run_test "API documentation accessibility" "test_api_docs"
    
    # Frontend tests
    run_test "Frontend accessibility" "test_frontend_accessibility"
    
    echo ""
    echo "📊 Test Results Summary"
    echo "======================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Passed: $PASSED_TESTS"
    echo "Failed: $FAILED_TESTS"
    echo ""
    
    if [[ $FAILED_TESTS -eq 0 ]]; then
        print_success "All tests passed! Application is ready for deployment."
        echo ""
        echo "✅ Deployment Checklist:"
        echo "   ✓ All dependencies installed"
        echo "   ✓ Backend API functional"
        echo "   ✓ Frontend build successful"
        echo "   ✓ Configuration files valid"
        echo "   ✓ Services can start and run"
        echo ""
        echo "🚀 Ready to deploy to Vercel!"
    else
        print_error "$FAILED_TESTS test(s) failed. Please fix issues before deployment."
        echo ""
        echo "❌ Issues to resolve:"
        echo "   - Check the failed tests above"
        echo "   - Ensure all dependencies are installed"
        echo "   - Verify configuration files"
        echo "   - Test services manually"
    fi
    
    # Cleanup
    if [[ -n "$BACKEND_PID" ]]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [[ -n "$FRONTEND_PID" ]]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
}

# Run main function
main "$@" 
#!/bin/bash

# Prompt Optimization Platform Startup Script
# This script starts all necessary services for the platform

echo "🚀 Starting Prompt Optimization Platform..."
echo "=" * 60

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

# Check if required services are running
check_service() {
    local service=$1
    local port=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        print_success "$service is running on port $port"
        return 0
    else
        print_warning "$service is not running on port $port"
        return 1
    fi
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Python
if command -v python >/dev/null 2>&1; then
    PYTHON_VERSION=$(python --version)
    print_success "Python found: $PYTHON_VERSION"
elif command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
else
    print_error "Python not found. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating from template..."
    cat > .env.local << EOF
# Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8001

# Optional: Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Optional: External APIs
OPENAI_API_KEY=your-openai-api-key
EOF
    print_success "Created .env.local template"
fi

# Start services
print_status "Starting services..."

# Start Redis (if not running)
if ! check_service "Redis" 6379; then
    print_status "Starting Redis..."
    if command -v redis-server >/dev/null 2>&1; then
        redis-server --daemonize yes
        sleep 2
        if check_service "Redis" 6379; then
            print_success "Redis started successfully"
        else
            print_error "Failed to start Redis"
        fi
    else
        print_warning "Redis not found. Please install Redis or use Docker: docker run -d -p 6379:6379 redis:alpine"
    fi
fi

# Start PostgreSQL (if not running)
if ! check_service "PostgreSQL" 5432; then
    print_warning "PostgreSQL not detected. Please ensure PostgreSQL is running on port 5432"
    print_status "You can start it with Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15"
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
if npm ci; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Start frontend
print_status "Starting Next.js frontend..."
npm run dev &
FRONTEND_PID=$!
print_success "Frontend started with PID: $FRONTEND_PID"

# Check if backend directory exists
if [ -d "django_backend" ]; then
    print_status "Django backend directory found"
    
    # Activate virtual environment and start backend
    if [ -d "django_backend/django_backend" ]; then
        cd django_backend
        
        # Activate virtual environment
        if [ -f "bin/activate" ]; then
            source bin/activate
        elif [ -f "Scripts/activate" ]; then
            source Scripts/activate
        fi
        
        # Start Django server
        print_status "Starting Django backend..."
        python manage.py runserver 0.0.0.0:8000 &
        BACKEND_PID=$!
        print_success "Backend started with PID: $BACKEND_PID"
        
        # Start WebSocket server (if script exists)
        if [ -f "manage.py" ]; then
            print_status "Starting WebSocket server..."
            python manage.py run_websocket_server &
            WS_PID=$!
            print_success "WebSocket server started with PID: $WS_PID"
        fi
        
        # Start Celery worker (if available)
        if command -v celery >/dev/null 2>&1; then
            print_status "Starting Celery worker..."
            celery -A promptcraft_backend worker -l info &
            CELERY_PID=$!
            print_success "Celery worker started with PID: $CELERY_PID"
        fi
        
        cd ..
    fi
else
    print_warning "Django backend not found. Run 'python django_setup.py' to set it up."
fi

# Wait a bit for services to start
sleep 5

# Check if all services are running
print_status "Checking service status..."

echo ""
echo "🌐 Service Status:"
echo "==================="

if check_service "Frontend (Next.js)" 3000; then
    echo "   ✅ Frontend: http://localhost:3000"
else
    echo "   ❌ Frontend: Failed to start"
fi

if check_service "Backend (Django)" 8000; then
    echo "   ✅ Backend API: http://localhost:8000"
else
    echo "   ❌ Backend API: Not running"
fi

if check_service "WebSocket" 8001; then
    echo "   ✅ WebSocket: ws://localhost:8001"
else
    echo "   ❌ WebSocket: Not running"
fi

if check_service "Redis" 6379; then
    echo "   ✅ Redis: localhost:6379"
else
    echo "   ❌ Redis: Not running"
fi

if check_service "PostgreSQL" 5432; then
    echo "   ✅ PostgreSQL: localhost:5432"
else
    echo "   ❌ PostgreSQL: Not running"
fi

echo ""
print_success "🎉 Prompt Optimization Platform is starting up!"
echo ""
echo "📋 Available URLs:"
echo "   🌐 Main App: http://localhost:3000"
echo "   🧠 Optimization: http://localhost:3000/optimization"
echo "   📚 Library: http://localhost:3000/library"
echo "   🔧 API Docs: http://localhost:8000/admin"
echo ""
print_status "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    
    # Kill all started processes
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        print_success "Frontend stopped"
    fi
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        print_success "Backend stopped"
    fi
    
    if [ ! -z "$WS_PID" ]; then
        kill $WS_PID 2>/dev/null
        print_success "WebSocket server stopped"
    fi
    
    if [ ! -z "$CELERY_PID" ]; then
        kill $CELERY_PID 2>/dev/null
        print_success "Celery worker stopped"
    fi
    
    print_success "All services stopped. Goodbye! 👋"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait

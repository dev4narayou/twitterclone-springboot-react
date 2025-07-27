#!/bin/bash

# Fix Frontend API Configuration Script
# This script updates the frontend to use the correct EC2 IP address

echo "🔧 Starting Frontend API Fix..."

# Get current IP
CURRENT_IP=$(curl -s http://checkip.amazonaws.com/)
echo "📍 Current EC2 IP: $CURRENT_IP"

# Stop containers
echo "🛑 Stopping containers..."
docker-compose down

# Pull latest code from repository
echo "📥 Pulling latest code..."
git pull origin main

# Update frontend .env file with current IP
echo "✏️ Updating frontend .env file..."
echo "VITE_API_BASE_URL=http://$CURRENT_IP:8081/api" > blogapp2-frontend/.env

# Update docker-compose.yml with current IP
echo "📝 Updating docker-compose.yml..."
sed -i "s|VITE_API_BASE_URL: http://.*:8081/api|VITE_API_BASE_URL: http://$CURRENT_IP:8081/api|g" docker-compose.yml

# Remove frontend images completely
echo "🗑️ Removing old frontend images..."
docker rmi blog-app_frontend 2>/dev/null || true
docker rmi $(docker images -q blog-app_frontend) 2>/dev/null || true

# Clean up
echo "🧹 Cleaning up..."
docker image prune -f
docker builder prune -f

# Rebuild frontend with correct environment
echo "🔨 Building frontend with correct API URL..."
docker-compose build --no-cache frontend

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Verify the fix
echo "🔍 Verifying the fix..."
echo "=== Checking frontend environment ==="
docker-compose exec frontend env | grep VITE_API_BASE_URL || echo "Environment variable not found"

echo "=== Checking built files for correct IP ==="
if docker-compose exec frontend grep -r "$CURRENT_IP" /usr/share/nginx/html/ >/dev/null 2>&1; then
    echo "✅ SUCCESS: Found correct IP ($CURRENT_IP) in built files!"
else
    echo "❌ PROBLEM: Correct IP not found in built files"
    echo "Checking for localhost references:"
    docker-compose exec frontend grep -r "localhost:808" /usr/share/nginx/html/ | head -3
fi

# Show container status
echo "=== Container Status ==="
docker-compose ps

# Show application URLs
echo ""
echo "🎉 Frontend API Fix Complete!"
echo "🌐 Application URLs:"
echo "   Frontend: http://$CURRENT_IP:3000"
echo "   Backend:  http://$CURRENT_IP:8081"
echo ""
echo "💡 Clear your browser cache and try accessing the application!"

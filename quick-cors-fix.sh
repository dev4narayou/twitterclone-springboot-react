#!/bin/bash

# Quick CORS Fix Script
echo "🌐 Fixing CORS Configuration..."

# Get current IP
CURRENT_IP=$(curl -s http://checkip.amazonaws.com/)
echo "📍 Current EC2 IP: $CURRENT_IP"

# Stop containers
echo "🛑 Stopping containers..."
docker-compose down

# Pull latest changes with CORS fix
echo "📥 Pulling latest code with CORS fix..."
git pull origin main

# Update CORS configuration
echo "🔧 Updating CORS configuration..."
sed -i "s|CORS_ORIGINS: http://localhost:3000,http://localhost:5173,http://localhost:5174|CORS_ORIGINS: http://$CURRENT_IP:3000,http://localhost:3000,http://localhost:5173,http://localhost:5174|g" docker-compose.yml

# Start only backend and postgres (frontend is already correct)
echo "🚀 Starting backend with new CORS configuration..."
docker-compose up -d postgres backend

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 20

# Check backend status
echo "🔍 Checking backend status..."
docker-compose ps backend
docker-compose logs --tail=5 backend

# Test CORS
echo "🌐 Testing CORS configuration..."
curl -v -H "Origin: http://$CURRENT_IP:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://$CURRENT_IP:8081/api/posts || echo "CORS test failed"

# Start frontend
echo "🚀 Starting frontend..."
docker-compose up -d frontend

echo ""
echo "🎉 CORS Fix Complete!"
echo "🌐 Application URLs:"
echo "   Frontend: http://$CURRENT_IP:3000"
echo "   Backend:  http://$CURRENT_IP:8081"
echo ""
echo "💡 Try accessing the frontend now - CORS should be fixed!"

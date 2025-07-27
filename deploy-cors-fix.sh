#!/bin/bash

echo "🚀 Deploying CORS Fix on EC2..."

# stop containers and clean up
echo "🛑 stopping containers..."
docker-compose down -v
docker system prune -f

# get current ip (should be 3.25.70.97 on ec2)
CURRENT_IP=$(curl -s http://checkip.amazonaws.com/)
echo "📍 detected ip: $CURRENT_IP"

# start database first
echo "🗄️ starting database..."
docker-compose up -d postgres

# wait for database
echo "⏳ waiting for database..."
sleep 15

# check database
echo "🔍 checking database status..."
docker-compose ps postgres
docker-compose logs --tail=5 postgres

# start backend
echo "🔧 starting backend with cors fix..."
docker-compose up -d backend

# wait for backend
echo "⏳ waiting for backend..."
sleep 20

# check backend thoroughly
echo "🔍 checking backend status..."
docker-compose ps backend
echo "📋 backend logs:"
docker-compose logs --tail=10 backend

# test backend connection
echo "🧪 testing backend connection..."
curl -f "http://localhost:8081/api/health" || echo "❌ backend health check failed"

# start frontend
echo "🌐 starting frontend..."
docker-compose up -d frontend

# final status check
echo "📊 final service status..."
docker-compose ps

echo ""
echo "🎉 deployment complete!"
echo "🌐 frontend: http://$CURRENT_IP:3000"
echo "🔌 backend: http://$CURRENT_IP:8081"
echo ""
echo "💡 cors is configured for: http://$CURRENT_IP:3000"
echo "🧪 test the app now!"

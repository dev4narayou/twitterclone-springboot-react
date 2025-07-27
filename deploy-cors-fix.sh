#!/bin/bash

echo "🚀 Deploying CORS Fix on EC2..."

# stop containers
echo "🛑 stopping containers..."
docker-compose down

# get current ip (should be 3.25.70.97 on ec2)
CURRENT_IP=$(curl -s http://checkip.amazonaws.com/)
echo "📍 detected ip: $CURRENT_IP"

# restart with new cors configuration
echo "🔧 starting services with updated cors..."
docker-compose up -d

# wait for services
echo "⏳ waiting for services to start..."
sleep 30

# check status
echo "📊 checking service status..."
docker-compose ps

echo ""
echo "🎉 deployment complete!"
echo "🌐 frontend: http://$CURRENT_IP:3000"
echo "🔌 backend: http://$CURRENT_IP:8081"
echo ""
echo "💡 cors is configured for: http://$CURRENT_IP:3000"
echo "🧪 test the app now!"

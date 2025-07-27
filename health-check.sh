#!/bin/bash
echo "=== TWITTER CLONE HEALTH CHECK ==="
echo ""

echo "1. Checking if deployment script completed..."
if sudo grep -q "Deployment complete" /var/log/cloud-init-output.log; then
    echo "✅ Deployment script completed successfully"
else
    echo "❌ Deployment script still running or failed"
    echo "   Check: sudo tail -f /var/log/cloud-init-output.log"
fi
echo ""

echo "2. Checking Docker service..."
if systemctl is-active --quiet docker; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running"
fi
echo ""

echo "3. Checking application directory..."
if [ -d "/home/ec2-user/blog-app" ] && [ -f "/home/ec2-user/blog-app/docker-compose.yml" ]; then
    echo "✅ Application directory and files exist"
else
    echo "❌ Application directory or docker-compose.yml missing"
fi
echo ""

echo "4. Checking containers..."
cd /home/ec2-user/blog-app 2>/dev/null || { echo "❌ Cannot access app directory"; exit 1; }

RUNNING_CONTAINERS=$(docker-compose ps --services --filter "status=running" | wc -l)
if [ "$RUNNING_CONTAINERS" -eq 3 ]; then
    echo "✅ All 3 containers are running"
    docker-compose ps
else
    echo "❌ Not all containers are running ($RUNNING_CONTAINERS/3)"
    docker-compose ps
fi
echo ""

echo "5. Checking ports..."
if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
    echo "✅ Frontend port 3000 is listening"
else
    echo "❌ Frontend port 3000 not listening"
fi

if netstat -tlnp 2>/dev/null | grep -q ":8081"; then
    echo "✅ Backend port 8081 is listening"
else
    echo "❌ Backend port 8081 not listening"
fi
echo ""

echo "6. Testing endpoints..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Frontend responding (port 3000)"
else
    echo "❌ Frontend not responding (port 3000)"
fi

if curl -s http://localhost:8081/api/auth/register 2>/dev/null | grep -q "errors"; then
    echo "✅ Backend API responding (port 8081)"
else
    echo "❌ Backend API not responding (port 8081)"
fi
echo ""

echo "7. Memory status..."
echo "$(free -h | head -2)"
echo "Swap: $(swapon --show --noheadings | awk '{print $3}' || echo 'No swap')"
echo ""

echo "=== HEALTH CHECK COMPLETE ==="
echo ""
echo "If everything shows ✅, your app should be available at:"
echo "http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"

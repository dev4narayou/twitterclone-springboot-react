#!/bin/bash

# EC2 Setup Script for Blog App Deployment
echo "Starting EC2 setup for Blog App..."

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install -y git

# Install curl for health checks
sudo yum install -y curl

# Create app directory
mkdir -p /home/ec2-user/blog-app
cd /home/ec2-user/blog-app

# Clone repository (replace with your GitHub URL)
echo "Ready to clone repository..."
echo "Run: git clone YOUR_GITHUB_REPO_URL ."

# Create environment file template
cat > .env << 'EOF'
# Production Environment Variables
DB_PASSWORD=your-secure-database-password-123
JWT_SECRET=your-very-long-and-random-jwt-secret-for-production-security-make-it-at-least-64-characters
CORS_ORIGINS=http://your-ec2-public-ip,https://your-domain-if-you-have-one
EOF

echo "Setup script completed!"
echo "Next steps:"
echo "1. Clone your repository"
echo "2. Update .env file with your values"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"

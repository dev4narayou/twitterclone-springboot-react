#!/bin/bash
set -e  # Exit on any error

# Update and install packages (Amazon Linux 2023 uses dnf)
dnf update -y
dnf install -y docker git curl

# Start Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /home/ec2-user/blog-app
cd /home/ec2-user/blog-app

# Clone your repository
git clone https://github.com/dev4narayou/twitterclone-springboot-react.git .

# Create production environment file
cat > .env << 'EOF'
DATABASE_URL=jdbc:postgresql://postgres:5432/blogapp
DB_USERNAME=postgres
DB_PASSWORD=production-secure-password-123
JWT_SECRET=your-super-long-jwt-secret-for-production-make-it-at-least-64-characters-long
LOG_LEVEL=INFO
CORS_ORIGINS=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000
EOF

# Build and start services
docker-compose up -d

echo "Deployment complete! App should be available on port 3000"

#!/bin/bash
yum update -y
yum install -y docker git curl

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

# Clone your repository (UPDATE THIS URL!)
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git .

# Create production environment file
cat > .env << 'EOF'
DB_PASSWORD=production-secure-password-123
JWT_SECRET=your-super-long-jwt-secret-for-production-make-it-at-least-64-characters-long
CORS_ORIGINS=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
EOF

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment complete! App should be available on port 80"

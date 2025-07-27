#!/bin/bash
set -e  # Exit on any error

# Update and install packages (Amazon Linux 2023 uses dnf)
dnf update -y
dnf install -y docker git curl

# Add swap memory for t2.micro (1GB RAM + 1GB swap = 2GB total)
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

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

# Clone your repository (clone into current directory)
git clone https://github.com/dev4narayou/twitterclone-springboot-react.git .

# Verify the files are there
ls -la

# Change ownership to ec2-user
chown -R ec2-user:ec2-user /home/ec2-user/blog-app

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
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Verify docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "ERROR: docker-compose.yml not found!"
    exit 1
fi

# Build and start services
docker-compose up -d

echo "Deployment complete! App should be available on port 3000"

#!/bin/bash
set -e  # Exit on any error

# Log everything
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Starting user data script at $(date)"

# Update and install packages (Amazon Linux 2023 uses dnf)
echo "Updating system packages..."
dnf update -y

echo "Installing docker and git..."
dnf install -y docker git

# Verify installations
echo "Verifying installations..."
docker --version
git --version

# Add swap memory for t2.micro (1GB RAM + 1GB swap = 2GB total)
echo "Setting up swap memory..."
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Start Docker
echo "Starting Docker service..."
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create app directory
echo "Creating application directory..."
mkdir -p /home/ec2-user/blog-app
cd /home/ec2-user/blog-app

# Clone your repository (clone into current directory)
echo "Cloning repository..."
git clone https://github.com/dev4narayou/twitterclone-springboot-react.git .

# Verify the files are there
ls -la

# Change ownership to ec2-user
chown -R ec2-user:ec2-user /home/ec2-user/blog-app

# Create production environment file
echo "Creating environment file..."
# Try multiple methods to get public IP
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || curl -s https://ipinfo.io/ip || curl -s https://api.ipify.org || echo "PLACEHOLDER_IP")
echo "Detected public IP: $PUBLIC_IP"

# Create backend .env file
cat > .env << EOF
DATABASE_URL=jdbc:postgresql://postgres:5432/blogapp
DB_USERNAME=postgres
DB_PASSWORD=production-secure-password-123
JWT_SECRET=your-super-long-jwt-secret-for-production-make-it-at-least-64-characters-long
LOG_LEVEL=INFO
CORS_ORIGINS=http://${PUBLIC_IP}:3000
EOF

# Create frontend .env file
cat > blogapp2-frontend/.env << EOF
VITE_API_BASE_URL=http://${PUBLIC_IP}:8081/api
EOF

echo "Created environment files with public IP: $PUBLIC_IP"

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
echo "Starting Docker containers..."
docker-compose up -d

echo "Deployment complete! App should be available on port 3000"
echo "User data script finished at $(date)"

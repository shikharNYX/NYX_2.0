#!/bin/bash

echo "Pulling latest code..."
cd /var/www/nyx-agentic-frontend
git remote set-url origin https://$GH_PERSONAL_ACCESS_TOKEN@github.com/tech-nyx/nyx-agentic-frontend.git
git pull origin dev

# Install dependencies
echo "installing dependencies"
npm install 

# Restart the app with PM2
echo "Restarting  the app with PM2"
pm2 restart fagents --log-date-format 'YYYY-MM-DD HH:mm:ss'
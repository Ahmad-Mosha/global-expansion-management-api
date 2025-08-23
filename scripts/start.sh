#!/bin/sh

echo "🚀 Starting application with automatic seeding..."

# Function to wait for service
wait_for_service() {
  local host=$1
  local port=$2
  local service=$3
  
  echo "⏳ Waiting for $service..."
  for i in $(seq 1 30); do
    if nc -z $host $port; then
      echo "✅ $service ready!"
      return 0
    fi
    sleep 1
  done
  echo "❌ $service failed to start"
  exit 1
}

# Wait for databases
wait_for_service mysql 3306 "MySQL"
wait_for_service mongodb 27017 "MongoDB"

# Quick database stabilization
sleep 2

# Run seeds quickly
echo "🌱 Seeding database..."
npm run seed

echo "🎯 Starting application..."
exec npm run start:dev
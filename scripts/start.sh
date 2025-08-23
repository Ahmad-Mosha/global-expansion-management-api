#!/bin/bash

echo "🚀 Starting application with automatic seeding..."

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
while ! nc -z mysql 3306; do
  sleep 1
done
echo "✅ MySQL is ready!"

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
while ! nc -z mongodb 27017; do
  sleep 1
done
echo "✅ MongoDB is ready!"

# Give databases a bit more time to fully initialize
sleep 5

# Run database seeds
echo "🌱 Running database seeds..."
npm run seed

# Start the application
echo "🎯 Starting NestJS application..."
npm run start:dev
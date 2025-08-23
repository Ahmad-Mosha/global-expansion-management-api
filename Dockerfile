FROM node:18-alpine

# Install netcat for database health checks
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Make start script executable
RUN chmod +x scripts/start.sh

EXPOSE 3000

CMD ["./scripts/start.sh"]
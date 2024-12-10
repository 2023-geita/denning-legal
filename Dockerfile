# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install PostgreSQL client and other dependencies
RUN apk add --no-cache postgresql-client dos2unix

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the start script and ensure proper line endings and permissions
COPY scripts/start.sh ./start.sh
RUN dos2unix ./start.sh && \
    chmod +x ./start.sh

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["./start.sh"] 
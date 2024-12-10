# Stage 1: Build dependencies
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client dos2unix

# Copy and install dependencies
COPY package*.json ./ 
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


# Stage 2: Production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client dos2unix

# Copy only the necessary build artifacts from the builder
COPY --from=builder /app ./

# Copy start script and ensure permissions
COPY scripts/start.sh ./start.sh
RUN dos2unix ./start.sh && \
    chmod +x ./start.sh

# Expose port and set start command
EXPOSE 3000
CMD ["./start.sh"]




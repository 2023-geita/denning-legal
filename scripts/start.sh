#!/bin/sh

# Maximum number of retries
MAX_RETRIES=30
RETRY_COUNT=0

echo "Waiting for database to be ready..."
while ! pg_isready -h postgres -p 5432 -U denning; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "Failed to connect to database after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "Attempt $RETRY_COUNT of $MAX_RETRIES: Database not ready yet... waiting"
    sleep 2
done

echo "Database is ready!"

echo "Running database migrations..."
if ! npx prisma db push; then
    echo "Failed to run database migrations"
    exit 1
fi

echo "Seeding database..."
if ! npx prisma db seed; then
    echo "Failed to seed database"
    exit 1
fi

echo "Starting application..."
exec npm start 
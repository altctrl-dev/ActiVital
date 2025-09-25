#!/bin/bash

# Exit on error
set -e

# Change to project root directory
cd "$(dirname "$0")/.."

echo "🚀 Starting development environment..."

# Activate virtual environment
if [ -d "backend/venv" ]; then
    source backend/venv/bin/activate
else
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Initialize database if it doesn't exist
if [ ! -f "backend/db/database.db" ]; then
    echo "🗄️  Initializing database..."
    python backend/db/init_db.py
fi

# Parse logs and compute statistics
echo "📊 Processing activity logs..."
python backend/parser/parse_logs.py
python backend/parser/transform.py

# Start Flask development server
echo "🌐 Starting Flask server..."
cd backend && flask run --debug
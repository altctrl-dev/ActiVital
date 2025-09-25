#!/bin/bash

# Exit on error
set -e

# Change to backend directory
cd "$(dirname "$0")/.."

# Activate virtual environment
source venv/bin/activate

# Run tests with coverage
echo "🧪 Running tests..."
python -m pytest tests/ -v --cov=. --cov-report=term-missing

# Run flake8 for code style
echo "🔍 Checking code style..."
flake8 . --exclude=venv/*

echo "✅ All tests completed!"
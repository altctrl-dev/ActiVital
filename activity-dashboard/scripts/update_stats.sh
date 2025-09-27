#!/bin/bash

# ActiVital Dashboard Statistics Update Script
# This script automates the process of updating activity statistics

# Set script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Change to backend directory
cd "$BACKEND_DIR"

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "❌ Failed to activate virtual environment"
    exit 1
fi

echo "✅ Virtual environment activated"

# Run the scheduler
echo "Starting statistics update..."
python scheduler/stats_scheduler.py "$@"

# Capture exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Statistics update completed successfully!"
else
    echo "❌ Statistics update failed with exit code $EXIT_CODE"
fi

exit $EXIT_CODE
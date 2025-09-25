#!/bin/bash

# Exit on error
set -e

# Change to backend directory
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Run database migrations
python -c "
from alembic import command
from alembic.config import Config

alembic_cfg = Config('alembic.ini')
command.upgrade(alembic_cfg, 'head')
"

echo "✅ Database migrations completed successfully!"
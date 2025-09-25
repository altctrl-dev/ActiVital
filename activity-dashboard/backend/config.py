import os
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', f'sqlite:///{BASE_DIR}/db/database.db')

# Logs directory
LOGS_DIR = os.getenv('LOGS_DIR', str(BASE_DIR.parent / 'logs'))

# Flask configuration
class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # SQLAlchemy settings
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS settings
    CORS_HEADERS = 'Content-Type'
    
    # Custom settings
    LOGS_DIRECTORY = LOGS_DIR
    LOG_FILE_PATTERN = 'Events__*.csv'  # Pattern to match log files
    
    # Time intervals (in minutes)
    IDLE_THRESHOLD = 15  # Consider user idle after 15 minutes of inactivity
    SESSION_TIMEOUT = 60  # End session after 60 minutes of inactivity
    
    # Scheduler settings
    SCHEDULER_HOUR = 2    # Hour to run the daily update (2 AM)
    SCHEDULER_MINUTE = 0  # Minute to run the daily update
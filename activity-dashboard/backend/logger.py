import logging
import os
from pathlib import Path
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
log_dir = Path(__file__).resolve().parent.parent / 'logs'
log_dir.mkdir(exist_ok=True)

# Configure logging
def setup_logger(name, log_file, level=logging.INFO):
    """Set up a logger with file and console handlers."""
    formatter = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # File handler with rotation
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(formatter)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    
    # Set up logger
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Application loggers
app_logger = setup_logger('app', log_dir / 'app.log')
parser_logger = setup_logger('parser', log_dir / 'parser.log')
db_logger = setup_logger('db', log_dir / 'db.log')
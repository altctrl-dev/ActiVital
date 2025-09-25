#!/usr/bin/env python3
import sys
import os
from pathlib import Path
import schedule
import time
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from logger import setup_logger
from parser.parse_logs import main as parse_logs
from parser.transform import update_all_stats
from config import Config

# Set up logger
logger = setup_logger('scheduler', Path(__file__).parent / 'scheduler.log')

def refresh_data():
    """Parse new logs and update statistics."""
    try:
        logger.info("Starting daily data refresh...")
        
        # Parse new log files
        logger.info("Parsing log files...")
        parse_logs()
        
        # Update statistics
        logger.info("Updating statistics...")
        update_all_stats()
        
        logger.info("Data refresh completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during data refresh: {str(e)}")

def main():
    """Main scheduler function."""
    logger.info("Starting activity dashboard scheduler...")
    
    # Schedule daily refresh
    schedule.every().day.at(f"{Config.SCHEDULER_HOUR:02d}:{Config.SCHEDULER_MINUTE:02d}").do(refresh_data)
    
    # Run refresh immediately on startup
    refresh_data()
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == '__main__':
    main()
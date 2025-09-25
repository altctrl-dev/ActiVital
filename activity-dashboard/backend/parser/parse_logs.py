import os
import glob
import pandas as pd
from datetime import datetime
import sys
from pathlib import Path

# Add parent directory to path to import from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from db.models import Event
from db.init_db import init_db

def parse_datetime(date_str):
    """Parse datetime from CSV format."""
    try:
        return pd.to_datetime(date_str)
    except ValueError:
        return None

def get_log_files():
    """Get all CSV log files from the configured logs directory."""
    logs_dir = Path(Config.LOGS_DIRECTORY)
    pattern = str(logs_dir / "**" / Config.LOG_FILE_PATTERN)
    return glob.glob(pattern, recursive=True)

def parse_log_file(file_path, session):
    """Parse a single log file and insert events into database."""
    try:
        print(f"Parsing file: {file_path}")
        
        # Read CSV file
        df = pd.read_csv(file_path)
        
        # Get username from parent directory name
        username = Path(file_path).parent.name
        
        # Process each row
        for _, row in df.iterrows():
            # Create Event object
            event = Event(
                timestamp=parse_datetime(row['Timestamp']),
                username=username,
                computer_name=row['Computer Name'],
                event_type=row['Event Type'],
                timezone=row.get('Timezone', 'UTC')  # Default to UTC if not provided
            )
            
            # Add to session
            session.add(event)
        
        # Commit after each file
        session.commit()
        print(f"Successfully parsed {file_path}")
        
    except Exception as e:
        print(f"Error parsing {file_path}: {str(e)}")
        session.rollback()

def main():
    """Main function to parse all log files."""
    # Initialize database session
    session = init_db()
    
    try:
        # Get all log files
        log_files = get_log_files()
        
        if not log_files:
            print("No log files found!")
            return
        
        print(f"Found {len(log_files)} log files to process")
        
        # Process each file
        for file_path in log_files:
            parse_log_file(file_path, session)
            
        print("Log parsing completed successfully!")
        
    except Exception as e:
        print(f"Error during log parsing: {str(e)}")
    finally:
        session.close()

if __name__ == '__main__':
    main()
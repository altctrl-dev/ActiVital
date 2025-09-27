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

def parse_datetime(date_str, time_str=None):
    """Parse datetime from CSV format - handles both combined and separate date/time."""
    try:
        if time_str is not None:
            # Handle separate Date and Time columns
            combined = f"{date_str} {time_str}"
            return pd.to_datetime(combined)
        else:
            # Handle combined Timestamp column
            return pd.to_datetime(date_str)
    except ValueError:
        return None

def normalize_event_type(event_type):
    """Normalize different event type formats to standard names."""
    event_mapping = {
        'Idle': 'Idle Started',
        'Active': 'Active',
        'Lock': 'Lock',
        'Unlock': 'Unlock',
        'Logon': 'Logon',
        'Logoff': 'Logoff',
        'Service Started': 'Service Started'
    }
    return event_mapping.get(event_type, event_type)

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

        # Clean column names (remove leading/trailing whitespace)
        df.columns = df.columns.str.strip()

        # Get username from parent directory name or from CSV data
        username = Path(file_path).parent.name

        # Detect CSV format and normalize column names
        columns = df.columns.tolist()
        print(f"CSV columns: {columns}")

        # Process each row
        for _, row in df.iterrows():
            # Handle different CSV formats
            if 'Timestamp' in columns:
                # Format 1: Combined timestamp
                timestamp = parse_datetime(row['Timestamp'])
                computer_name = row.get('Computer Name', 'Unknown')
                event_type = normalize_event_type(row.get('Event Type', 'Unknown'))
                timezone = row.get('Timezone', 'UTC')
                if 'Username' in columns:
                    username = row['Username']
            elif 'Date' in columns and 'Time' in columns:
                # Format 2: Separate date and time
                timestamp = parse_datetime(row['Date'], row['Time'])
                computer_name = row.get('Computer', 'Unknown')
                event_type = normalize_event_type(row.get('Event', 'Unknown'))
                timezone = row.get('TimeZone', 'UTC')
                if 'Username' in columns:
                    username = row['Username']
            else:
                print(f"Unknown CSV format in {file_path}")
                continue

            if timestamp is None:
                print(f"Invalid timestamp in row: {row}")
                continue

            # Create Event object
            event = Event(
                timestamp=timestamp,
                username=username,
                computer_name=computer_name,
                event_type=event_type,
                timezone=timezone
            )

            # Add to session
            session.add(event)

        # Commit after each file
        session.commit()
        print(f"Successfully parsed {file_path}")

    except Exception as e:
        print(f"Error parsing {file_path}: {str(e)}")
        import traceback
        traceback.print_exc()
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
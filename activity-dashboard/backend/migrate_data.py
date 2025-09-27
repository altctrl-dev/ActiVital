#!/usr/bin/env python3
"""
Migrate data from SQLite to PostgreSQL database.
"""

import sqlite3
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add the backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db.models import Event, DailyStats, WeeklyStats, MonthlyStats, Base
from config import BASE_DIR

def migrate_data():
    """Migrate data from SQLite to PostgreSQL."""
    # SQLite connection
    sqlite_path = BASE_DIR / 'db' / 'database.db'
    if not sqlite_path.exists():
        print(f"SQLite database not found at {sqlite_path}")
        return

    print(f"Migrating data from {sqlite_path}")

    # PostgreSQL connection
    pg_engine = create_engine('postgresql://localhost/activital_dashboard')
    Session = sessionmaker(bind=pg_engine)
    pg_session = Session()

    # SQLite connection
    sqlite_conn = sqlite3.connect(str(sqlite_path))
    sqlite_conn.row_factory = sqlite3.Row
    cursor = sqlite_conn.cursor()

    try:
        # Migrate Events table
        print("Migrating Events...")
        cursor.execute("SELECT * FROM events")
        events_data = cursor.fetchall()

        for row in events_data:
            event = Event(
                id=row['id'],
                username=row['username'],
                computer_name=row['computer_name'],
                timestamp=row['timestamp'],
                event_type=row['event_type'],
                timezone=row['timezone']
            )
            pg_session.merge(event)

        print(f"Migrated {len(events_data)} events")

        # Migrate DailyStats table
        print("Migrating DailyStats...")
        cursor.execute("SELECT * FROM daily_stats")
        daily_data = cursor.fetchall()

        for row in daily_data:
            stat = DailyStats(
                id=row['id'],
                username=row['username'],
                computer_name=row['computer_name'],
                date=row['date'],
                first_logon=row['first_logon'],
                last_activity=row['last_activity'],
                total_active_duration=row['total_active_duration'],
                total_idle_duration=row['total_idle_duration'],
                total_session_duration=row['total_session_duration']
            )
            pg_session.merge(stat)

        print(f"Migrated {len(daily_data)} daily stats")

        # Migrate WeeklyStats table
        print("Migrating WeeklyStats...")
        cursor.execute("SELECT * FROM weekly_stats")
        weekly_data = cursor.fetchall()

        for row in weekly_data:
            stat = WeeklyStats(
                id=row['id'],
                username=row['username'],
                computer_name=row['computer_name'],
                year=row['year'],
                week=row['week'],
                avg_daily_active_duration=row['avg_daily_active_duration'],
                total_active_duration=row['total_active_duration'],
                avg_session_duration=row['avg_session_duration'],
                productivity_score=row['productivity_score']
            )
            pg_session.merge(stat)

        print(f"Migrated {len(weekly_data)} weekly stats")

        # Migrate MonthlyStats table
        print("Migrating MonthlyStats...")
        cursor.execute("SELECT * FROM monthly_stats")
        monthly_data = cursor.fetchall()

        for row in monthly_data:
            stat = MonthlyStats(
                id=row['id'],
                username=row['username'],
                computer_name=row['computer_name'],
                year=row['year'],
                month=row['month'],
                avg_daily_active_duration=row['avg_daily_active_duration'],
                total_active_duration=row['total_active_duration'],
                avg_session_duration=row['avg_session_duration'],
                productivity_score=row['productivity_score'],
                total_days_active=row['total_days_active']
            )
            pg_session.merge(stat)

        print(f"Migrated {len(monthly_data)} monthly stats")

        # Commit all changes
        pg_session.commit()
        print("Migration completed successfully!")

        # Verify data
        print("\nVerifying data in PostgreSQL:")
        print(f"Events: {pg_session.query(Event).count()}")
        print(f"Daily Stats: {pg_session.query(DailyStats).count()}")
        print(f"Weekly Stats: {pg_session.query(WeeklyStats).count()}")
        print(f"Monthly Stats: {pg_session.query(MonthlyStats).count()}")

    except Exception as e:
        print(f"Error during migration: {e}")
        pg_session.rollback()
        return False
    finally:
        cursor.close()
        sqlite_conn.close()
        pg_session.close()

    return True

if __name__ == "__main__":
    success = migrate_data()
    sys.exit(0 if success else 1)
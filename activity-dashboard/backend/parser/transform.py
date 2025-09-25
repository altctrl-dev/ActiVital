import pandas as pd
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path to import from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from db.models import Event, DailyStats, WeeklyStats, MonthlyStats
from db.init_db import init_db

def compute_daily_stats(session, date):
    """Compute daily statistics for all users for a given date."""
    # Get all events for the date
    events_query = session.query(Event).filter(
        Event.timestamp >= date,
        Event.timestamp < date + timedelta(days=1)
    ).order_by(Event.timestamp)
    
    # Group events by user and computer
    events_df = pd.read_sql(events_query.statement, session.bind)
    if events_df.empty:
        return
    
    # Group by user and computer
    for (username, computer_name), user_events in events_df.groupby(['username', 'computer_name']):
        # Calculate metrics
        first_logon = user_events.timestamp.min()
        last_activity = user_events.timestamp.max()
        
        # Calculate active and idle durations
        total_active = 0
        total_idle = 0
        last_event = None
        
        for _, event in user_events.iterrows():
            if last_event is not None:
                duration = (event.timestamp - last_event.timestamp).total_seconds() / 60
                
                if duration <= Config.IDLE_THRESHOLD:
                    total_active += duration
                else:
                    total_idle += duration
                    
            last_event = event
        
        # Create daily stats record
        daily_stats = DailyStats(
            date=date.date(),
            username=username,
            computer_name=computer_name,
            first_logon=first_logon,
            last_activity=last_activity,
            total_active_duration=total_active,
            total_idle_duration=total_idle,
            total_session_duration=total_active + total_idle
        )
        
        session.add(daily_stats)

def compute_weekly_stats(session, year, week):
    """Compute weekly statistics for all users for a given year and week."""
    # Get daily stats for the week
    daily_stats_query = session.query(DailyStats).filter(
        # TODO: Add proper week filtering based on date
    )
    
    daily_stats_df = pd.read_sql(daily_stats_query.statement, session.bind)
    if daily_stats_df.empty:
        return
    
    # Group by user and computer
    for (username, computer_name), user_stats in daily_stats_df.groupby(['username', 'computer_name']):
        # Calculate metrics
        avg_daily_active = user_stats.total_active_duration.mean()
        total_active = user_stats.total_active_duration.sum()
        avg_session = user_stats.total_session_duration.mean()
        
        # Calculate productivity score (active time / session time)
        productivity = (total_active / user_stats.total_session_duration.sum()) * 100
        
        # Create weekly stats record
        weekly_stats = WeeklyStats(
            year=year,
            week=week,
            username=username,
            computer_name=computer_name,
            avg_daily_active_duration=avg_daily_active,
            total_active_duration=total_active,
            avg_session_duration=avg_session,
            productivity_score=productivity
        )
        
        session.add(weekly_stats)

def compute_monthly_stats(session, year, month):
    """Compute monthly statistics for all users for a given year and month."""
    # Get daily stats for the month
    daily_stats_query = session.query(DailyStats).filter(
        # TODO: Add proper month filtering based on date
    )
    
    daily_stats_df = pd.read_sql(daily_stats_query.statement, session.bind)
    if daily_stats_df.empty:
        return
    
    # Group by user and computer
    for (username, computer_name), user_stats in daily_stats_df.groupby(['username', 'computer_name']):
        # Calculate metrics
        avg_daily_active = user_stats.total_active_duration.mean()
        total_active = user_stats.total_active_duration.sum()
        avg_session = user_stats.total_session_duration.mean()
        total_days = len(user_stats)
        
        # Calculate productivity score (active time / session time)
        productivity = (total_active / user_stats.total_session_duration.sum()) * 100
        
        # Create monthly stats record
        monthly_stats = MonthlyStats(
            year=year,
            month=month,
            username=username,
            computer_name=computer_name,
            avg_daily_active_duration=avg_daily_active,
            total_active_duration=total_active,
            avg_session_duration=avg_session,
            productivity_score=productivity,
            total_days_active=total_days
        )
        
        session.add(monthly_stats)

def update_all_stats():
    """Update all statistics tables."""
    session = init_db()
    
    try:
        # Get date range from events
        min_date = session.query(Event.timestamp.min()).scalar()
        max_date = session.query(Event.timestamp.max()).scalar()
        
        if not (min_date and max_date):
            print("No events found in database!")
            return
        
        current_date = min_date.date()
        end_date = max_date.date()
        
        # Process each day
        while current_date <= end_date:
            print(f"Processing date: {current_date}")
            compute_daily_stats(session, current_date)
            
            # Update weekly stats if it's the end of the week
            if current_date.weekday() == 6:
                year = current_date.year
                week = current_date.isocalendar()[1]
                compute_weekly_stats(session, year, week)
            
            # Update monthly stats if it's the end of the month
            if (current_date + timedelta(days=1)).day == 1:
                compute_monthly_stats(session, current_date.year, current_date.month)
            
            current_date += timedelta(days=1)
            session.commit()
        
        print("Statistics update completed successfully!")
        
    except Exception as e:
        print(f"Error updating statistics: {str(e)}")
        session.rollback()
    finally:
        session.close()

if __name__ == '__main__':
    update_all_stats()
import pandas as pd
from datetime import datetime, timedelta
import sys
import os
from sqlalchemy import and_, extract

# Add parent directory to path to import from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from flask_models import db, Event, DailyStats, WeeklyStats, MonthlyStats
from db.init_db import init_db

def compute_daily_stats(session, target_date):
    """Compute daily statistics for all users for a given date."""
    # Remove existing stats for this date to avoid duplicates
    session.query(DailyStats).filter(DailyStats.date == target_date).delete()

    # Get all events for the date
    start_datetime = datetime.combine(target_date, datetime.min.time())
    end_datetime = start_datetime + timedelta(days=1)

    events = session.query(Event).filter(
        and_(
            Event.timestamp >= start_datetime,
            Event.timestamp < end_datetime
        )
    ).order_by(Event.timestamp).all()

    if not events:
        return

    # Convert to DataFrame for easier processing
    events_data = []
    for event in events:
        events_data.append({
            'timestamp': event.timestamp,
            'username': event.username,
            'computer_name': event.computer_name,
            'event_type': event.event_type
        })

    events_df = pd.DataFrame(events_data)

    # Group by user and computer
    for (username, computer_name), user_events in events_df.groupby(['username', 'computer_name']):
        user_events = user_events.sort_values('timestamp')

        # Calculate metrics
        first_logon = None
        last_activity = None
        total_active = 0
        total_idle = 0

        # Find first logon and last activity
        logon_events = user_events[user_events['event_type'] == 'Logon']
        if not logon_events.empty:
            first_logon = logon_events.iloc[0]['timestamp']

        last_activity = user_events.iloc[-1]['timestamp']

        # Calculate durations based on event transitions
        previous_timestamp = None
        previous_event_type = None

        for _, event in user_events.iterrows():
            if previous_timestamp is not None:
                duration_minutes = (event['timestamp'] - previous_timestamp).total_seconds() / 60

                # If previous event was Active and current is Idle, count as active time
                if previous_event_type == 'Active' and event['event_type'] == 'Idle Started':
                    total_active += duration_minutes
                elif previous_event_type == 'Idle Started' and event['event_type'] == 'Active':
                    total_idle += duration_minutes
                elif previous_event_type == 'Active' and event['event_type'] == 'Logoff':
                    total_active += duration_minutes

            previous_timestamp = event['timestamp']
            previous_event_type = event['event_type']

        total_session = total_active + total_idle

        # Create daily stats record
        daily_stats = DailyStats(
            date=target_date,
            username=username,
            computer_name=computer_name,
            first_logon=first_logon,
            last_activity=last_activity,
            total_active_duration=total_active,
            total_idle_duration=total_idle,
            total_session_duration=total_session
        )

        session.add(daily_stats)

def compute_weekly_stats(session, year, week):
    """Compute weekly statistics for all users for a given year and week."""
    # Remove existing stats for this week to avoid duplicates
    session.query(WeeklyStats).filter(
        and_(WeeklyStats.year == year, WeeklyStats.week == week)
    ).delete()

    # Get the date range for the week
    first_day_of_year = datetime(year, 1, 1)
    week_start = first_day_of_year + timedelta(weeks=week-1, days=-first_day_of_year.weekday())
    week_end = week_start + timedelta(days=6)

    # Get daily stats for the week
    daily_stats = session.query(DailyStats).filter(
        and_(
            DailyStats.date >= week_start.date(),
            DailyStats.date <= week_end.date()
        )
    ).all()

    if not daily_stats:
        return

    # Convert to DataFrame for easier processing
    stats_data = []
    for stat in daily_stats:
        stats_data.append({
            'username': stat.username,
            'computer_name': stat.computer_name,
            'total_active_duration': stat.total_active_duration or 0,
            'total_session_duration': stat.total_session_duration or 0
        })

    stats_df = pd.DataFrame(stats_data)

    # Group by user and computer
    for (username, computer_name), user_stats in stats_df.groupby(['username', 'computer_name']):
        # Calculate metrics
        avg_daily_active = user_stats['total_active_duration'].mean()
        total_active = user_stats['total_active_duration'].sum()
        avg_session = user_stats['total_session_duration'].mean()
        total_session = user_stats['total_session_duration'].sum()

        # Calculate productivity score (active time / session time)
        productivity = (total_active / total_session * 100) if total_session > 0 else 0

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
    # Remove existing stats for this month to avoid duplicates
    session.query(MonthlyStats).filter(
        and_(MonthlyStats.year == year, MonthlyStats.month == month)
    ).delete()

    # Get daily stats for the month
    daily_stats = session.query(DailyStats).filter(
        and_(
            extract('year', DailyStats.date) == year,
            extract('month', DailyStats.date) == month
        )
    ).all()

    if not daily_stats:
        return

    # Convert to DataFrame for easier processing
    stats_data = []
    for stat in daily_stats:
        stats_data.append({
            'username': stat.username,
            'computer_name': stat.computer_name,
            'total_active_duration': stat.total_active_duration or 0,
            'total_session_duration': stat.total_session_duration or 0
        })

    stats_df = pd.DataFrame(stats_data)

    # Group by user and computer
    for (username, computer_name), user_stats in stats_df.groupby(['username', 'computer_name']):
        # Calculate metrics
        avg_daily_active = user_stats['total_active_duration'].mean()
        total_active = user_stats['total_active_duration'].sum()
        avg_session = user_stats['total_session_duration'].mean()
        total_session = user_stats['total_session_duration'].sum()
        total_days = len(user_stats)

        # Calculate productivity score (active time / session time)
        productivity = (total_active / total_session * 100) if total_session > 0 else 0

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
        result = session.query(Event.timestamp).order_by(Event.timestamp).first()
        if not result:
            print("No events found in database!")
            return

        min_date = session.query(Event.timestamp).order_by(Event.timestamp).first()[0]
        max_date = session.query(Event.timestamp).order_by(Event.timestamp.desc()).first()[0]

        print(f"Processing events from {min_date.date()} to {max_date.date()}")

        current_date = min_date.date()
        end_date = max_date.date()

        processed_weeks = set()
        processed_months = set()

        # Process each day
        while current_date <= end_date:
            print(f"Processing daily stats for: {current_date}")
            compute_daily_stats(session, current_date)

            # Calculate weekly stats for this week
            year = current_date.year
            week = current_date.isocalendar()[1]
            week_key = (year, week)

            if week_key not in processed_weeks:
                print(f"Processing weekly stats for: {year}-W{week:02d}")
                compute_weekly_stats(session, year, week)
                processed_weeks.add(week_key)

            # Calculate monthly stats for this month
            month_key = (current_date.year, current_date.month)
            if month_key not in processed_months:
                print(f"Processing monthly stats for: {current_date.year}-{current_date.month:02d}")
                compute_monthly_stats(session, current_date.year, current_date.month)
                processed_months.add(month_key)

            current_date += timedelta(days=1)

        session.commit()
        print("Statistics update completed successfully!")

    except Exception as e:
        print(f"Error updating statistics: {str(e)}")
        import traceback
        traceback.print_exc()
        session.rollback()
    finally:
        session.close()

if __name__ == '__main__':
    update_all_stats()
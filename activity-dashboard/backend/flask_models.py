from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# This will be imported in app.py
db = SQLAlchemy()

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    computer_name = db.Column(db.String(100), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)  # Logon, Logoff, Idle Started, Active
    timezone = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<Event(username='{self.username}', type='{self.event_type}', timestamp='{self.timestamp}')>"


class DailyStats(db.Model):
    __tablename__ = 'daily_stats'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    computer_name = db.Column(db.String(100), nullable=False)
    shift = db.Column(db.String(50))  # Morning, Evening, Night (optional)
    first_logon = db.Column(db.DateTime)
    last_activity = db.Column(db.DateTime)
    total_active_duration = db.Column(db.Float)  # Duration in minutes
    total_idle_duration = db.Column(db.Float)    # Duration in minutes
    total_session_duration = db.Column(db.Float) # Duration in minutes

    def __repr__(self):
        return f"<DailyStats(username='{self.username}', date='{self.date}')>"


class WeeklyStats(db.Model):
    __tablename__ = 'weekly_stats'

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, nullable=False)
    week = db.Column(db.Integer, nullable=False)  # Week number (1-53)
    username = db.Column(db.String(100), nullable=False)
    computer_name = db.Column(db.String(100), nullable=False)
    avg_daily_active_duration = db.Column(db.Float)    # Average duration in minutes
    total_active_duration = db.Column(db.Float)        # Total duration in minutes
    avg_session_duration = db.Column(db.Float)         # Average duration in minutes
    productivity_score = db.Column(db.Float)           # Percentage (0-100)

    def __repr__(self):
        return f"<WeeklyStats(username='{self.username}', year={self.year}, week={self.week})>"


class MonthlyStats(db.Model):
    __tablename__ = 'monthly_stats'

    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)  # Month number (1-12)
    username = db.Column(db.String(100), nullable=False)
    computer_name = db.Column(db.String(100), nullable=False)
    avg_daily_active_duration = db.Column(db.Float)    # Average duration in minutes
    total_active_duration = db.Column(db.Float)        # Total duration in minutes
    avg_session_duration = db.Column(db.Float)         # Average duration in minutes
    productivity_score = db.Column(db.Float)           # Percentage (0-100)
    total_days_active = db.Column(db.Integer)          # Number of days with activity

    def __repr__(self):
        return f"<MonthlyStats(username='{self.username}', year={self.year}, month={self.month})>"
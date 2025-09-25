from sqlalchemy import Column, Integer, String, DateTime, Float, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, nullable=False)
    username = Column(String(100), nullable=False)
    computer_name = Column(String(100), nullable=False)
    event_type = Column(String(50), nullable=False)  # Logon, Logoff, Idle Started, Active
    timezone = Column(String(50), nullable=False)

    def __repr__(self):
        return f"<Event(username='{self.username}', type='{self.event_type}', timestamp='{self.timestamp}')>"


class DailyStats(Base):
    __tablename__ = 'daily_stats'

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    username = Column(String(100), nullable=False)
    computer_name = Column(String(100), nullable=False)
    shift = Column(String(50))  # Morning, Evening, Night (optional)
    first_logon = Column(DateTime)
    last_activity = Column(DateTime)
    total_active_duration = Column(Float)  # Duration in minutes
    total_idle_duration = Column(Float)    # Duration in minutes
    total_session_duration = Column(Float) # Duration in minutes

    def __repr__(self):
        return f"<DailyStats(username='{self.username}', date='{self.date}')>"


class WeeklyStats(Base):
    __tablename__ = 'weekly_stats'

    id = Column(Integer, primary_key=True)
    year = Column(Integer, nullable=False)
    week = Column(Integer, nullable=False)  # Week number (1-53)
    username = Column(String(100), nullable=False)
    computer_name = Column(String(100), nullable=False)
    avg_daily_active_duration = Column(Float)    # Average duration in minutes
    total_active_duration = Column(Float)        # Total duration in minutes
    avg_session_duration = Column(Float)         # Average duration in minutes
    productivity_score = Column(Float)           # Percentage (0-100)

    def __repr__(self):
        return f"<WeeklyStats(username='{self.username}', year={self.year}, week={self.week})>"


class MonthlyStats(Base):
    __tablename__ = 'monthly_stats'

    id = Column(Integer, primary_key=True)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)  # Month number (1-12)
    username = Column(String(100), nullable=False)
    computer_name = Column(String(100), nullable=False)
    avg_daily_active_duration = Column(Float)    # Average duration in minutes
    total_active_duration = Column(Float)        # Total duration in minutes
    avg_session_duration = Column(Float)         # Average duration in minutes
    productivity_score = Column(Float)           # Percentage (0-100)
    total_days_active = Column(Integer)          # Number of days with activity

    def __repr__(self):
        return f"<MonthlyStats(username='{self.username}', year={self.year}, month={self.month})>"
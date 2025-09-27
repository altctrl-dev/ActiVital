from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from sqlalchemy import func, and_, or_, desc

from config import Config
from validators import validate_params, validate_date, validate_week, validate_month, sanitize_username
from logger import app_logger as logger

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize CORS
CORS(app)

# Import and initialize models after app creation
from flask_models import db, Event, DailyStats, WeeklyStats, MonthlyStats
db.init_app(app)

@app.route('/users', methods=['GET'])
def get_users():
    """Get list of all users."""
    try:
        users = db.session.query(Event.username).distinct().all()
        return jsonify({
            'users': [user[0] for user in users]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats/daily', methods=['GET'])
@validate_params('user', 'date')
def get_daily_stats():
    """Get daily statistics for a user."""
    try:
        username = sanitize_username(request.args.get('user'))
        date_str = request.args.get('date')
        
        if not validate_date(date_str):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        stats = DailyStats.query.filter_by(
            username=username,
            date=date
        ).first()
        
        if not stats:
            return jsonify({'error': 'No data found'}), 404
        
        return jsonify({
            'date': date.isoformat(),
            'username': stats.username,
            'computer_name': stats.computer_name,
            'first_logon': stats.first_logon.isoformat() if stats.first_logon else None,
            'last_activity': stats.last_activity.isoformat() if stats.last_activity else None,
            'total_active_duration': stats.total_active_duration,
            'total_idle_duration': stats.total_idle_duration,
            'total_session_duration': stats.total_session_duration
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats/weekly', methods=['GET'])
@validate_params('user', 'week')
def get_weekly_stats():
    """Get weekly statistics for a user."""
    try:
        username = sanitize_username(request.args.get('user'))
        week_str = request.args.get('week')  # Format: 2025-W33
        
        if not validate_week(week_str):
            return jsonify({'error': 'Invalid week format. Use YYYY-Wnn (e.g., 2025-W33)'}), 400
        
        year = int(week_str.split('-')[0])
        week = int(week_str.split('W')[1])
        
        stats = WeeklyStats.query.filter_by(
            username=username,
            year=year,
            week=week
        ).first()
        
        if not stats:
            return jsonify({'error': 'No data found'}), 404
        
        return jsonify({
            'year': stats.year,
            'week': stats.week,
            'username': stats.username,
            'computer_name': stats.computer_name,
            'avg_daily_active_duration': stats.avg_daily_active_duration,
            'total_active_duration': stats.total_active_duration,
            'avg_session_duration': stats.avg_session_duration,
            'productivity_score': stats.productivity_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats/monthly', methods=['GET'])
@validate_params('user', 'month')
def get_monthly_stats():
    """Get monthly statistics for a user."""
    try:
        username = sanitize_username(request.args.get('user'))
        month_str = request.args.get('month')  # Format: 2025-08
        
        if not validate_month(month_str):
            return jsonify({'error': 'Invalid month format. Use YYYY-MM'}), 400
        
        year = int(month_str.split('-')[0])
        month = int(month_str.split('-')[1])
        
        stats = MonthlyStats.query.filter_by(
            username=username,
            year=year,
            month=month
        ).first()
        
        if not stats:
            return jsonify({'error': 'No data found'}), 404
        
        return jsonify({
            'year': stats.year,
            'month': stats.month,
            'username': stats.username,
            'computer_name': stats.computer_name,
            'avg_daily_active_duration': stats.avg_daily_active_duration,
            'total_active_duration': stats.total_active_duration,
            'avg_session_duration': stats.avg_session_duration,
            'productivity_score': stats.productivity_score,
            'total_days_active': stats.total_days_active
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Advanced Analytics Endpoints

@app.route('/analytics/timeline', methods=['GET'])
@validate_params('user', 'date')
def get_activity_timeline():
    """Get detailed activity timeline for a user on a specific date."""
    try:
        username = sanitize_username(request.args.get('user'))
        date_str = request.args.get('date')

        if not validate_date(date_str):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        start_datetime = datetime.combine(date, datetime.min.time())
        end_datetime = datetime.combine(date, datetime.max.time())

        events = Event.query.filter(
            and_(
                Event.username == username,
                Event.timestamp >= start_datetime,
                Event.timestamp <= end_datetime
            )
        ).order_by(Event.timestamp).all()

        timeline = []
        for event in events:
            timeline.append({
                'timestamp': event.timestamp.isoformat(),
                'event_type': event.event_type,
                'computer_name': event.computer_name,
                'hour': event.timestamp.hour,
                'minute': event.timestamp.minute
            })

        return jsonify({
            'date': date_str,
            'username': username,
            'timeline': timeline,
            'event_count': len(timeline)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics/team-summary', methods=['GET'])
def get_team_summary():
    """Get team-wide productivity summary."""
    try:
        date_str = request.args.get('date')
        if date_str and not validate_date(date_str):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        # If no date provided, use most recent date with data
        if not date_str:
            latest_stat = DailyStats.query.order_by(desc(DailyStats.date)).first()
            if not latest_stat:
                return jsonify({'error': 'No data available'}), 404
            date = latest_stat.date
        else:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()

        # Get all daily stats for the date
        daily_stats = DailyStats.query.filter_by(date=date).all()

        if not daily_stats:
            return jsonify({'error': 'No data found for this date'}), 404

        team_data = []
        total_active = 0
        total_session = 0

        for stat in daily_stats:
            productivity = 0
            if stat.total_session_duration and stat.total_session_duration > 0:
                productivity = (stat.total_active_duration / stat.total_session_duration) * 100

            team_data.append({
                'username': stat.username,
                'computer_name': stat.computer_name,
                'total_active_duration': stat.total_active_duration,
                'total_idle_duration': stat.total_idle_duration,
                'total_session_duration': stat.total_session_duration,
                'productivity_score': round(productivity, 2),
                'first_logon': stat.first_logon.isoformat() if stat.first_logon else None,
                'last_activity': stat.last_activity.isoformat() if stat.last_activity else None
            })

            total_active += stat.total_active_duration or 0
            total_session += stat.total_session_duration or 0

        # Calculate team averages
        team_productivity = (total_active / total_session * 100) if total_session > 0 else 0
        avg_active = total_active / len(daily_stats) if daily_stats else 0
        avg_session = total_session / len(daily_stats) if daily_stats else 0

        return jsonify({
            'date': date.isoformat(),
            'team_stats': team_data,
            'summary': {
                'total_users': len(daily_stats),
                'team_productivity_score': round(team_productivity, 2),
                'avg_active_duration': round(avg_active, 2),
                'avg_session_duration': round(avg_session, 2),
                'total_active_duration': round(total_active, 2),
                'total_session_duration': round(total_session, 2)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics/productivity-trends', methods=['GET'])
@validate_params('user')
def get_productivity_trends():
    """Get productivity trends for a user over time."""
    try:
        username = sanitize_username(request.args.get('user'))
        days = int(request.args.get('days', 30))  # Default to 30 days

        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)

        daily_stats = DailyStats.query.filter(
            and_(
                DailyStats.username == username,
                DailyStats.date >= start_date,
                DailyStats.date <= end_date
            )
        ).order_by(DailyStats.date).all()

        trends = []
        for stat in daily_stats:
            productivity = 0
            if stat.total_session_duration and stat.total_session_duration > 0:
                productivity = (stat.total_active_duration / stat.total_session_duration) * 100

            trends.append({
                'date': stat.date.isoformat(),
                'active_duration': stat.total_active_duration,
                'idle_duration': stat.total_idle_duration,
                'session_duration': stat.total_session_duration,
                'productivity_score': round(productivity, 2)
            })

        return jsonify({
            'username': username,
            'date_range': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat(),
                'days': days
            },
            'trends': trends
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics/activity-heatmap', methods=['GET'])
@validate_params('user', 'date')
def get_activity_heatmap():
    """Get hourly activity intensity for heatmap visualization."""
    try:
        username = sanitize_username(request.args.get('user'))
        date_str = request.args.get('date')

        if not validate_date(date_str):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        start_datetime = datetime.combine(date, datetime.min.time())
        end_datetime = datetime.combine(date, datetime.max.time())

        events = Event.query.filter(
            and_(
                Event.username == username,
                Event.timestamp >= start_datetime,
                Event.timestamp <= end_datetime
            )
        ).order_by(Event.timestamp).all()

        # Initialize hourly activity map
        hourly_activity = {str(hour): 0 for hour in range(24)}

        # Process events to calculate activity intensity
        for i, event in enumerate(events):
            hour = str(event.timestamp.hour)

            # Increase activity score based on event type
            if event.event_type in ['Active', 'Logon', 'Unlock']:
                hourly_activity[hour] += 3
            elif event.event_type in ['Idle Started', 'Lock']:
                hourly_activity[hour] += 1
            else:
                hourly_activity[hour] += 2

        # Convert to percentage scale
        max_activity = max(hourly_activity.values()) if hourly_activity.values() else 1
        for hour in hourly_activity:
            if max_activity > 0:
                hourly_activity[hour] = round((hourly_activity[hour] / max_activity) * 100, 2)

        return jsonify({
            'date': date_str,
            'username': username,
            'heatmap_data': hourly_activity,
            'peak_hour': max(hourly_activity.keys(), key=lambda k: hourly_activity[k])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics/break-patterns', methods=['GET'])
@validate_params('user', 'date')
def get_break_patterns():
    """Analyze break patterns and idle time distribution."""
    try:
        username = sanitize_username(request.args.get('user'))
        date_str = request.args.get('date')

        if not validate_date(date_str):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        start_datetime = datetime.combine(date, datetime.min.time())
        end_datetime = datetime.combine(date, datetime.max.time())

        events = Event.query.filter(
            and_(
                Event.username == username,
                Event.timestamp >= start_datetime,
                Event.timestamp <= end_datetime
            )
        ).order_by(Event.timestamp).all()

        breaks = []
        idle_periods = []
        current_idle_start = None

        for i, event in enumerate(events):
            if event.event_type in ['Idle Started', 'Lock']:
                current_idle_start = event.timestamp
            elif event.event_type in ['Active', 'Unlock'] and current_idle_start:
                # Calculate idle duration
                idle_duration = (event.timestamp - current_idle_start).total_seconds() / 60

                break_info = {
                    'start_time': current_idle_start.strftime('%H:%M'),
                    'end_time': event.timestamp.strftime('%H:%M'),
                    'duration_minutes': round(idle_duration, 1),
                    'type': 'short_break' if idle_duration <= 15 else 'long_break' if idle_duration <= 60 else 'extended_break'
                }

                breaks.append(break_info)
                idle_periods.append(idle_duration)
                current_idle_start = None

        # Calculate break statistics
        total_breaks = len(breaks)
        avg_break_duration = sum(idle_periods) / len(idle_periods) if idle_periods else 0
        short_breaks = len([b for b in breaks if b['type'] == 'short_break'])
        long_breaks = len([b for b in breaks if b['type'] == 'long_break'])
        extended_breaks = len([b for b in breaks if b['type'] == 'extended_break'])

        return jsonify({
            'date': date_str,
            'username': username,
            'break_analysis': {
                'total_breaks': total_breaks,
                'avg_break_duration': round(avg_break_duration, 1),
                'break_distribution': {
                    'short_breaks': short_breaks,  # <= 15 min
                    'long_breaks': long_breaks,    # 15-60 min
                    'extended_breaks': extended_breaks  # > 60 min
                }
            },
            'break_details': breaks
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics/focus-score', methods=['GET'])
@validate_params('user', 'date')
def get_focus_score():
    """Calculate focus score based on sustained active periods."""
    try:
        username = sanitize_username(request.args.get('user'))
        date_str = request.args.get('date')

        if not validate_date(date_str):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        start_datetime = datetime.combine(date, datetime.min.time())
        end_datetime = datetime.combine(date, datetime.max.time())

        events = Event.query.filter(
            and_(
                Event.username == username,
                Event.timestamp >= start_datetime,
                Event.timestamp <= end_datetime
            )
        ).order_by(Event.timestamp).all()

        focus_sessions = []
        current_session_start = None
        interruptions = 0

        for event in events:
            if event.event_type == 'Active':
                if not current_session_start:
                    current_session_start = event.timestamp
            elif event.event_type in ['Idle Started', 'Lock'] and current_session_start:
                # End of focus session
                session_duration = (event.timestamp - current_session_start).total_seconds() / 60

                if session_duration >= 5:  # Only count sessions >= 5 minutes
                    focus_sessions.append({
                        'start': current_session_start.strftime('%H:%M'),
                        'duration': round(session_duration, 1),
                        'quality': 'excellent' if session_duration >= 60 else 'good' if session_duration >= 30 else 'fair'
                    })

                current_session_start = None
                interruptions += 1

        # Calculate focus metrics
        total_focus_time = sum([s['duration'] for s in focus_sessions])
        avg_session_length = total_focus_time / len(focus_sessions) if focus_sessions else 0
        longest_session = max([s['duration'] for s in focus_sessions], default=0)

        # Focus score calculation (0-100)
        base_score = min(total_focus_time / 480 * 70, 70)  # Up to 70 points for 8 hours of focus
        session_quality_score = min(avg_session_length / 60 * 20, 20)  # Up to 20 points for long sessions
        consistency_score = min(len(focus_sessions) / 8 * 10, 10)  # Up to 10 points for consistent sessions

        focus_score = round(base_score + session_quality_score + consistency_score, 1)

        return jsonify({
            'date': date_str,
            'username': username,
            'focus_metrics': {
                'focus_score': focus_score,
                'total_focus_time': round(total_focus_time, 1),
                'avg_session_length': round(avg_session_length, 1),
                'longest_session': round(longest_session, 1),
                'focus_sessions_count': len(focus_sessions),
                'interruptions': interruptions
            },
            'focus_sessions': focus_sessions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
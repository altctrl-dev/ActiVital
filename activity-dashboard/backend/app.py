from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os

from config import Config
from db.models import Event, DailyStats, WeeklyStats, MonthlyStats
from validators import validate_params, validate_date, validate_week, validate_month, sanitize_username
from logger import app_logger as logger

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize CORS
CORS(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

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

if __name__ == '__main__':
    app.run(debug=True)
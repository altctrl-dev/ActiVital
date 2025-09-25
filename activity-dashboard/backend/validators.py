from functools import wraps
from flask import request, jsonify
from datetime import datetime
import re

def validate_params(*required_params):
    """Decorator to validate required request parameters."""
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            missing = [p for p in required_params if not request.args.get(p)]
            if missing:
                return jsonify({
                    'error': f'Missing required parameters: {", ".join(missing)}'
                }), 400
            return f(*args, **kwargs)
        return wrapped
    return decorator

def validate_date(date_str):
    """Validate date string format (YYYY-MM-DD)."""
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

def validate_week(week_str):
    """Validate week string format (YYYY-Wnn)."""
    pattern = r'^\d{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$'
    return bool(re.match(pattern, week_str))

def validate_month(month_str):
    """Validate month string format (YYYY-MM)."""
    try:
        datetime.strptime(month_str, '%Y-%m')
        return True
    except ValueError:
        return False

def sanitize_username(username):
    """Sanitize username input."""
    # Remove any special characters except dots and underscores
    return re.sub(r'[^a-zA-Z0-9._]', '', username)
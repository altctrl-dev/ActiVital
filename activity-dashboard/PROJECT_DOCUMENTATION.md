# ActiVital Activity Dashboard - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Plan & Architecture](#project-plan--architecture)
3. [Detailed Folder Structure](#detailed-folder-structure)
4. [Development Progress](#development-progress)
5. [Technical Implementation](#technical-implementation)
6. [Setup & Deployment](#setup--deployment)
7. [Usage Guide](#usage-guide)

---

## Project Overview

**ActiVital** is a comprehensive user activity tracking dashboard inspired by ActivTrak, designed to monitor and analyze employee productivity through automated log processing and statistical reporting.

### Key Features
- 📊 Real-time user activity tracking and analysis
- 📅 Daily, weekly, and monthly productivity statistics
- 📈 Interactive dashboard with data visualization
- 🔄 Automated log parsing and data processing
- 🔍 Robust input validation and error handling
- 📝 Comprehensive logging and monitoring
- ⚡ Modern, responsive React frontend
- 🛡️ Secure Flask REST API backend

### Business Value
- **Productivity Insights**: Track employee work patterns and productivity metrics
- **Time Management**: Analyze active vs idle time across different periods
- **Resource Planning**: Understand team productivity patterns for better planning
- **Compliance**: Maintain detailed activity logs for auditing purposes

---

## Project Plan & Architecture

### System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   Database      │
│   (React)       │     │   (Flask)       │     │   (PostgreSQL)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │  Log Processing │
                        │   Pipeline      │
                        └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │   CSV Logs      │
                        │   Storage       │
                        └─────────────────┘
```

### Technology Stack

#### Backend Technologies
- **Framework**: Flask 3.0.0 with Flask-SQLAlchemy 3.1.1
- **Database**: PostgreSQL with Alembic migrations
- **Data Processing**: Pandas 2.1.1 for CSV parsing
- **HTTP**: Flask-CORS 4.0.0 for cross-origin requests
- **Deployment**: Gunicorn 21.2.0 for production
- **ORM**: SQLAlchemy 2.0.21

#### Frontend Technologies
- **Framework**: React 19.1.1 with React DOM 19.1.1
- **Build Tool**: Vite 7.1.7 for fast development
- **Styling**: TailwindCSS 4.1.13 with PostCSS
- **Code Quality**: ESLint 9.36.0 with React plugins
- **TypeScript**: Full type definitions support

#### Development & Operations
- **Testing**: Custom unittest-based test suite
- **Logging**: Structured logging with custom logger
- **Automation**: Cron job scheduling for data processing
- **Migration**: Alembic-based database versioning

### Data Flow Architecture

```
CSV Logs → Parse Engine → Events Table → Stats Processor → Aggregated Tables → API → Frontend
    ↓           ↓              ↓             ↓                ↓           ↓        ↓
  Raw Data   Validation   Normalized    Daily/Weekly    Computed     JSON     Visual
             & Cleaning    Events        Monthly        Statistics   Response  Dashboard
```

---

## Detailed Folder Structure

```
activity-dashboard/
├── README.md                          # Main project documentation
├── PROJECT_DOCUMENTATION.md           # This comprehensive documentation
│
├── backend/                           # Flask API and data processing
│   ├── README.dev.md                  # Backend development guide
│   ├── app.py                         # Main Flask application entry point
│   ├── config.py                      # Configuration management
│   ├── requirements.txt               # Python dependencies
│   ├── flask_models.py                # Flask-SQLAlchemy model definitions
│   ├── validators.py                  # Input validation and sanitization
│   ├── logger.py                      # Structured logging configuration
│   ├── migrate.sh                     # Database migration script
│   ├── migrate_data.py                # Data migration utilities
│   ├── check_env.sh                   # Environment validation script
│   │
│   ├── alembic/                       # Database migration management
│   │   ├── alembic.ini                # Alembic configuration
│   │   ├── env.py                     # Alembic environment setup
│   │   └── versions/                  # Migration version files
│   │       └── 001_initial.py         # Initial database schema
│   │
│   ├── db/                            # Database models and initialization
│   │   ├── models.py                  # SQLAlchemy model definitions
│   │   └── init_db.py                 # Database initialization script
│   │
│   ├── parser/                        # Log parsing and data transformation
│   │   ├── parse_logs.py              # CSV log parsing engine
│   │   └── transform.py               # Statistics computation engine
│   │
│   ├── scheduler/                     # Automated processing
│   │   ├── stats_scheduler.py         # Main scheduling coordinator
│   │   └── refresh.py                 # Data refresh utilities
│   │
│   ├── tests/                         # Test suite
│   │   ├── run_tests.sh               # Test execution script
│   │   └── test_activity_dashboard.py # Comprehensive test cases
│   │
│   └── venv/                          # Python virtual environment
│       └── [standard venv structure]
│
├── frontend/                          # React dashboard application
│   ├── README.md                      # Frontend documentation
│   ├── package.json                   # Node.js dependencies and scripts
│   ├── package-lock.json              # Locked dependency versions
│   ├── vite.config.js                 # Vite build configuration
│   ├── tailwind.config.js             # TailwindCSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── eslint.config.js               # ESLint code quality rules
│   │
│   ├── src/                           # Source code
│   │   ├── main.jsx                   # Application entry point
│   │   ├── App.jsx                    # Root application component
│   │   │
│   │   ├── components/                # React components
│   │   │   ├── Dashboard.jsx          # Main dashboard container
│   │   │   ├── UserSelector.jsx       # User selection dropdown
│   │   │   ├── DateSelector.jsx       # Date picker component
│   │   │   ├── DateRangePicker.jsx    # Date range selection
│   │   │   ├── StatsCard.jsx          # Statistics display card
│   │   │   └── MetricsCard.jsx        # Metrics visualization
│   │   │
│   │   ├── services/                  # External service integrations
│   │   │   └── api.js                 # API communication service
│   │   │
│   │   ├── api/                       # API utilities
│   │   │   └── api.js                 # API endpoint definitions
│   │   │
│   │   └── utils/                     # Utility functions
│   │       └── dateUtils.js           # Date formatting and manipulation
│   │
│   ├── dist/                          # Built application (production)
│   │   └── assets/                    # Compiled CSS and JS assets
│   │
│   ├── node_modules/                  # Node.js dependencies
│   └── .vite/                         # Vite development cache
│
├── db/                                # Database files and utilities
│   └── [database storage location]
│
├── logs/                              # Activity log storage
│   ├── app.log                        # Application log file
│   ├── db.log                         # Database operation logs
│   ├── parser.log                     # Log parsing operation logs
│   │
│   ├── AnjanaMVasudevan/              # User-specific activity logs
│   │   ├── Events__03-Aug-2025_to_09-Aug-2025.csv
│   │   ├── Events__06-Jul-2025_to_12-Jul-2025.csv
│   │   ├── Events__08-Jun-2025_to_14-Jun-2025.csv
│   │   ├── Events__10-Aug-2025_to_16-Aug-2025.csv
│   │   ├── Events__13-Jul-2025_to_19-Jul-2025.csv
│   │   ├── Events__15-Jun-2025_to_21-Jun-2025.csv
│   │   ├── Events__17-Aug-2025_to_23-Aug-2025.csv
│   │   ├── Events__20-Jul-2025_to_26-Jul-2025.csv
│   │   ├── Events__22-Jun-2025_to_28-Jun-2025.csv
│   │   ├── Events__27-Jul-2025_to_02-Aug-2025.csv
│   │   └── Events__29-Jun-2025_to_05-Jul-2025.csv
│   │
│   ├── jane.smith/                    # Sample user logs
│   │   └── Events__10-Aug-2025_to_16-Aug-2025.csv
│   │
│   └── john.doe/                      # Sample user logs
│       └── Events__10-Aug-2025_to_16-Aug-2025.csv
│
└── scripts/                           # Development and automation scripts
    ├── run_dev.sh                     # Development environment startup
    ├── update_stats.sh                # Statistics update automation
    └── cron_example.txt               # Example cron job configuration
```

### File Purpose Breakdown

#### Core Application Files
- **backend/app.py**: Main Flask application with REST API endpoints
- **frontend/src/App.jsx**: Root React component and application router
- **backend/config.py**: Environment-based configuration management

#### Database Layer
- **backend/db/models.py**: Core SQLAlchemy model definitions
- **backend/flask_models.py**: Flask-integrated model wrapper
- **backend/alembic/**: Database migration and versioning system

#### Data Processing Pipeline
- **backend/parser/parse_logs.py**: CSV parsing and data normalization
- **backend/parser/transform.py**: Statistical computation and aggregation
- **backend/scheduler/stats_scheduler.py**: Automated processing coordination

#### Frontend Components
- **Dashboard.jsx**: Main container managing application state
- **UserSelector.jsx**: User selection with auto-loading capability
- **StatsCard.jsx**: Multi-format statistics display component
- **DateSelector.jsx**: Date picking with validation

#### Development Tools
- **scripts/run_dev.sh**: Complete development environment setup
- **backend/tests/**: Comprehensive test suite with mocking
- **frontend/vite.config.js**: Modern build tool configuration

---

## Development Progress

### Phase 1: Project Foundation ✅ COMPLETED
**Timeline**: Initial Setup
**Status**: Fully Implemented

#### Backend Infrastructure
- ✅ Flask application structure with REST API design
- ✅ SQLAlchemy ORM with PostgreSQL integration
- ✅ Alembic database migration system
- ✅ CORS configuration for cross-origin requests
- ✅ Structured logging with custom logger implementation
- ✅ Input validation and sanitization framework
- ✅ Configuration management with environment variables

#### Frontend Infrastructure
- ✅ React 19.1.1 application with modern hooks
- ✅ Vite build system for fast development
- ✅ TailwindCSS for responsive design
- ✅ ESLint configuration for code quality
- ✅ Component-based architecture design

#### Database Schema Design
- ✅ Events table for raw activity log storage
- ✅ Daily statistics aggregation table
- ✅ Weekly statistics aggregation table
- ✅ Monthly statistics aggregation table
- ✅ Proper indexing for query optimization
- ✅ Data integrity constraints and relationships

### Phase 2: Data Processing Pipeline ✅ COMPLETED
**Timeline**: Core Data Processing
**Status**: Fully Implemented

#### Log Parsing Engine
- ✅ Multi-format CSV parsing capability
- ✅ Event type normalization and validation
- ✅ Timestamp parsing with timezone support
- ✅ Batch processing for large log files
- ✅ Error handling and data quality validation
- ✅ Recursive directory scanning for log discovery

#### Statistics Computation
- ✅ Daily statistics calculation engine
  - Active duration computation
  - Idle time tracking
  - Session boundary detection
  - First logon and last activity tracking
- ✅ Weekly aggregation with productivity scoring
  - ISO week number calculation
  - Average daily metrics computation
  - Productivity percentage calculation
- ✅ Monthly aggregation with extended metrics
  - Calendar month grouping
  - Total active days counting
  - Comprehensive productivity analysis

#### Data Transformation Pipeline
- ✅ Event stream processing with state management
- ✅ Duration calculation between event transitions
- ✅ Outlier detection and data quality assurance
- ✅ Batch insert optimization for performance

### Phase 3: API Development ✅ COMPLETED
**Timeline**: REST API Implementation
**Status**: Fully Implemented

#### Core API Endpoints
- ✅ `GET /users` - User list retrieval with distinct username queries
- ✅ `GET /stats/daily` - Daily statistics with date validation
- ✅ `GET /stats/weekly` - Weekly statistics with ISO week format
- ✅ `GET /stats/monthly` - Monthly statistics with calendar month format
- ✅ Comprehensive error handling with appropriate HTTP status codes
- ✅ JSON response formatting with consistent structure

#### Security & Validation
- ✅ Username sanitization to prevent injection attacks
- ✅ Date format validation with error messages
- ✅ Parameter requirement validation with decorators
- ✅ SQL injection protection through ORM usage
- ✅ Input length limits and type checking

#### API Documentation
- ✅ Parameter specifications and validation rules
- ✅ Response format documentation with examples
- ✅ Error code definitions and handling
- ✅ Query optimization and performance considerations

### Phase 4: Frontend Development ✅ COMPLETED
**Timeline**: User Interface Implementation
**Status**: Fully Implemented

#### Component Architecture
- ✅ Dashboard component with state management
  - User selection state
  - Date selection state
  - Statistics data state
  - Loading and error states
- ✅ UserSelector with auto-loading and error recovery
- ✅ StatsCard with multi-format display capability
- ✅ DateSelector with validation and formatting
- ✅ Responsive design with TailwindCSS grid system

#### API Integration
- ✅ Centralized API service class
- ✅ Parallel data fetching for performance
- ✅ Error handling with user-friendly messages
- ✅ Loading states for better user experience
- ✅ Retry mechanisms for failed requests

#### User Experience Features
- ✅ Auto-selection of first available user
- ✅ Real-time data updates on selection changes
- ✅ Responsive design for mobile and desktop
- ✅ Intuitive navigation and date selection
- ✅ Clear error messages and recovery options

### Phase 5: Automation & Scheduling ✅ COMPLETED
**Timeline**: Production Automation
**Status**: Fully Implemented

#### Automated Processing
- ✅ Statistics scheduler with command-line interface
- ✅ Full update mode (parse logs + compute statistics)
- ✅ Statistics-only mode for recomputation
- ✅ Subprocess management for parsing pipeline
- ✅ Comprehensive error logging and reporting
- ✅ Execution time tracking and performance monitoring

#### Development Tools
- ✅ Development environment startup script
- ✅ Database initialization automation
- ✅ Statistics update automation script
- ✅ Cron job configuration examples
- ✅ Environment validation scripts

#### Testing & Quality Assurance
- ✅ Comprehensive test suite with unittest framework
- ✅ Mock data generation for testing scenarios
- ✅ Integration tests for end-to-end workflows
- ✅ Database testing with in-memory SQLite
- ✅ Test automation scripts

### Phase 6: Production Readiness ✅ COMPLETED
**Timeline**: Deployment Preparation
**Status**: Fully Implemented

#### Configuration Management
- ✅ Environment-based configuration system
- ✅ Database URL configuration with fallbacks
- ✅ Configurable log directory and file patterns
- ✅ Tunable processing parameters (idle timeout, etc.)
- ✅ Production vs development environment handling

#### Documentation & Setup
- ✅ Comprehensive README with setup instructions
- ✅ Backend development guide
- ✅ Frontend development guide
- ✅ API documentation with examples
- ✅ Deployment instructions for production

#### Sample Data & Testing
- ✅ Multiple user sample datasets
- ✅ Realistic activity patterns for testing
- ✅ Various date ranges for comprehensive testing
- ✅ Edge case scenarios (gaps, outliers, errors)
- ✅ Performance testing with large datasets

### Current Status Summary

**Overall Completion**: 100% ✅

The ActiVital project is in a **production-ready state** with all major components implemented and tested:

1. **Backend**: Complete Flask API with robust data processing
2. **Frontend**: Full React dashboard with responsive design
3. **Database**: Properly designed schema with migration support
4. **Automation**: Scheduling and processing automation ready
5. **Testing**: Comprehensive test coverage
6. **Documentation**: Complete setup and usage documentation
7. **Sample Data**: Realistic datasets for immediate testing

The system is ready for:
- ✅ Local development and testing
- ✅ Production deployment with minor configuration
- ✅ Team collaboration and feature expansion
- ✅ Integration with existing monitoring systems

---

## Technical Implementation

### Database Schema Design

#### Core Tables Structure

```sql
-- Events: Raw activity log storage
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    username VARCHAR(100) NOT NULL,
    computer_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(500) NOT NULL,  -- Logon, Logoff, Idle Started, Active, etc.
    timezone VARCHAR(50) NOT NULL
);

-- Daily Statistics: Aggregated daily metrics
CREATE TABLE daily_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    username VARCHAR(100) NOT NULL,
    computer_name VARCHAR(100) NOT NULL,
    shift VARCHAR(50),  -- Morning, Evening, Night (optional)
    first_logon TIMESTAMP,
    last_activity TIMESTAMP,
    total_active_duration FLOAT,    -- Duration in minutes
    total_idle_duration FLOAT,      -- Duration in minutes
    total_session_duration FLOAT    -- Duration in minutes
);

-- Weekly Statistics: Aggregated weekly metrics
CREATE TABLE weekly_stats (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    week INTEGER NOT NULL,           -- Week number (1-53)
    username VARCHAR(100) NOT NULL,
    computer_name VARCHAR(100) NOT NULL,
    avg_daily_active_duration FLOAT,
    total_active_duration FLOAT,
    avg_session_duration FLOAT,
    productivity_score FLOAT        -- Percentage (0-100)
);

-- Monthly Statistics: Aggregated monthly metrics
CREATE TABLE monthly_stats (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,          -- Month number (1-12)
    username VARCHAR(100) NOT NULL,
    computer_name VARCHAR(100) NOT NULL,
    avg_daily_active_duration FLOAT,
    total_active_duration FLOAT,
    avg_session_duration FLOAT,
    productivity_score FLOAT,
    total_days_active INTEGER
);
```

#### Indexing Strategy
```sql
-- Performance optimization indexes
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_username ON events(username);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);
CREATE INDEX idx_daily_stats_username ON daily_stats(username);
CREATE INDEX idx_weekly_stats_year_week ON weekly_stats(year, week);
CREATE INDEX idx_monthly_stats_year_month ON monthly_stats(year, month);
```

### API Endpoint Documentation

#### Base Configuration
- **Base URL**: `http://localhost:5001`
- **Content-Type**: `application/json`
- **CORS**: Enabled for all origins

#### Endpoint Specifications

##### 1. Get Users List
```http
GET /users
```

**Response Example**:
```json
{
  "users": ["john.doe", "jane.smith", "AnjanaMVasudevan"]
}
```

**Error Responses**:
- `500`: Database connection error

##### 2. Get Daily Statistics
```http
GET /stats/daily?user={username}&date={YYYY-MM-DD}
```

**Parameters**:
- `user` (required): Username (sanitized for security)
- `date` (required): Date in YYYY-MM-DD format

**Response Example**:
```json
{
  "date": "2025-08-10",
  "username": "john.doe",
  "computer_name": "LAPTOP-001",
  "first_logon": "2025-08-10T09:00:00",
  "last_activity": "2025-08-10T17:30:00",
  "total_active_duration": 420.0,
  "total_idle_duration": 90.0,
  "total_session_duration": 510.0
}
```

**Error Responses**:
- `400`: Invalid date format
- `404`: No data found for specified date/user
- `500`: Database error

##### 3. Get Weekly Statistics
```http
GET /stats/weekly?user={username}&week={YYYY-Wnn}
```

**Parameters**:
- `user` (required): Username
- `week` (required): ISO week format (e.g., 2025-W33)

**Response Example**:
```json
{
  "year": 2025,
  "week": 33,
  "username": "john.doe",
  "computer_name": "LAPTOP-001",
  "avg_daily_active_duration": 400.0,
  "total_active_duration": 2800.0,
  "avg_session_duration": 480.0,
  "productivity_score": 83.33
}
```

##### 4. Get Monthly Statistics
```http
GET /stats/monthly?user={username}&month={YYYY-MM}
```

**Parameters**:
- `user` (required): Username
- `month` (required): Month in YYYY-MM format

**Response Example**:
```json
{
  "year": 2025,
  "month": 8,
  "username": "john.doe",
  "computer_name": "LAPTOP-001",
  "avg_daily_active_duration": 420.0,
  "total_active_duration": 9240.0,
  "avg_session_duration": 500.0,
  "productivity_score": 84.0,
  "total_days_active": 22
}
```

### Data Processing Pipeline

#### 1. Log Parsing Engine (`parse_logs.py`)

**Input Processing**:
- Scans for `Events__*.csv` files in logs directory
- Supports multiple CSV formats with intelligent detection
- Handles timezone information and timestamp normalization

**Data Flow**:
```
CSV Files → Format Detection → Data Validation → Event Normalization → Database Insert
```

**Event Type Mapping**:
```python
EVENT_TYPE_MAPPING = {
    'Idle': 'Idle Started',
    'Login': 'Logon',
    'Logout': 'Logoff',
    'Active': 'Active',
    'Lock': 'Lock',
    'Unlock': 'Unlock'
}
```

#### 2. Statistics Computation Engine (`transform.py`)

**Daily Statistics Process**:
1. Query events for specific date and user
2. Sort events chronologically
3. Process event transitions to calculate durations
4. Aggregate active, idle, and total session times
5. Store computed statistics in daily_stats table

**Weekly/Monthly Aggregation**:
1. Query daily statistics for the period
2. Calculate averages and totals
3. Compute productivity scores
4. Store aggregated data in respective tables

**Productivity Score Calculation**:
```python
productivity_score = (total_active_duration / total_session_duration) * 100
```

### Frontend Component Architecture

#### Component Hierarchy
```
App.jsx
└── Dashboard.jsx (State Management Hub)
    ├── UserSelector.jsx (User Selection)
    ├── DateSelector.jsx (Date Selection)
    └── StatsCard.jsx (Data Display)
        ├── Daily Statistics Rendering
        ├── Weekly Statistics Rendering
        └── Monthly Statistics Rendering
```

#### State Management Pattern
```javascript
// Dashboard.jsx - Central state management
const [selectedUser, setSelectedUser] = useState('');
const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
const [dailyStats, setDailyStats] = useState(null);
const [weeklyStats, setWeeklyStats] = useState(null);
const [monthlyStats, setMonthlyStats] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

#### API Integration Pattern
```javascript
// Parallel data fetching for performance
const fetchAllStats = useCallback(async () => {
  if (!selectedUser || !selectedDate) return;

  setLoading(true);
  setError(null);

  try {
    const [daily, weekly, monthly] = await Promise.all([
      api.getDailyStats(selectedUser, selectedDate),
      api.getWeeklyStats(selectedUser, getISOWeek(selectedDate)),
      api.getMonthlyStats(selectedUser, getMonth(selectedDate))
    ]);

    setDailyStats(daily);
    setWeeklyStats(weekly);
    setMonthlyStats(monthly);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [selectedUser, selectedDate]);
```

---

## Setup & Deployment

### Local Development Setup

#### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (or SQLite for development)
- Git

#### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Set up environment variables (optional)
export DATABASE_URL="postgresql://localhost/activital_dashboard"
export LOGS_DIR="../logs"

# 5. Initialize database
./migrate.sh

# 6. Process sample data
python parser/parse_logs.py
python parser/transform.py

# 7. Start development server
flask run --debug
```

#### Frontend Setup
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start development server
npm run dev
```

#### Quick Start with Script
```bash
# Use the automated development script
./scripts/run_dev.sh
```

### Production Deployment

#### Backend Production Setup
```bash
# 1. Set up production database
export DATABASE_URL="postgresql://user:password@host:port/database"

# 2. Install production dependencies
pip install -r requirements.txt gunicorn

# 3. Run database migrations
alembic upgrade head

# 4. Start with Gunicorn
gunicorn app:app --bind 0.0.0.0:5001 --workers 4
```

#### Frontend Production Build
```bash
# 1. Create production build
cd frontend
npm run build

# 2. Serve with NGINX or similar
# Point document root to frontend/dist/
```

#### Automated Processing Setup
```bash
# Add to crontab for automated processing
# Process logs every hour
0 * * * * /path/to/backend/venv/bin/python /path/to/backend/scheduler/stats_scheduler.py --mode full

# Update statistics only every 30 minutes
*/30 * * * * /path/to/backend/venv/bin/python /path/to/backend/scheduler/stats_scheduler.py --mode stats-only
```

### Environment Configuration

#### Backend Environment Variables
```bash
# Database configuration
DATABASE_URL="postgresql://localhost/activital_dashboard"

# Log processing configuration
LOGS_DIR="/path/to/activity/logs"
IDLE_TIMEOUT_MINUTES=30
SESSION_TIMEOUT_HOURS=12

# Flask configuration
FLASK_ENV=production
SECRET_KEY="your-secret-key-here"
```

#### Frontend Environment Variables
```bash
# API configuration
VITE_API_BASE_URL="http://localhost:5001"
VITE_API_TIMEOUT=10000

# Build configuration
VITE_BUILD_TARGET="es2015"
```

---

## Usage Guide

### Dashboard Navigation

#### 1. User Selection
- Access the user dropdown in the top-left corner
- Users are automatically loaded from the database
- First available user is auto-selected on page load
- Selection triggers automatic data refresh

#### 2. Date Selection
- Use the date picker to select the analysis date
- Date format: YYYY-MM-DD
- Invalid dates display error messages
- Date changes trigger automatic data refresh

#### 3. Statistics Display
The dashboard shows three main statistics cards:

**Daily Statistics Card**:
- Total active duration (work time)
- Total idle duration (break time)
- Total session duration (total time)
- First logon and last activity times
- Computer name and date information

**Weekly Statistics Card**:
- Average daily active duration
- Total weekly active duration
- Average session duration
- Productivity score percentage
- Year and week number (ISO format)

**Monthly Statistics Card**:
- Average daily active duration
- Total monthly active duration
- Average session duration
- Productivity score percentage
- Total days with activity
- Year and month information

### Data Processing

#### Manual Log Processing
```bash
# Parse new log files
python backend/parser/parse_logs.py

# Recompute all statistics
python backend/parser/transform.py

# Run both operations
python backend/scheduler/stats_scheduler.py --mode full
```

#### Automated Processing
```bash
# Set up cron jobs for automation
# Edit crontab
crontab -e

# Add these lines for hourly processing
0 * * * * cd /path/to/project && ./scripts/update_stats.sh
```

### Troubleshooting

#### Common Issues

**Database Connection Errors**:
```bash
# Check database status
psql -h localhost -U postgres -l

# Verify DATABASE_URL
echo $DATABASE_URL

# Run database migrations
cd backend && ./migrate.sh
```

**Log Parsing Errors**:
```bash
# Check log file format
head -5 logs/username/Events__*.csv

# Verify log directory permissions
ls -la logs/

# Run parser with verbose output
python backend/parser/parse_logs.py --verbose
```

**Frontend API Errors**:
```bash
# Check backend server status
curl http://localhost:5001/users

# Verify CORS configuration
curl -H "Origin: http://localhost:5173" http://localhost:5001/users

# Check browser console for detailed errors
```

#### Log File Formats

**Supported CSV Format 1**:
```csv
Timestamp,Computer Name,Event Type,Timezone
2025-08-10 09:00:00,LAPTOP-001,Logon,UTC
2025-08-10 09:30:00,LAPTOP-001,Active,UTC
2025-08-10 10:00:00,LAPTOP-001,Idle Started,UTC
```

**Supported CSV Format 2**:
```csv
Date,Time,Computer,Event,TimeZone,Username
2025-08-10,09:00:00,LAPTOP-001,Logon,UTC,john.doe
2025-08-10,09:30:00,LAPTOP-001,Active,UTC,john.doe
2025-08-10,10:00:00,LAPTOP-001,Idle,UTC,john.doe
```

### Performance Optimization

#### Database Optimization
- Regular `VACUUM` and `ANALYZE` operations
- Monitor query performance with `EXPLAIN ANALYZE`
- Consider partitioning for large datasets
- Optimize indexes based on query patterns

#### Frontend Performance
- Enable production build optimization
- Implement data caching for repeated requests
- Use React.memo for expensive components
- Consider pagination for large datasets

#### Backend Performance
- Use database connection pooling
- Implement API response caching
- Optimize batch processing for large log files
- Monitor memory usage during processing

---

This comprehensive documentation covers all aspects of the ActiVital Activity Dashboard project, from technical implementation details to practical usage instructions. The project is production-ready and fully documented for team collaboration and future development.
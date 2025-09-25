# Activity Dashboard

A comprehensive user activity tracking dashboard inspired by ActivTrak, built with Flask and React.

## Features

- 📊 User activity tracking and analysis
- 📅 Daily, weekly, and monthly statistics
- 📈 Activity visualization and reports
- 🔄 Automated log parsing and updates
- 🔍 Input validation and error handling
- 📝 Comprehensive logging
- ⚡ Fast and responsive UI

## Backend Setup

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up the database:
```bash
./migrate.sh  # Run database migrations
```

4. Process activity logs:
```bash
python parser/parse_logs.py
python parser/transform.py
```

5. Run the development server:
```bash
flask run
```

## Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The dashboard will be available at http://localhost:5173

## Development

- Run tests: `cd backend && ./tests/run_tests.sh`
- Start development environment: `./scripts/run_dev.sh`
- Update database schema: Update migrations in `backend/alembic/versions/` and run `./migrate.sh`

## Project Structure

```
activity-dashboard/
├─ backend/              # Flask API and data processing
│  ├─ app.py            # Main Flask application
│  ├─ config.py         # Configuration settings
│  ├─ alembic/          # Database migrations
│  ├─ db/               # Database models and initialization
│  ├─ parser/           # Log parsing and transformation
│  ├─ scheduler/        # Automated updates
│  └─ tests/            # Test suite
├─ frontend/            # React dashboard UI
│  ├─ src/
│  │  ├─ components/    # React components
│  │  └─ api/          # API integration
├─ logs/               # CSV activity logs
└─ scripts/            # Development scripts
```

## Deployment

### Backend
1. Set up a production database (PostgreSQL recommended)
2. Update `config.py` with production settings
3. Run with gunicorn: `gunicorn app:app`

### Frontend
1. Build the production bundle: `cd frontend && npm run build`
2. Serve the `dist` directory with NGINX

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request
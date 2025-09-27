# Developer setup (backend)

This file documents the minimal steps to set up a local development backend environment.

1) Create a local .env (never commit it)

  cp .env.example .env
  # Edit .env and put real values for DATABASE_URL and SECRET_KEY

2) Activate venv

  source venv/bin/activate

3) Install deps (if needed)

  pip install -r requirements.txt

4) Run migrations

  ./migrate.sh

5) Start dev server

  export FLASK_APP=app.py
  flask run --port=5001

6) Run tests

  pytest -q

Notes:
- Use `DATABASE_URL` environment variable for production/CI secrets; do not hardcode credentials.
- If a secret was committed, rotate it immediately and consider removing from git history.

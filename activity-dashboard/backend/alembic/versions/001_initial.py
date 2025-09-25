"""Initial migration

Revision ID: 001_initial
Create Date: 2025-09-25
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create events table
    op.create_table(
        'events',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('computer_name', sa.String(100), nullable=False),
        sa.Column('event_type', sa.String(50), nullable=False),
        sa.Column('timezone', sa.String(50), nullable=False)
    )

    # Create daily_stats table
    op.create_table(
        'daily_stats',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('computer_name', sa.String(100), nullable=False),
        sa.Column('shift', sa.String(50)),
        sa.Column('first_logon', sa.DateTime()),
        sa.Column('last_activity', sa.DateTime()),
        sa.Column('total_active_duration', sa.Float()),
        sa.Column('total_idle_duration', sa.Float()),
        sa.Column('total_session_duration', sa.Float())
    )

    # Create weekly_stats table
    op.create_table(
        'weekly_stats',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('week', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('computer_name', sa.String(100), nullable=False),
        sa.Column('avg_daily_active_duration', sa.Float()),
        sa.Column('total_active_duration', sa.Float()),
        sa.Column('avg_session_duration', sa.Float()),
        sa.Column('productivity_score', sa.Float())
    )

    # Create monthly_stats table
    op.create_table(
        'monthly_stats',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('month', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('computer_name', sa.String(100), nullable=False),
        sa.Column('avg_daily_active_duration', sa.Float()),
        sa.Column('total_active_duration', sa.Float()),
        sa.Column('avg_session_duration', sa.Float()),
        sa.Column('productivity_score', sa.Float()),
        sa.Column('total_days_active', sa.Integer())
    )

    # Create indexes
    op.create_index('ix_events_timestamp', 'events', ['timestamp'])
    op.create_index('ix_events_username', 'events', ['username'])
    op.create_index('ix_daily_stats_date', 'daily_stats', ['date'])
    op.create_index('ix_daily_stats_username', 'daily_stats', ['username'])
    op.create_index('ix_weekly_stats_year_week', 'weekly_stats', ['year', 'week'])
    op.create_index('ix_monthly_stats_year_month', 'monthly_stats', ['year', 'month'])

def downgrade():
    op.drop_table('monthly_stats')
    op.drop_table('weekly_stats')
    op.drop_table('daily_stats')
    op.drop_table('events')
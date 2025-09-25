import os
import sys
import unittest
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.models import Event, DailyStats
from parser.parse_logs import parse_log_file
from parser.transform import compute_daily_stats
from db.init_db import init_db

class TestActivityDashboard(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test database and session."""
        # Use test database
        os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
        cls.session = init_db()

    def setUp(self):
        """Set up test data."""
        # Create test event
        event = Event(
            timestamp=datetime.now(),
            username='test.user',
            computer_name='TEST-PC',
            event_type='Logon',
            timezone='UTC'
        )
        self.session.add(event)
        self.session.commit()

    def tearDown(self):
        """Clean up after each test."""
        self.session.query(Event).delete()
        self.session.query(DailyStats).delete()
        self.session.commit()

    def test_event_creation(self):
        """Test event model creation."""
        event = Event(
            timestamp=datetime.now(),
            username='test.user',
            computer_name='TEST-PC',
            event_type='Active',
            timezone='UTC'
        )
        self.session.add(event)
        self.session.commit()

        saved_event = self.session.query(Event).filter_by(username='test.user').first()
        self.assertIsNotNone(saved_event)
        self.assertEqual(saved_event.event_type, 'Active')

    def test_daily_stats_computation(self):
        """Test daily statistics computation."""
        # Create test events for a day
        base_time = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)
        events = [
            Event(
                timestamp=base_time,
                username='test.user',
                computer_name='TEST-PC',
                event_type='Logon',
                timezone='UTC'
            ),
            Event(
                timestamp=base_time + timedelta(hours=4),
                username='test.user',
                computer_name='TEST-PC',
                event_type='Active',
                timezone='UTC'
            ),
            Event(
                timestamp=base_time + timedelta(hours=8),
                username='test.user',
                computer_name='TEST-PC',
                event_type='Logoff',
                timezone='UTC'
            )
        ]
        
        for event in events:
            self.session.add(event)
        self.session.commit()

        # Compute daily stats
        compute_daily_stats(self.session, base_time)

        # Check results
        stats = self.session.query(DailyStats).filter_by(username='test.user').first()
        self.assertIsNotNone(stats)
        self.assertEqual(stats.first_logon.hour, 9)
        self.assertEqual(stats.last_activity.hour, 17)

    def test_log_parser(self):
        """Test CSV log file parsing."""
        # Create test CSV file
        test_log_dir = Path('test_logs')
        test_log_dir.mkdir(exist_ok=True)
        
        test_csv = test_log_dir / 'test_events.csv'
        with open(test_csv, 'w') as f:
            f.write('Timestamp,Computer Name,Event Type,Timezone\n')
            f.write('2025-08-10 09:00:00,TEST-PC,Logon,UTC\n')
            f.write('2025-08-10 17:00:00,TEST-PC,Logoff,UTC\n')

        try:
            # Parse test file
            parse_log_file(str(test_csv), self.session)
            
            # Verify results
            events = self.session.query(Event).all()
            self.assertEqual(len(events), 2)
            self.assertEqual(events[0].event_type, 'Logon')
            self.assertEqual(events[1].event_type, 'Logoff')
        
        finally:
            # Clean up
            test_csv.unlink()
            test_log_dir.rmdir()

if __name__ == '__main__':
    unittest.main()
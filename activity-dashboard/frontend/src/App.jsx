import { useState, useEffect } from 'react';
import UserSelector from './components/UserSelector';
import DateRangePicker from './components/DateRangePicker';
import MetricsCard from './components/MetricsCard';
import { getDailyStats } from './api/api';
import dayjs from 'dayjs';

function App() {
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedUser) return;
      
      setLoading(true);
      try {
        const dailyStats = await getDailyStats(selectedUser, endDate);
        setStats(dailyStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedUser, endDate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Activity Dashboard</h1>
        
        <div className="mb-8 flex justify-between items-end">
          <UserSelector onUserChange={setSelectedUser} />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {loading ? (
          <div>Loading stats...</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricsCard
              title="Active Time"
              value={`${Math.round(stats.total_active_duration / 60)}h ${Math.round(stats.total_active_duration % 60)}m`}
              subtitle="Total active duration"
            />
            <MetricsCard
              title="First Login"
              value={dayjs(stats.first_logon).format('HH:mm')}
              subtitle="Start of day"
            />
            <MetricsCard
              title="Last Activity"
              value={dayjs(stats.last_activity).format('HH:mm')}
              subtitle="End of day"
            />
          </div>
        ) : (
          <div>Select a user to view statistics</div>
        )}
      </div>
    </div>
  );
}

export default App;

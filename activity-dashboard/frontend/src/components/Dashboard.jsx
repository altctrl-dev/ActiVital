import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { formatWeek, formatMonth } from '../utils/dateUtils';
import UserSelector from './UserSelector';
import DateSelector from './DateSelector';
import StatsCard from './StatsCard';

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-08-10');
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedUser && selectedDate) {
      fetchAllStats();
    }
  }, [selectedUser, selectedDate]);

  const fetchAllStats = async () => {
    if (!selectedUser || !selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      const date = new Date(selectedDate);
      const weekStr = formatWeek(date);
      const monthStr = formatMonth(date);

      const [daily, weekly, monthly] = await Promise.all([
        apiService.fetchDailyStats(selectedUser, selectedDate),
        apiService.fetchWeeklyStats(selectedUser, weekStr),
        apiService.fetchMonthlyStats(selectedUser, monthStr)
      ]);

      setDailyStats(daily);
      setWeeklyStats(weekly);
      setMonthlyStats(monthly);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>ActiVital Activity Dashboard</h1>
        <p>Monitor user activity and productivity metrics</p>
      </header>

      <div className="dashboard-controls">
        <UserSelector
          selectedUser={selectedUser}
          onUserChange={setSelectedUser}
        />
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {loading && (
        <div className="loading-state">
          <p>Loading statistics...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchAllStats}>Retry</button>
        </div>
      )}

      {selectedUser && selectedDate && !loading && (
        <div className="stats-grid">
          <StatsCard
            title={`Daily Stats - ${selectedDate}`}
            data={dailyStats}
            type="daily"
          />
          <StatsCard
            title={`Weekly Stats - ${formatWeek(new Date(selectedDate))}`}
            data={weeklyStats}
            type="weekly"
          />
          <StatsCard
            title={`Monthly Stats - ${formatMonth(new Date(selectedDate))}`}
            data={monthlyStats}
            type="monthly"
          />
        </div>
      )}

      {!selectedUser && (
        <div className="no-selection">
          <p>Please select a user to view statistics</p>
        </div>
      )}
    </div>
  );
}
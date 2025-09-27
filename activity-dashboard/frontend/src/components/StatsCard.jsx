import { formatDuration, formatPercentage } from '../utils/dateUtils';

export default function StatsCard({ title, data, type = 'daily' }) {
  if (!data) {
    return (
      <div className="stats-card no-data">
        <h3>{title}</h3>
        <p>No data available</p>
      </div>
    );
  }

  const renderDailyStats = () => (
    <>
      <div className="stat-item">
        <label>First Logon:</label>
        <span>{data.first_logon ? new Date(data.first_logon).toLocaleTimeString() : 'N/A'}</span>
      </div>
      <div className="stat-item">
        <label>Last Activity:</label>
        <span>{data.last_activity ? new Date(data.last_activity).toLocaleTimeString() : 'N/A'}</span>
      </div>
      <div className="stat-item highlight">
        <label>Active Time:</label>
        <span>{formatDuration(data.total_active_duration)}</span>
      </div>
      <div className="stat-item">
        <label>Idle Time:</label>
        <span>{formatDuration(data.total_idle_duration)}</span>
      </div>
      <div className="stat-item">
        <label>Total Session:</label>
        <span>{formatDuration(data.total_session_duration)}</span>
      </div>
    </>
  );

  const renderWeeklyStats = () => (
    <>
      <div className="stat-item">
        <label>Week:</label>
        <span>{data.year}-W{data.week.toString().padStart(2, '0')}</span>
      </div>
      <div className="stat-item highlight">
        <label>Total Active:</label>
        <span>{formatDuration(data.total_active_duration)}</span>
      </div>
      <div className="stat-item">
        <label>Avg Daily Active:</label>
        <span>{formatDuration(data.avg_daily_active_duration)}</span>
      </div>
      <div className="stat-item">
        <label>Productivity:</label>
        <span>{formatPercentage(data.productivity_score)}</span>
      </div>
    </>
  );

  const renderMonthlyStats = () => (
    <>
      <div className="stat-item">
        <label>Month:</label>
        <span>{data.year}-{data.month.toString().padStart(2, '0')}</span>
      </div>
      <div className="stat-item highlight">
        <label>Total Active:</label>
        <span>{formatDuration(data.total_active_duration)}</span>
      </div>
      <div className="stat-item">
        <label>Avg Daily Active:</label>
        <span>{formatDuration(data.avg_daily_active_duration)}</span>
      </div>
      <div className="stat-item">
        <label>Days Active:</label>
        <span>{data.total_days_active} days</span>
      </div>
      <div className="stat-item">
        <label>Productivity:</label>
        <span>{formatPercentage(data.productivity_score)}</span>
      </div>
    </>
  );

  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <div className="stats-content">
        {type === 'daily' && renderDailyStats()}
        {type === 'weekly' && renderWeeklyStats()}
        {type === 'monthly' && renderMonthlyStats()}
      </div>
    </div>
  );
}
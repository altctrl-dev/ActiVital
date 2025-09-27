import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { formatWeek, formatMonth } from '../utils/dateUtils';

import UserSelector from './UserSelector';
import DateSelector from './DateSelector';
import StatsCard from './StatsCard';
import ActivityTimeline from './ActivityTimeline';
import TeamDashboard from './TeamDashboard';
import ProductivityHeatmap from './ProductivityHeatmap';

export default function EnhancedDashboard() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-08-10');
  const [activeTab, setActiveTab] = useState('overview');

  // Original stats
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);

  // Advanced analytics
  const [focusScore, setFocusScore] = useState(null);
  const [breakPatterns, setBreakPatterns] = useState(null);
  const [productivityTrends, setProductivityTrends] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedUser && selectedDate && activeTab === 'overview') {
      fetchAllStats();
    }
    if (selectedUser && selectedDate && activeTab === 'insights') {
      fetchAdvancedAnalytics();
    }
  }, [selectedUser, selectedDate, activeTab]);

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

  const fetchAdvancedAnalytics = async () => {
    if (!selectedUser || !selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      const [focus, breaks, trends] = await Promise.all([
        apiService.fetchFocusScore(selectedUser, selectedDate),
        apiService.fetchBreakPatterns(selectedUser, selectedDate),
        apiService.fetchProductivityTrends(selectedUser, 14) // Last 14 days
      ]);

      setFocusScore(focus);
      setBreakPatterns(breaks);
      setProductivityTrends(trends);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'timeline', name: 'Activity Timeline', icon: '⏰' },
    { id: 'heatmap', name: 'Heatmap', icon: '🔥' },
    { id: 'insights', name: 'Insights', icon: '💡' },
    { id: 'team', name: 'Team Performance', icon: '👥' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            {loading && (
              <div className="loading-state text-center py-8">
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            )}

            {error && (
              <div className="error-state text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button
                  onClick={fetchAllStats}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {selectedUser && selectedDate && !loading && (
              <div className="stats-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="no-selection text-center py-8">
                <p className="text-gray-600">Please select a user to view statistics</p>
              </div>
            )}
          </div>
        );

      case 'timeline':
        return (
          <div className="timeline-content">
            <ActivityTimeline username={selectedUser} date={selectedDate} />
          </div>
        );

      case 'heatmap':
        return (
          <div className="heatmap-content">
            <ProductivityHeatmap username={selectedUser} date={selectedDate} />
          </div>
        );

      case 'insights':
        return (
          <div className="insights-content space-y-6">
            {loading && (
              <div className="loading-state text-center py-8">
                <p className="text-gray-600">Loading advanced analytics...</p>
              </div>
            )}

            {error && (
              <div className="error-state text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button
                  onClick={fetchAdvancedAnalytics}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && focusScore && (
              <div className="focus-score-card bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Focus Score Analysis</h3>
                <div className="focus-metrics grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="metric-item bg-blue-50 p-4 rounded-lg">
                    <div className="metric-label text-sm text-blue-600 font-medium">Focus Score</div>
                    <div className="metric-value text-3xl font-bold text-blue-800">
                      {focusScore.focus_metrics.focus_score}/100
                    </div>
                  </div>
                  <div className="metric-item bg-green-50 p-4 rounded-lg">
                    <div className="metric-label text-sm text-green-600 font-medium">Focus Time</div>
                    <div className="metric-value text-xl font-bold text-green-800">
                      {Math.round(focusScore.focus_metrics.total_focus_time)} min
                    </div>
                  </div>
                  <div className="metric-item bg-purple-50 p-4 rounded-lg">
                    <div className="metric-label text-sm text-purple-600 font-medium">Avg Session</div>
                    <div className="metric-value text-xl font-bold text-purple-800">
                      {Math.round(focusScore.focus_metrics.avg_session_length)} min
                    </div>
                  </div>
                  <div className="metric-item bg-orange-50 p-4 rounded-lg">
                    <div className="metric-label text-sm text-orange-600 font-medium">Sessions</div>
                    <div className="metric-value text-xl font-bold text-orange-800">
                      {focusScore.focus_metrics.focus_sessions_count}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && breakPatterns && (
              <div className="break-patterns-card bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Break Pattern Analysis</h3>
                <div className="break-stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="stat-item bg-yellow-50 p-4 rounded-lg">
                    <div className="stat-label text-sm text-yellow-600 font-medium">Total Breaks</div>
                    <div className="stat-value text-2xl font-bold text-yellow-800">
                      {breakPatterns.break_analysis.total_breaks}
                    </div>
                  </div>
                  <div className="stat-item bg-blue-50 p-4 rounded-lg">
                    <div className="stat-label text-sm text-blue-600 font-medium">Avg Duration</div>
                    <div className="stat-value text-2xl font-bold text-blue-800">
                      {breakPatterns.break_analysis.avg_break_duration} min
                    </div>
                  </div>
                  <div className="stat-item bg-green-50 p-4 rounded-lg">
                    <div className="stat-label text-sm text-green-600 font-medium">Short Breaks</div>
                    <div className="stat-value text-2xl font-bold text-green-800">
                      {breakPatterns.break_analysis.break_distribution.short_breaks}
                    </div>
                  </div>
                  <div className="stat-item bg-red-50 p-4 rounded-lg">
                    <div className="stat-label text-sm text-red-600 font-medium">Long Breaks</div>
                    <div className="stat-value text-2xl font-bold text-red-800">
                      {breakPatterns.break_analysis.break_distribution.long_breaks +
                       breakPatterns.break_analysis.break_distribution.extended_breaks}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && productivityTrends && (
              <div className="trends-card bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">14-Day Productivity Trends</h3>
                <div className="trends-list space-y-2 max-h-64 overflow-y-auto">
                  {productivityTrends.trends.slice(-7).map((trend, index) => (
                    <div key={index} className="trend-item flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="trend-date text-sm font-medium text-gray-700">
                        {new Date(trend.date).toLocaleDateString()}
                      </span>
                      <span className="trend-score text-sm font-bold text-blue-600">
                        {trend.productivity_score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'team':
        return (
          <div className="team-content">
            <TeamDashboard date={selectedDate} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="enhanced-dashboard min-h-screen bg-gray-100">
      <header className="dashboard-header bg-white shadow-sm border-b px-6 py-4">
        <div className="header-content max-w-7xl mx-auto">
          <div className="header-top mb-4">
            <h1 className="text-2xl font-bold text-gray-900">ActiVital Pro Dashboard</h1>
            <p className="text-gray-600">Advanced productivity monitoring and analytics</p>
          </div>

          <div className="dashboard-controls flex flex-col md:flex-row gap-4 items-start md:items-center">
            <UserSelector
              selectedUser={selectedUser}
              onUserChange={setSelectedUser}
            />
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>
      </header>

      <nav className="dashboard-nav bg-white shadow-sm border-b px-6">
        <div className="nav-content max-w-7xl mx-auto">
          <div className="nav-tabs flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-name">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="dashboard-main p-6">
        <div className="main-content max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </main>

      <footer className="dashboard-footer bg-white border-t px-6 py-4 mt-8">
        <div className="footer-content max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>ActiVital Pro Dashboard • Advanced Productivity Analytics • Real-time Monitoring</p>
        </div>
      </footer>
    </div>
  );
}
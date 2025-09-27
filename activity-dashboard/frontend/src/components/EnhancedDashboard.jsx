import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { formatWeek, formatMonth } from '../utils/dateUtils';

import UserSelector from './UserSelector';
import DateSelector from './DateSelector';
import ModernStatsCard from './ModernStatsCard';
import ProductivityChart from './ProductivityChart';
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

            {selectedUser && selectedDate && (
              <div className="stats-grid grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <ModernStatsCard
                  title={`Daily Stats - ${selectedDate}`}
                  data={dailyStats}
                  type="daily"
                  isLoading={loading}
                />
                <ModernStatsCard
                  title={`Weekly Stats - ${formatWeek(new Date(selectedDate))}`}
                  data={weeklyStats}
                  type="weekly"
                  isLoading={loading}
                />
                <ModernStatsCard
                  title={`Monthly Stats - ${formatMonth(new Date(selectedDate))}`}
                  data={monthlyStats}
                  type="monthly"
                  isLoading={loading}
                />
              </div>
            )}

            {/* Add Productivity Chart */}
            {selectedUser && selectedDate && productivityTrends && (
              <div className="chart-section mb-8">
                <ProductivityChart
                  data={productivityTrends}
                  title="14-Day Productivity Trend"
                  type="line"
                  isLoading={loading}
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
    <div className="enhanced-dashboard min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="dashboard-header bg-white shadow-lg border-b px-6 py-6">
        <div className="header-content max-w-7xl mx-auto">
          <div className="header-top mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ActiVital Pro
                </h1>
                <p className="text-gray-600">Advanced Productivity Analytics Dashboard</p>
              </div>
            </div>
          </div>

          <div className="dashboard-controls flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-gray-50 rounded-xl p-4">
            <div className="flex-1">
              <UserSelector
                selectedUser={selectedUser}
                onUserChange={setSelectedUser}
              />
            </div>
            <div className="flex-1">
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav bg-white shadow-lg border-b px-6">
        <div className="nav-content max-w-7xl mx-auto">
          <div className="nav-tabs flex space-x-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab flex items-center space-x-3 py-4 px-6 rounded-t-lg transition-all duration-300 whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="tab-icon text-lg">{tab.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="tab-name font-medium">{tab.name}</span>
                  <span className="text-xs text-gray-500">
                    {tab.id === 'overview' && 'Dashboard overview'}
                    {tab.id === 'timeline' && 'Activity breakdown'}
                    {tab.id === 'heatmap' && 'Hourly patterns'}
                    {tab.id === 'insights' && 'Deep analytics'}
                    {tab.id === 'team' && 'Team performance'}
                  </span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t"></div>
                )}
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
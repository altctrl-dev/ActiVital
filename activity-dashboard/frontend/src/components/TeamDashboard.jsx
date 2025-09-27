import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { formatDuration, formatPercentage } from '../utils/dateUtils';

export default function TeamDashboard({ date }) {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, [date]);

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.fetchTeamSummary(date);
      setTeamData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductivityColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProductivityLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Needs Improvement';
  };

  const sortedTeamStats = teamData?.team_stats?.sort((a, b) =>
    b.productivity_score - a.productivity_score
  ) || [];

  if (loading) {
    return (
      <div className="team-dashboard">
        <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
        <div className="loading-state">
          <p>Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-dashboard">
        <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchTeamData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="team-dashboard">
        <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
        <p className="text-gray-600">No team data available.</p>
      </div>
    );
  }

  return (
    <div className="team-dashboard bg-white rounded-lg shadow-md p-6">
      <div className="dashboard-header mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Team Performance Dashboard</h3>
        <p className="text-sm text-gray-600">
          {teamData.date} • {teamData.summary.total_users} team members
        </p>
      </div>

      {/* Team Summary Cards */}
      <div className="team-summary-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="summary-card bg-blue-50 p-4 rounded-lg">
          <div className="card-label text-sm text-blue-600 font-medium">Team Productivity</div>
          <div className="card-value text-2xl font-bold text-blue-800">
            {formatPercentage(teamData.summary.team_productivity_score)}
          </div>
          <div className="card-subtitle text-xs text-blue-600">
            {getProductivityLabel(teamData.summary.team_productivity_score)}
          </div>
        </div>

        <div className="summary-card bg-green-50 p-4 rounded-lg">
          <div className="card-label text-sm text-green-600 font-medium">Total Active Time</div>
          <div className="card-value text-2xl font-bold text-green-800">
            {formatDuration(teamData.summary.total_active_duration)}
          </div>
          <div className="card-subtitle text-xs text-green-600">
            Across all members
          </div>
        </div>

        <div className="summary-card bg-purple-50 p-4 rounded-lg">
          <div className="card-label text-sm text-purple-600 font-medium">Avg Active per User</div>
          <div className="card-value text-2xl font-bold text-purple-800">
            {formatDuration(teamData.summary.avg_active_duration)}
          </div>
          <div className="card-subtitle text-xs text-purple-600">
            Per team member
          </div>
        </div>

        <div className="summary-card bg-orange-50 p-4 rounded-lg">
          <div className="card-label text-sm text-orange-600 font-medium">Avg Session Time</div>
          <div className="card-value text-2xl font-bold text-orange-800">
            {formatDuration(teamData.summary.avg_session_duration)}
          </div>
          <div className="card-subtitle text-xs text-orange-600">
            Including idle time
          </div>
        </div>
      </div>

      {/* Individual Team Member Performance */}
      <div className="team-members-section">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Individual Performance</h4>

        <div className="team-members-list space-y-3">
          {sortedTeamStats.map((member, index) => (
            <div key={member.username} className="team-member-card bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="member-header flex items-center justify-between mb-3">
                <div className="member-info">
                  <div className="member-name font-medium text-gray-800">
                    #{index + 1} {member.username}
                  </div>
                  <div className="member-computer text-xs text-gray-500">
                    {member.computer_name}
                  </div>
                </div>

                <div className={`productivity-badge px-3 py-1 rounded-full text-sm font-medium ${getProductivityColor(member.productivity_score)}`}>
                  {formatPercentage(member.productivity_score)}
                </div>
              </div>

              <div className="member-stats grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="stat-label text-gray-600">Active Time:</span>
                  <div className="stat-value font-medium text-gray-800">
                    {formatDuration(member.total_active_duration)}
                  </div>
                </div>

                <div>
                  <span className="stat-label text-gray-600">Idle Time:</span>
                  <div className="stat-value font-medium text-gray-800">
                    {formatDuration(member.total_idle_duration)}
                  </div>
                </div>

                <div>
                  <span className="stat-label text-gray-600">First Logon:</span>
                  <div className="stat-value font-medium text-gray-800">
                    {member.first_logon ? new Date(member.first_logon).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </div>
                </div>

                <div>
                  <span className="stat-label text-gray-600">Last Activity:</span>
                  <div className="stat-value font-medium text-gray-800">
                    {member.last_activity ? new Date(member.last_activity).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Progress bar for visual representation */}
              <div className="member-progress mt-3">
                <div className="progress-bar bg-gray-200 rounded-full h-2">
                  <div
                    className="progress-fill bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(member.productivity_score, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Insights */}
      <div className="team-insights mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3">Team Insights</h4>
        <div className="insights-grid grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="insight-item">
            <span className="insight-label text-gray-600">Top Performer:</span>
            <span className="insight-value ml-1 font-medium text-gray-800">
              {sortedTeamStats[0]?.username || 'N/A'} ({formatPercentage(sortedTeamStats[0]?.productivity_score || 0)})
            </span>
          </div>

          <div className="insight-item">
            <span className="insight-label text-gray-600">Team Average:</span>
            <span className="insight-value ml-1 font-medium text-gray-800">
              {formatPercentage(teamData.summary.team_productivity_score)}
            </span>
          </div>

          <div className="insight-item">
            <span className="insight-label text-gray-600">Most Active User:</span>
            <span className="insight-value ml-1 font-medium text-gray-800">
              {sortedTeamStats.reduce((max, member) =>
                member.total_active_duration > (max?.total_active_duration || 0) ? member : max
              )?.username || 'N/A'}
            </span>
          </div>

          <div className="insight-item">
            <span className="insight-label text-gray-600">Early Bird:</span>
            <span className="insight-value ml-1 font-medium text-gray-800">
              {sortedTeamStats.reduce((earliest, member) => {
                if (!member.first_logon) return earliest;
                if (!earliest || !earliest.first_logon) return member;
                return new Date(member.first_logon) < new Date(earliest.first_logon) ? member : earliest;
              })?.username || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
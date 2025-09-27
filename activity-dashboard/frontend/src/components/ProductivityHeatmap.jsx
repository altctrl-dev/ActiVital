import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function ProductivityHeatmap({ username, date }) {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username && date) {
      fetchHeatmapData();
    }
  }, [username, date]);

  const fetchHeatmapData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.fetchActivityHeatmap(username, date);
      setHeatmapData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity <= 25) return 'bg-green-200';
    if (intensity <= 50) return 'bg-green-300';
    if (intensity <= 75) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getIntensityLabel = (intensity) => {
    if (intensity === 0) return 'No Activity';
    if (intensity <= 25) return 'Low Activity';
    if (intensity <= 50) return 'Moderate Activity';
    if (intensity <= 75) return 'High Activity';
    return 'Peak Activity';
  };

  const formatHour = (hour) => {
    const h = parseInt(hour);
    if (h === 0) return '12 AM';
    if (h < 12) return `${h} AM`;
    if (h === 12) return '12 PM';
    return `${h - 12} PM`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString());

  if (loading) {
    return (
      <div className="heatmap-container">
        <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
        <div className="loading-state">
          <p>Loading heatmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="heatmap-container">
        <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchHeatmapData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  if (!heatmapData) {
    return (
      <div className="heatmap-container">
        <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
        <p className="text-gray-600">No heatmap data available.</p>
      </div>
    );
  }

  return (
    <div className="heatmap-container bg-white rounded-lg shadow-md p-6">
      <div className="heatmap-header mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Activity Heatmap</h3>
        <p className="text-sm text-gray-600">
          Activity intensity by hour for {heatmapData.username} on {heatmapData.date}
        </p>
        {heatmapData.peak_hour && (
          <p className="text-sm text-blue-600 font-medium">
            Peak activity: {formatHour(heatmapData.peak_hour)}
          </p>
        )}
      </div>

      {/* Heatmap Grid */}
      <div className="heatmap-grid mb-6">
        <div className="grid grid-cols-12 gap-1 mb-4">
          {hours.map(hour => {
            const intensity = heatmapData.heatmap_data[hour] || 0;
            return (
              <div
                key={hour}
                className={`heatmap-cell ${getIntensityColor(intensity)} rounded-sm border border-gray-200 transition-all hover:scale-110 cursor-pointer`}
                style={{
                  aspectRatio: '1',
                  minHeight: '32px'
                }}
                title={`${formatHour(hour)}: ${intensity.toFixed(1)}% activity`}
              >
                <div className="cell-content h-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {parseInt(hour) % 6 === 0 ? parseInt(hour) : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hour Labels */}
        <div className="hour-labels grid grid-cols-12 gap-1 text-xs text-gray-500">
          {[0, 6, 12, 18].map(hour => (
            <div key={hour} className={`text-center ${hour === 0 ? 'col-span-1' : hour === 6 ? 'col-start-7' : hour === 12 ? 'col-start-1' : 'col-start-7'}`}>
              {hour === 0 && '12 AM'}
              {hour === 6 && '6 AM'}
              {hour === 12 && '12 PM'}
              {hour === 18 && '6 PM'}
            </div>
          ))}
        </div>
      </div>

      {/* Intensity Legend */}
      <div className="heatmap-legend mb-6">
        <div className="legend-title text-sm font-medium text-gray-700 mb-2">Activity Intensity</div>
        <div className="legend-scale flex items-center space-x-2">
          <span className="text-xs text-gray-500">Less</span>
          <div className="scale-boxes flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm" title="No Activity"></div>
            <div className="w-3 h-3 bg-green-200 rounded-sm" title="Low Activity"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm" title="Moderate Activity"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm" title="High Activity"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm" title="Peak Activity"></div>
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="activity-breakdown grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="breakdown-item bg-blue-50 p-3 rounded-lg">
          <div className="item-label text-xs text-blue-600 font-medium">Peak Hour</div>
          <div className="item-value text-lg font-bold text-blue-800">
            {formatHour(heatmapData.peak_hour)}
          </div>
          <div className="item-intensity text-xs text-blue-600">
            {heatmapData.heatmap_data[heatmapData.peak_hour]?.toFixed(1)}% intensity
          </div>
        </div>

        <div className="breakdown-item bg-green-50 p-3 rounded-lg">
          <div className="item-label text-xs text-green-600 font-medium">Active Hours</div>
          <div className="item-value text-lg font-bold text-green-800">
            {Object.values(heatmapData.heatmap_data).filter(val => val > 0).length}
          </div>
          <div className="item-subtitle text-xs text-green-600">
            Hours with activity
          </div>
        </div>

        <div className="breakdown-item bg-yellow-50 p-3 rounded-lg">
          <div className="item-label text-xs text-yellow-600 font-medium">Average Intensity</div>
          <div className="item-value text-lg font-bold text-yellow-800">
            {(Object.values(heatmapData.heatmap_data).reduce((sum, val) => sum + val, 0) / 24).toFixed(1)}%
          </div>
          <div className="item-subtitle text-xs text-yellow-600">
            Across all hours
          </div>
        </div>

        <div className="breakdown-item bg-purple-50 p-3 rounded-lg">
          <div className="item-label text-xs text-purple-600 font-medium">Work Pattern</div>
          <div className="item-value text-lg font-bold text-purple-800">
            {(() => {
              const peakHour = parseInt(heatmapData.peak_hour);
              if (peakHour >= 6 && peakHour < 12) return 'Morning';
              if (peakHour >= 12 && peakHour < 18) return 'Afternoon';
              if (peakHour >= 18 && peakHour < 22) return 'Evening';
              return 'Night';
            })()}
          </div>
          <div className="item-subtitle text-xs text-purple-600">
            Peak activity time
          </div>
        </div>
      </div>

      {/* Hourly Breakdown Table */}
      <div className="hourly-breakdown mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Hourly Activity Details</h4>
        <div className="breakdown-table bg-gray-50 rounded-lg p-4">
          <div className="table-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
            {hours.map(hour => {
              const intensity = heatmapData.heatmap_data[hour] || 0;
              return (
                <div key={hour} className="table-row flex justify-between items-center p-2 bg-white rounded border">
                  <span className="hour-label font-medium text-gray-700">
                    {formatHour(hour)}
                  </span>
                  <span className={`intensity-value px-2 py-1 rounded text-xs font-medium ${
                    intensity > 75 ? 'bg-green-100 text-green-800' :
                    intensity > 50 ? 'bg-blue-100 text-blue-800' :
                    intensity > 25 ? 'bg-yellow-100 text-yellow-800' :
                    intensity > 0 ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {intensity.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
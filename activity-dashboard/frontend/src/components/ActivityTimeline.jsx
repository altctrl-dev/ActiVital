import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function ActivityTimeline({ username, date }) {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username && date) {
      fetchTimeline();
    }
  }, [username, date]);

  const fetchTimeline = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.fetchActivityTimeline(username, date);
      setTimeline(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (eventType) => {
    const colors = {
      'Logon': 'bg-green-500',
      'Logoff': 'bg-red-500',
      'Active': 'bg-blue-500',
      'Idle Started': 'bg-yellow-500',
      'Lock': 'bg-orange-500',
      'Unlock': 'bg-green-400',
      'Service Started': 'bg-purple-500'
    };
    return colors[eventType] || 'bg-gray-500';
  };

  const getEventIcon = (eventType) => {
    const icons = {
      'Logon': '🟢',
      'Logoff': '🔴',
      'Active': '⚡',
      'Idle Started': '💤',
      'Lock': '🔒',
      'Unlock': '🔓',
      'Service Started': '⚙️'
    };
    return icons[eventType] || '📌';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupEventsByHour = (events) => {
    const groups = {};
    events.forEach(event => {
      const hour = event.hour;
      if (!groups[hour]) {
        groups[hour] = [];
      }
      groups[hour].push(event);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="timeline-container">
        <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
        <div className="loading-state">
          <p>Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-container">
        <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchTimeline} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  if (!timeline || !timeline.timeline.length) {
    return (
      <div className="timeline-container">
        <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
        <p className="text-gray-600">No activity data available for this date.</p>
      </div>
    );
  }

  const hourlyGroups = groupEventsByHour(timeline.timeline);

  return (
    <div className="timeline-container bg-white rounded-lg shadow-md p-6">
      <div className="timeline-header mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Activity Timeline</h3>
        <p className="text-sm text-gray-600">
          {timeline.event_count} events on {timeline.date}
        </p>
      </div>

      <div className="timeline-content space-y-6">
        {Object.keys(hourlyGroups)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(hour => (
            <div key={hour} className="hourly-group">
              <div className="hour-label text-sm font-medium text-gray-700 mb-3">
                {parseInt(hour)}:00 - {parseInt(hour) + 1}:00
              </div>

              <div className="events-in-hour space-y-2">
                {hourlyGroups[hour].map((event, index) => (
                  <div key={index} className="timeline-event flex items-center space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <div className={`event-indicator w-3 h-3 rounded-full ${getEventColor(event.event_type)}`}></div>

                    <div className="event-icon text-lg">
                      {getEventIcon(event.event_type)}
                    </div>

                    <div className="event-details flex-grow">
                      <div className="event-type font-medium text-gray-800">
                        {event.event_type}
                      </div>
                      <div className="event-time text-sm text-gray-600">
                        {formatTime(event.timestamp)}
                      </div>
                    </div>

                    <div className="computer-name text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {event.computer_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="timeline-summary mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-800 mb-2">Summary</h4>
        <div className="summary-stats grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600 font-medium">Total Events:</span>
            <span className="ml-1">{timeline.event_count}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Active Hours:</span>
            <span className="ml-1">{Object.keys(hourlyGroups).length}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">User:</span>
            <span className="ml-1">{timeline.username}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Date:</span>
            <span className="ml-1">{timeline.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
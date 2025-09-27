const API_BASE_URL = 'http://localhost:5001';

class ApiService {
  async fetchUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchDailyStats(username, date) {
    const response = await fetch(`${API_BASE_URL}/stats/daily?user=${encodeURIComponent(username)}&date=${date}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No data found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchWeeklyStats(username, week) {
    const response = await fetch(`${API_BASE_URL}/stats/weekly?user=${encodeURIComponent(username)}&week=${week}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No data found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchMonthlyStats(username, month) {
    const response = await fetch(`${API_BASE_URL}/stats/monthly?user=${encodeURIComponent(username)}&month=${month}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No data found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Advanced Analytics Endpoints
  async fetchActivityTimeline(username, date) {
    const response = await fetch(`${API_BASE_URL}/analytics/timeline?user=${encodeURIComponent(username)}&date=${date}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchTeamSummary(date = null) {
    const url = date
      ? `${API_BASE_URL}/analytics/team-summary?date=${date}`
      : `${API_BASE_URL}/analytics/team-summary`;

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchProductivityTrends(username, days = 30) {
    const response = await fetch(`${API_BASE_URL}/analytics/productivity-trends?user=${encodeURIComponent(username)}&days=${days}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchActivityHeatmap(username, date) {
    const response = await fetch(`${API_BASE_URL}/analytics/activity-heatmap?user=${encodeURIComponent(username)}&date=${date}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchBreakPatterns(username, date) {
    const response = await fetch(`${API_BASE_URL}/analytics/break-patterns?user=${encodeURIComponent(username)}&date=${date}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async fetchFocusScore(username, date) {
    const response = await fetch(`${API_BASE_URL}/analytics/focus-score?user=${encodeURIComponent(username)}&date=${date}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}

export const apiService = new ApiService();
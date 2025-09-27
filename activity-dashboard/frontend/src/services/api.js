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
}

export const apiService = new ApiService();
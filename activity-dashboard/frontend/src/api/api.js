import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000
});

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data.users;
};

export const getDailyStats = async (username, date) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const response = await api.get(`/stats/daily?user=${username}&date=${formattedDate}`);
  return response.data;
};

export const getWeeklyStats = async (username, date) => {
  const weekStr = dayjs(date).format('YYYY-W[W]ww');
  const response = await api.get(`/stats/weekly?user=${username}&week=${weekStr}`);
  return response.data;
};

export const getMonthlyStats = async (username, date) => {
  const monthStr = dayjs(date).format('YYYY-MM');
  const response = await api.get(`/stats/monthly?user=${username}&month=${monthStr}`);
  return response.data;
};

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.message);
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);
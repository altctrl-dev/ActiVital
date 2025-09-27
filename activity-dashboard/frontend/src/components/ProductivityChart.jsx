import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProductivityChart({ data, type = 'line', title, isLoading = false }) {
  const [chartType, setChartType] = useState(type);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        padding: 12,
        displayColors: true
      }
    },
    scales: chartType !== 'doughnut' ? {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderDash: [2, 2]
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderDash: [2, 2]
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280'
        },
        beginAtZero: true
      }
    } : undefined,
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2
      },
      line: {
        tension: 0.4,
        borderWidth: 3
      }
    }
  };

  const getChartData = () => {
    if (!data || !data.trends) return null;

    const labels = data.trends.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    if (chartType === 'doughnut') {
      // For doughnut chart, show latest day's breakdown
      const latestDay = data.trends[data.trends.length - 1];
      return {
        labels: ['Active Time', 'Idle Time'],
        datasets: [{
          data: [
            latestDay.active_duration || 0,
            latestDay.idle_duration || 0
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(156, 163, 175, 0.8)'
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(156, 163, 175, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 4
        }]
      };
    }

    return {
      labels,
      datasets: [
        {
          label: 'Productivity Score',
          data: data.trends.map(item => item.productivity_score),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: chartType === 'line',
          tension: 0.4
        },
        {
          label: 'Active Hours',
          data: data.trends.map(item => (item.active_duration / 60).toFixed(1)),
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: false,
          tension: 0.4
        }
      ]
    };
  };

  const chartData = getChartData();

  const ChartComponent = {
    line: Line,
    bar: Bar,
    doughnut: Doughnut
  }[chartType];

  if (isLoading) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (!chartData) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-12">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No chart data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded transition-colors ${
                chartType === 'line'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Line Chart"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded transition-colors ${
                chartType === 'bar'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('doughnut')}
              className={`p-2 rounded transition-colors ${
                chartType === 'doughnut'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Pie Chart"
            >
              <PieChart className="w-4 h-4" />
            </button>
          </div>

          <button
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download Chart"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-64 relative">
        <ChartComponent data={chartData} options={chartOptions} />
      </div>

      {data && data.trends && (
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">
              {data.trends.length > 0
                ? Math.round(data.trends[data.trends.length - 1].productivity_score)
                : 0}%
            </div>
            <div className="text-xs text-blue-600 font-medium">Latest Score</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-800">
              {data.trends.length > 0
                ? Math.round(data.trends.reduce((sum, day) => sum + day.productivity_score, 0) / data.trends.length)
                : 0}%
            </div>
            <div className="text-xs text-green-600 font-medium">Average</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-800">
              {data.trends.length}
            </div>
            <div className="text-xs text-purple-600 font-medium">Days Tracked</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
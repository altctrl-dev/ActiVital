import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, TrendingUp, Calendar, Monitor, Zap } from 'lucide-react';
import { formatDuration, formatPercentage } from '../utils/dateUtils';

export default function ModernStatsCard({ title, data, type = 'daily', isLoading = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const getCardIcon = (type) => {
    switch (type) {
      case 'daily': return <Calendar className="w-5 h-5" />;
      case 'weekly': return <TrendingUp className="w-5 h-5" />;
      case 'monthly': return <Activity className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'daily': return 'from-blue-500 to-blue-600';
      case 'weekly': return 'from-green-500 to-green-600';
      case 'monthly': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`bg-gradient-to-r ${getCardColor(type)} p-4`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg text-white">
              {getCardIcon(type)}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>
        <div className="p-6 text-center text-gray-500">
          <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No data available</p>
        </div>
      </motion.div>
    );
  }

  const renderDailyStats = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">Active Time</span>
          </div>
          <div className="text-xl font-bold text-blue-800">
            {formatDuration(data.total_active_duration)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-600">Idle Time</span>
          </div>
          <div className="text-xl font-bold text-gray-800">
            {formatDuration(data.total_idle_duration)}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">First Logon</span>
          <span className="text-sm font-medium text-gray-800">
            {data.first_logon ? new Date(data.first_logon).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Last Activity</span>
          <span className="text-sm font-medium text-gray-800">
            {data.last_activity ? new Date(data.last_activity).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Total Session</span>
          <span className="text-sm font-medium text-gray-800">
            {formatDuration(data.total_session_duration)}
          </span>
        </div>
      </div>
    </div>
  );

  const renderWeeklyStats = () => (
    <div className="space-y-4">
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-3xl font-bold text-green-800 mb-1">
          {formatPercentage(data.productivity_score)}
        </div>
        <div className="text-sm text-green-600 font-medium">Productivity Score</div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Week</span>
          <span className="text-sm font-medium text-gray-800">
            {data.year}-W{data.week.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Total Active</span>
          <span className="text-sm font-medium text-gray-800">
            {formatDuration(data.total_active_duration)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Avg Daily Active</span>
          <span className="text-sm font-medium text-gray-800">
            {formatDuration(data.avg_daily_active_duration)}
          </span>
        </div>
      </div>
    </div>
  );

  const renderMonthlyStats = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-800 mb-1">
            {formatPercentage(data.productivity_score)}
          </div>
          <div className="text-xs text-purple-600 font-medium">Productivity</div>
        </div>
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-800 mb-1">
            {data.total_days_active}
          </div>
          <div className="text-xs text-indigo-600 font-medium">Active Days</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Month</span>
          <span className="text-sm font-medium text-gray-800">
            {data.year}-{data.month.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Total Active</span>
          <span className="text-sm font-medium text-gray-800">
            {formatDuration(data.total_active_duration)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Avg Daily Active</span>
          <span className="text-sm font-medium text-gray-800">
            {formatDuration(data.avg_daily_active_duration)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
    >
      <div className={`bg-gradient-to-r ${getCardColor(type)} p-4`}>
        <div className="flex items-center space-x-3">
          <motion.div 
            className="p-2 bg-white/20 rounded-lg text-white"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {getCardIcon(type)}
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-white/80 text-sm">{data.computer_name}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {type === 'daily' && renderDailyStats()}
        {type === 'weekly' && renderWeeklyStats()}
        {type === 'monthly' && renderMonthlyStats()}
      </div>
    </motion.div>
  );
}
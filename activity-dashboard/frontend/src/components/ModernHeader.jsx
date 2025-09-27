import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Bell,
  Settings,
  Download,
  RefreshCw,
  Moon,
  Sun,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function ModernHeader({
  selectedUser,
  selectedDate,
  onRefresh,
  isRefreshing = false,
  lastUpdated = null
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (\n    <motion.header \n      className=\"bg-white shadow-sm border-b border-gray-200 px-6 py-4\"\n      initial={{ opacity: 0, y: -20 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.3 }}\n    >\n      <div className=\"max-w-7xl mx-auto\">\n        {/* Top Row */}\n        <div className=\"flex items-center justify-between mb-4\">\n          <div className=\"flex items-center space-x-4\">\n            <motion.div \n              className=\"flex items-center space-x-3\"\n              whileHover={{ scale: 1.02 }}\n              transition={{ type: \"spring\", stiffness: 400, damping: 17 }}\n            >\n              <div className=\"p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg\">\n                <Activity className=\"w-6 h-6 text-white\" />\n              </div>\n              <div>\n                <h1 className=\"text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent\">\n                  ActiVital Pro\n                </h1>\n                <p className=\"text-sm text-gray-500\">Advanced Productivity Analytics</p>\n              </div>\n            </motion.div>\n          </div>\n\n          <div className=\"flex items-center space-x-4\">\n            {/* Live Clock */}\n            <div className=\"hidden md:flex items-center space-x-2 text-sm text-gray-600\">\n              <Calendar className=\"w-4 h-4\" />\n              <span>{currentTime.toLocaleDateString()}</span>\n              <span className=\"font-mono\">{currentTime.toLocaleTimeString()}</span>\n            </div>\n\n            {/* Action Buttons */}\n            <div className=\"flex items-center space-x-2\">\n              <motion.button\n                onClick={onRefresh}\n                disabled={isRefreshing}\n                className=\"p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors\"\n                whileHover={{ scale: 1.05 }}\n                whileTap={{ scale: 0.95 }}\n                title=\"Refresh Data\"\n              >\n                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />\n              </motion.button>\n\n              <motion.button\n                className=\"p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors\"\n                whileHover={{ scale: 1.05 }}\n                whileTap={{ scale: 0.95 }}\n                title=\"Download Report\"\n              >\n                <Download className=\"w-5 h-5\" />\n              </motion.button>\n\n              <motion.button\n                className=\"p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors relative\"\n                whileHover={{ scale: 1.05 }}\n                whileTap={{ scale: 0.95 }}\n                title=\"Notifications\"\n              >\n                <Bell className=\"w-5 h-5\" />\n                <span className=\"absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center\">\n                  <span className=\"w-1.5 h-1.5 bg-white rounded-full\"></span>\n                </span>\n              </motion.button>\n\n              <motion.button\n                onClick={() => setIsDarkMode(!isDarkMode)}\n                className=\"p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors\"\n                whileHover={{ scale: 1.05 }}\n                whileTap={{ scale: 0.95 }}\n                title=\"Toggle Theme\"\n              >\n                {isDarkMode ? <Sun className=\"w-5 h-5\" /> : <Moon className=\"w-5 h-5\" />}\n              </motion.button>\n\n              <motion.button\n                className=\"p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors\"\n                whileHover={{ scale: 1.05 }}\n                whileTap={{ scale: 0.95 }}\n                title=\"Settings\"\n              >\n                <Settings className=\"w-5 h-5\" />\n              </motion.button>\n            </div>\n          </div>\n        </div>\n\n        {/* Status Bar */}\n        <div className=\"flex items-center justify-between text-sm\">\n          <div className=\"flex items-center space-x-6\">\n            {selectedUser && (\n              <div className=\"flex items-center space-x-2\">\n                <Users className=\"w-4 h-4 text-blue-600\" />\n                <span className=\"text-gray-600\">User:</span>\n                <span className=\"font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded\">\n                  {selectedUser}\n                </span>\n              </div>\n            )}\n            \n            {selectedDate && (\n              <div className=\"flex items-center space-x-2\">\n                <Calendar className=\"w-4 h-4 text-green-600\" />\n                <span className=\"text-gray-600\">Date:</span>\n                <span className=\"font-medium text-gray-900 bg-green-50 px-2 py-1 rounded\">\n                  {new Date(selectedDate).toLocaleDateString('en-US', { \n                    weekday: 'short', \n                    year: 'numeric', \n                    month: 'short', \n                    day: 'numeric' \n                  })}\n                </span>\n              </div>\n            )}\n          </div>\n\n          <div className=\"flex items-center space-x-4 text-xs text-gray-500\">\n            <div className=\"flex items-center space-x-2\">\n              <div className=\"w-2 h-2 bg-green-500 rounded-full animate-pulse\"></div>\n              <span>Live Data</span>\n            </div>\n            <span>Updated {formatLastUpdated()}</span>\n            <div className=\"flex items-center space-x-1\">\n              <BarChart3 className=\"w-3 h-3\" />\n              <span>Analytics Active</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </motion.header>\n  );\n}
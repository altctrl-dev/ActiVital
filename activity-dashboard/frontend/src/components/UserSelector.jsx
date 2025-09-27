import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function UserSelector({ selectedUser, onUserChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchUsers();
      setUsers(data.users || []);

      // Auto-select first user if none selected
      if (!selectedUser && data.users && data.users.length > 0) {
        onUserChange(data.users[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="user-selector loading">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="user-selector error">
        <span>Error loading users: {error}</span>
        <button onClick={fetchUsers}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-selector">
      <label htmlFor="user-select">Select User:</label>
      <select
        id="user-select"
        value={selectedUser || ''}
        onChange={(e) => onUserChange(e.target.value)}
      >
        <option value="">-- Select a user --</option>
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>
    </div>
  );
}
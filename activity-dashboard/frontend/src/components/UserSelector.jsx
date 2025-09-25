import React, { useState, useEffect } from 'react';
import { getUsers } from '../api/api';

const UserSelector = ({ onUserChange }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
        if (userList.length > 0) {
          setSelectedUser(userList[0]);
          onUserChange(userList[0]);
        }
      } catch (err) {
        setError('Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [onUserChange]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-64">
      <label htmlFor="user" className="block text-sm font-medium text-gray-700">
        Select User
      </label>
      <select
        id="user"
        value={selectedUser}
        onChange={(e) => {
          setSelectedUser(e.target.value);
          onUserChange(e.target.value);
        }}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;
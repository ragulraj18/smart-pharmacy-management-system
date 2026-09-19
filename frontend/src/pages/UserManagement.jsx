import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminTable.css';
 
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/users');
    setUsers(data.users);
    setLoading(false);
  };
 
  useEffect(() => { fetchUsers(); }, []);
 
  const toggleActive = async (user) => {
    await api.put(`/admin/users/${user._id}`, { isActive: !user.isActive });
    fetchUsers();
  };
 
  if (loading) return <LoadingSpinner message="Loading users..." />;
 
  return (
    <div className="container admin-table-page">
      <h1 className="section-title">User Management</h1>
      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => toggleActive(u)}>
                    {u.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
export default UserManagement;
 

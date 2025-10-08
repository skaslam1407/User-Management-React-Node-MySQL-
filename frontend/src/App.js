import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({}); // new state for validation errors

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/users`);
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- Form Validation ---
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Email is invalid';
    }
    if (!form.age) {
      errs.age = 'Age is required';
    } else if (form.age <= 0) {
      errs.age = 'Age must be greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop submission if validation fails

    if (editId) {
      await axios.put(`${API_URL}/users/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(`${API_URL}/users`, form);
    }

    setForm({ name: '', email: '', age: '' });
    setErrors({});
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/users/${id}`);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email, age: user.age });
    setErrors({});
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>User Management (React + Node + MySQL)</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.name ? '1px solid #dc3545' : '1px solid #ccc' }}
          />
          {errors.name && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.name}</span>}
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.email ? '1px solid #dc3545' : '1px solid #ccc' }}
          />
          {errors.email && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div style={{ width: '100px' }}>
          <input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.age ? '1px solid #dc3545' : '1px solid #ccc' }}
          />
          {errors.age && <span style={{ color: '#dc3545', fontSize: '12px' }}>{errors.age}</span>}
        </div>

        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: editId ? '#ffc107' : '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}>
          {editId ? 'Update' : 'Add'} User
        </button>
      </form>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#007bff', color: '#fff' }}>
          <tr>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Email</th>
            <th style={{ padding: '12px' }}>Age</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ textAlign: 'center', borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px' }}>{u.id}</td>
              <td style={{ padding: '10px' }}>{u.name}</td>
              <td style={{ padding: '10px' }}>{u.email}</td>
              <td style={{ padding: '10px' }}>{u.age}</td>
              <td style={{ padding: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={() => handleEdit(u)} style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#fff' }}>Edit</button>
                <button onClick={() => handleDelete(u.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#fff' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// code flow
const UserForm = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: user?.id, name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    // Fetch data from API
    axios.get('http://localhost:8080/api/users/list')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        setError('Error fetching users');
        console.error(err);
      });
  }, []);

  const handleDelete = (userId) => {
    axios.delete(`http://localhost:8080/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(err => {
        setError('Error deleting user');
        console.error(err);
      });
  };

  const handleSave = (user) => {
    if (user.id) {
      // Update user
      axios.put(`http://localhost:8080/api/users/${user.id}`, user)
        .then(response => {
          setUsers(users.map(u => (u.id === user.id ? response.data : u)));
          setEditingUser(null);
          setShowForm(false);
        })
        .catch(err => {
          setError('Error updating user');
          console.error(err);
        });
    } else {
      // Add new user
      axios.post('http://localhost:8080/api/users/create', user)
        .then(response => {
          setUsers([...users, response.data]);
          setNewUser(null);
          setShowForm(false);
        })
        .catch(err => {
          setError('Error adding user');
          console.error(err);
        });
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setNewUser({});
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setNewUser(null);
    setShowForm(false);
  };

  return (
    <div>
      <h2>User List</h2>
      {error && <p>{error}</p>}
      <button onClick={handleAddNew}>Add New User</button>
      {showForm && (
        <UserForm
          user={editingUser || newUser}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <ul>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.id}>
              {user.name} - {user.email}
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
};

export default UserList;

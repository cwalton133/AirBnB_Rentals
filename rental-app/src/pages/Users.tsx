// Step 12: Create a Users page component
// src/pages/Users.tsx

import React, { useState } from 'react'
import UserForm from '../components/UserForm'

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'guest' }
  ])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newUser = {
      ...userData,
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1
    }
    
    setUsers([...users, newUser as User])
    setShowForm(false)
  }

  const handleUpdateUser = (userData: User) => {
    setUsers(users.map(user => 
      user.id === userData.id ? userData : user
    ))
    setEditingUser(null)
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'user': return 'bg-primary';
      case 'guest': return 'bg-secondary';
      default: return 'bg-light';
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users</h2>
        <button 
          className="btn btn-success" 
          onClick={() => {
            setEditingUser(null)
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>
      
      {(showForm || editingUser) && (
        <div className="card mb-4">
          <div className="card-header">
            {editingUser ? 'Edit User' : 'Add New User'}
          </div>
          <div className="card-body">
            <UserForm 
              onSubmit={editingUser ? handleUpdateUser : handleAddUser}
              initialUser={editingUser || undefined}
            />
          </div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => {
                      setEditingUser(user)
                      setShowForm(false)
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
// Step 11: Create a User Form component
// src/components/UserForm.tsx

import React, { useState } from 'react'

interface User {
  id?: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface UserFormProps {
  onSubmit: (user: User) => void;
  initialUser?: User;
}

const defaultUser: User = {
  name: '',
  email: '',
  role: 'user'
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialUser = defaultUser }) => {
  const [user, setUser] = useState<User>(initialUser)
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof User, string>> = {}
    
    if (!user.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!user.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(user)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="role" className="form-label">Role</label>
        <select
          className="form-select"
          id="role"
          name="role"
          value={user.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
      </div>
      
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}

export default UserForm
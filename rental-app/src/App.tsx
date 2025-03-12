// Step 14: Set up routing
// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Users from './pages/Users'
import NavBar from './components/NavBar'
import Card from './components/Card'

function App() {
  const navLinks = [
    { text: 'Home', href: '/', active: true },
    { text: 'Users', href: '/users' },
    { text: 'About', href: '/about' }
  ]

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">React + Bootstrap</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        <div className="container">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/about" element={
              <div className="p-5 bg-light rounded-3">
                <h1>About</h1>
                <p>This is a simple React application built with Vite, TypeScript, and Bootstrap.</p>
              </div>
            } />
            <Route path="/" element={
              <>
                <div className="p-5 mb-4 bg-light rounded-3">
                  <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Hello Bootstrap + React + TypeScript!</h1>
                    <p className="col-md-8 fs-4">
                      This is a simple application built with React, TypeScript, and Bootstrap using Vite.
                    </p>
                    <Link className="btn btn-primary btn-lg" to="/users">Manage Users</Link>
                  </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
                  <div className="col">
                    <Card 
                      title="React" 
                      description="A JavaScript library for building user interfaces"
                      buttonText="React Docs"
                      onButtonClick={() => window.open('https://reactjs.org', '_blank')}
                    />
                  </div>
                  <div className="col">
                    <Card 
                      title="TypeScript" 
                      description="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript"
                      buttonText="TypeScript Docs"
                      buttonVariant="success"
                      onButtonClick={() => window.open('https://www.typescriptlang.org', '_blank')}
                    />
                  </div>
                  <div className="col">
                    <Card 
                      title="Bootstrap" 
                      description="A popular CSS framework for building responsive and mobile-first websites"
                      buttonText="Bootstrap Docs"
                      buttonVariant="info"
                      onButtonClick={() => window.open('https://getbootstrap.com', '_blank')}
                    />
                  </div>
                </div>
              </>
            } />
          </Routes>

          <footer className="pt-3 mt-4 text-muted border-top">
            &copy; 2025
          </footer>
        </div>
      </div>
    </Router>
  )
}

export default App
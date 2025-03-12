// Step 6: Import Bootstrap in main.tsx
// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
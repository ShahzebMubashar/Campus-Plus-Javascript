// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Optional, only if you have a global stylesheet
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap globally

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

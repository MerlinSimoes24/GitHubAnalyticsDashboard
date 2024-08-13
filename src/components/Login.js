import React from 'react';
import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3000/oauth-callback';

export default function Login() {
  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f0f0f0', // Light gray background
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#333', // Dark gray button color
    color: '#fff', // White text color
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1>Login to GitHub Analytics Dashboard</h1>
      <button style={buttonStyle} onClick={handleLogin}>
        Login with GitHub
      </button>
    </div>
  );
}

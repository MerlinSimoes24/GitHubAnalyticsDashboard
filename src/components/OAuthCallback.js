import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GITHUB_CLIENT_SECRET;

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios.post(`https://github.com/login/oauth/access_token`, {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      }, {
        headers: {
          'Access-Control-Allow-Origin': "*",
          Accept: 'application/json',
        },
      }).then(response => {
        const accessToken = response.data.access_token;
        // Save the access token in localStorage or Context API
        localStorage.setItem('github_access_token', accessToken);
        navigate('/dashboard');
      }).catch(error => {
        console.error('Error exchanging auth code for token', error);
        // Handle error
      });
    }
  }, [navigate]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f0f0f0', // Light gray background
  };

  const loadingStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333', // Dark gray text color
  };

  return (
    <div style={containerStyle}>
      <h1>Authorizing...</h1>
      <div style={loadingStyle}>Please wait while we authenticate your request.</div>
    </div>
  );
}

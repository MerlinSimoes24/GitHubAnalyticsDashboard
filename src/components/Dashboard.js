import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCog } from 'react-icons/fa';
import './Dashboard.css'; // Import your CSS file for styling

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [displayOptions, setDisplayOptions] = useState({
    id: true,
    name: true,
    owner: true,
    url: true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('github_access_token');
    if (accessToken) {
      axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }).then(response => {
        setRepos(response.data);
      }).catch(error => {
        console.error('Error fetching repositories', error);
      });
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const toggleDisplayOption = option => {
    setDisplayOptions(prevOptions => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    background: isDarkMode ? '#2c3e50' : '#ecf0f1',
    color: isDarkMode ? '#ecf0f1' : '#333',
  };

  const thStyle = {
    background: isDarkMode ? '#3498db' : '#2980b9',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    display: displayOptions.id || displayOptions.name || displayOptions.owner || displayOptions.url ? 'table-cell' : 'none',
  };

  const linkStyle = {
    color: isDarkMode ? '#3498db' : '#2980b9',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '60px',
    right: '20px',
    background: isDarkMode ? '#2c3e50' : '#ecf0f1',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '20px',
    display: isSettingsOpen ? 'block' : 'none',
    zIndex: '1',
    transition: 'all 0.3s ease',
  };

  const settingsButtonStyle = {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    color: isDarkMode ? '#ecf0f1' : '#333',
    textDecoration: 'underline',
  };

  const settingsIconStyle = {
    cursor: 'pointer',
    color: isDarkMode ? '#ecf0f1' : '#333',
    fontSize: '24px',
  };

  const headingStyle = {
    color: isDarkMode ? '#ecf0f1' : '#3498db',
    marginBottom: '20px',
  };

  const logout = () => {
    // Implement your logout functionality here
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={headingStyle}>GitHub Repositories</h1>
        <div style={{ position: 'relative' }}>
          <FaCog style={settingsIconStyle} onClick={toggleSettings} />
          <div style={dropdownStyle}>
            <div style={{ marginBottom: '10px' }}>
              <h2>Settings</h2>
              <div style={{ marginBottom: '10px' }}>
                <button style={settingsButtonStyle} onClick={toggleDarkMode}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
              <div className="display-options">
                <h3>Display Options</h3>
                <div>
                  <span>ID</span>
                  <label className="switch">
                    <input type="checkbox" checked={displayOptions.id} onChange={() => toggleDisplayOption('id')} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div>
                  <span>Name</span>
                  <label className="switch">
                    <input type="checkbox" checked={displayOptions.name} onChange={() => toggleDisplayOption('name')} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div>
                  <span>Owner</span>
                  <label className="switch">
                    <input type="checkbox" checked={displayOptions.owner} onChange={() => toggleDisplayOption('owner')} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div>
                  <span>URL</span>
                  <label className="switch">
                    <input type="checkbox" checked={displayOptions.url} onChange={() => toggleDisplayOption('url')} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <button style={settingsButtonStyle} onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {repos.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              {displayOptions.id && <th style={thStyle}>ID</th>}
              {displayOptions.name && <th style={thStyle}>Name</th>}
              {displayOptions.owner && <th style={thStyle}>Owner</th>}
              {displayOptions.url && <th style={thStyle}>URL</th>}
            </tr>
          </thead>
          <tbody>
            {repos.map(repo => (
              <tr key={repo.id}>
                {displayOptions.id && <td style={tdStyle}>{repo.id}</td>}
                {displayOptions.name && <td style={tdStyle}>{repo.name}</td>}
                {displayOptions.owner && <td style={tdStyle}>{repo.owner.login}</td>}
                {displayOptions.url && (
                  <td style={tdStyle}>
                    <a href={`/display-metrics?reponame=${repo.name}&owner=${repo.owner.login}`} style={linkStyle} rel="noopener noreferrer">
                      {repo.html_url}
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No repositories found.</p>
      )}
      <div onClick={closeSettings} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: isSettingsOpen ? '0' : '-1' }}></div>
    </div>
  );
}

import { useState } from 'react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    container: {
      position: 'relative'
    },
    hamburger: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '0.75rem',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '6px'
    },
    line: {
      width: '24px',
      height: '3px',
      backgroundColor: '#374151',
      borderRadius: '2px',
      transition: 'all 0.3s ease'
    },
    menu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 50,
      marginTop: '0.5rem',
      display: 'flex',
      gap: '0.5rem',
      padding: '0.5rem'
    },
    iconButton: (active) => ({
      padding: '0.75rem',
      border: 'none',
      backgroundColor: active ? '#f3f4f6' : 'transparent',
      cursor: 'pointer',
      fontSize: '1.5rem',
      borderRadius: '6px',
      transition: 'background-color 0.2s ease'
    })
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div style={{
          ...styles.line,
          transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none'
        }} />
        <div style={{
          ...styles.line,
          opacity: isOpen ? 0 : 1
        }} />
        <div style={{
          ...styles.line,
          transform: isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'
        }} />
      </button>

      {isOpen && (
        <div style={styles.menu}>
          <button
            style={styles.iconButton(activeTab === 'feed')}
            onClick={() => handleTabChange('feed')}
            title="Content Feed"
          >
            📚
          </button>
          <button
            style={styles.iconButton(activeTab === 'upload')}
            onClick={() => handleTabChange('upload')}
            title="Upload Content"
          >
            📤
          </button>
          <button
            style={styles.iconButton(activeTab === 'profile')}
            onClick={() => handleTabChange('profile')}
            title="My Uploads"
          >
            👤
          </button>
        </div>
      )}
    </div>
  );
}
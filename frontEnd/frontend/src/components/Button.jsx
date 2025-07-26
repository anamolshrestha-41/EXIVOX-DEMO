export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  active = false, 
  onClick, 
  disabled = false,
  ...props 
}) {
  const baseStyles = {
    fontFamily: 'inherit',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    opacity: disabled ? 0.6 : 1,
    outline: 'none'
  };

  const variants = {
    primary: {
      backgroundColor: active ? '#3b82f6' : 'transparent',
      color: active ? 'white' : '#3b82f6',
      border: '2px solid #3b82f6'
    },
    secondary: {
      backgroundColor: active ? '#10b981' : 'transparent',
      color: active ? 'white' : '#10b981',
      border: '2px solid #10b981'
    },
    solid: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: '2px solid #3b82f6'
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' }
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button
      style={styles}
      onClick={onClick}
      disabled={disabled}
      onMouseOver={(e) => !disabled && !active && (e.target.style.backgroundColor = variant === 'primary' ? '#eff6ff' : '#f0fdf4')}
      onMouseOut={(e) => !disabled && !active && (e.target.style.backgroundColor = 'transparent')}
      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)'}
      onBlur={(e) => e.target.style.boxShadow = 'none'}
      {...props}
    >
      {children}
    </button>
  );
}
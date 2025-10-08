export const theme = {
  colors: {
    primary: '#6B73FF',
    secondary: '#9B51E0',
    accent: '#BB6BD9',
    
    // Letter colors
    letter: {
      background: '#FFF8E7',
      border: '#E8D5B7',
      shadow: 'rgba(0, 0, 0, 0.1)',
      text: '#5D4E37',
    },
    
    // Gender specific colors
    male: {
      primary: '#4A90E2',
      secondary: '#357ABD',
      light: '#E3F2FD',
    },
    female: {
      primary: '#E91E63',
      secondary: '#C2185B',
      light: '#FCE4EC',
    },
    
    // General colors
    background: '#F8F9FA',
    white: '#FFFFFF',
    black: '#2C3E50',
    gray: {
      light: '#F5F5F5',
      medium: '#BDC3C7',
      dark: '#7F8C8D',
    },
    
    // Status colors
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
  },
  
  fonts: {
    primary: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    secondary: '"Nanum Pen Script", cursive',
  },
  
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    xxl: '1.5rem',   // 24px
    xxxl: '2rem',    // 32px
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
    xxxl: '4rem',    // 64px
  },
  
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    round: '50%',
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    letter: '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '450ms ease-in-out',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
};
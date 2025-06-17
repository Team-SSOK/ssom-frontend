/**
 * SSOM App Color System
 * Based on the provided SSOM color palette with light and dark mode variations
 */

export const Colors = {
  light: {
    // Neutral Colors
    text: '#2A2C2E',           // Black
    textSecondary: '#71747A',   // Grey
    textMuted: '#959598',       // L. Grey
    background: '#FFFFFF',      // White
    backgroundSecondary: '#F5F7FA', // Silver
    surface: '#E5E5E5',        // Next (Action)
    border: '#F5F7FA',         // Disabled
    white: '#FFFFFF',
    
    // Primary Colors
    primary: '#1C2F5E',        // Primary
    primaryHover: '#152A50',   // Hover
    primaryDisabled: '#D3D4DC', // Disabled
    
    // Color Variations
    shade1: '#1F324D',         // Shade 1
    shade2: '#1F1F42',         // Shade 2  
    shade3: '#082D53',         // Shade 3
    tint1: '#3A5771',          // Tint 1
    tint2: '#4A508A',          // Tint 2
    tint3: '#607A62',          // Tint 3
    
    // Status Colors
    critical: '#E5483E',       // Critical
    warning: '#FF9500',        // Warning
    resolved: '#5BA169',       // Resolved/Success
    error: '#E5483E',          // Same as critical
    success: '#5BA169',        // Same as resolved
    
    // Legacy support (for backward compatibility)
    tint: '#1C2F5E',
    icon: '#71747A',
    tabIconDefault: '#959598',
    tabIconSelected: '#1C2F5E',
    card: '#F5F7FA',
    secondary: '#4A508A',
    danger: '#FF3B30',
    info: '#007AFF',
  },
  dark: {
    // Neutral Colors (Dark Mode)
    text: '#FFFFFF',           // White text on dark background
    textSecondary: '#B0B3B8',  // Lighter grey for secondary text
    textMuted: '#8A8D93',      // Muted text
    background: '#1A1A1A',     // Dark background
    backgroundSecondary: '#2A2C2E', // Slightly lighter dark
    surface: '#3A3A3A',        // Dark surface
    border: '#404040',         // Dark border
    white: '#FFFFFF',
        
    // Primary Colors (Adjusted for dark mode)
    primary: '#4A6FA5',        // Lighter blue for better contrast
    primaryHover: '#5A7FB5',   // Lighter hover state
    primaryDisabled: '#606060', // Dark disabled state
    
    // Color Variations (Adjusted for dark mode)
    shade1: '#3F4A5D',         // Lighter shade 1
    shade2: '#3F3F62',         // Lighter shade 2
    shade3: '#284D73',         // Lighter shade 3
    tint1: '#5A7791',          // Lighter tint 1
    tint2: '#6A70AA',          // Lighter tint 2
    tint3: '#809A82',          // Lighter tint 3
    
    // Status Colors (Adjusted for dark mode)
    critical: '#FF6B6B',       // Softer red for dark mode
    warning: '#FF9F0A',        // Softer orange for dark mode
    resolved: '#7BC97B',       // Softer green for dark mode
    error: '#FF6B6B',          // Same as critical
    success: '#7BC97B',        // Same as resolved
    
    // Legacy support (for backward compatibility)
    tint: '#4A6FA5',
    icon: '#B0B3B8',
    tabIconDefault: '#8A8D93',
    tabIconSelected: '#4A6FA5',
    card: '#1C1E1F',
    secondary: '#6A70AA',
    danger: '#FF453A',
    info: '#0A84FF',
  },
}; 
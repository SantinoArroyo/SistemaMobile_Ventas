// Paleta de colores centralizada para toda la aplicación
export const COLORS = {
  // Colores base
  white: '#ffffff',
  lightGray: '#f8f9fa',
  gray: '#6c757d',
  darkGray: '#495057',
  black: '#000000',
  transparent: 'transparent',
  
  // Colores principales
  celeste: '#00bcd4',
  celesteDark: '#0097a7',
  celesteLight: '#b2ebf2',
  
  naranja: '#ff9800',
  naranjaDark: '#f57c00',
  naranjaLight: '#ffe0b2',
  
  rojizo: '#e53935',
  rojizoDark: '#c62828',
  rojizoLight: '#ffcdd2',
  
  // Estados
  success: '#4caf50',
  successDark: '#388e3c',
  successLight: '#c8e6c9',
  
  warning: '#ff9800',
  warningDark: '#f57c00',
  warningLight: '#ffe0b2',
  
  error: '#f44336',
  errorDark: '#d32f2f',
  errorLight: '#ffcdd2',
  
  info: '#2196f3',
  infoDark: '#1976d2',
  infoLight: '#bbdefb',
  
  // Nuevos colores para mejoras visuales
  purple: '#9c27b0',
  purpleDark: '#7b1fa2',
  purpleLight: '#e1bee7',
  
  teal: '#009688',
  tealDark: '#00796b',
  tealLight: '#b2dfdb',
  
  indigo: '#3f51b5',
  indigoDark: '#303f9f',
  indigoLight: '#c5cae9',
  
  pink: '#e91e63',
  pinkDark: '#c2185b',
  pinkLight: '#f8bbd9',
  
  amber: '#ffc107',
  amberDark: '#ff8f00',
  amberLight: '#ffecb3',
  
  // Gradientes modernos
  primaryGradient: ['#00bcd4', '#0097a7'],
  secondaryGradient: ['#ff9800', '#f57c00'],
  successGradient: ['#4caf50', '#388e3c'],
  warningGradient: ['#ff9800', '#f57c00'],
  errorGradient: ['#f44336', '#d32f2f'],
  
  // Nuevos gradientes atractivos
  sunsetGradient: ['#ff6b6b', '#ffa726'],
  oceanGradient: ['#00bcd4', '#2196f3'],
  forestGradient: ['#4caf50', '#8bc34a'],
  royalGradient: ['#9c27b0', '#3f51b5'],
  fireGradient: ['#ff5722', '#ff9800'],
  coolGradient: ['#00bcd4', '#009688'],
  warmGradient: ['#ff9800', '#ff5722'],
  calmGradient: ['#2196f3', '#00bcd4'],
  
  // Estados de stock
  stockNormal: '#4caf50',
  stockLow: '#ff9800',
  stockCritical: '#f44336',
  stockOut: '#9e9e9e',
};

// Tema claro (por defecto)
export const LIGHT_THEME = {
  ...COLORS,
  background: COLORS.white,
  surface: COLORS.white,
  text: COLORS.black,
  textSecondary: COLORS.gray,
  border: COLORS.lightGray,
  card: COLORS.white,
  input: COLORS.white,
  placeholder: COLORS.gray,
};

// Tema oscuro
export const DARK_THEME = {
  ...COLORS,
  background: '#121212',
  surface: '#1e1e1e',
  text: COLORS.white,
  textSecondary: '#b0b0b0',
  border: '#333333',
  card: '#1e1e1e',
  input: '#2d2d2d',
  placeholder: '#888888',
};

// Sombras para efecto 3D mejoradas
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modal: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  fab: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Nuevas sombras para efectos más dramáticos
  glow: {
    shadowColor: COLORS.celeste,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  depth: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  soft: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
};

// Espaciado consistente
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Bordes redondeados
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
};

// Tipografía
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
};

// Efectos visuales adicionales
export const EFFECTS = {
  // Gradientes lineales
  gradients: {
    primary: ['#00bcd4', '#0097a7'],
    secondary: ['#ff9800', '#f57c00'],
    success: ['#4caf50', '#388e3c'],
    warning: ['#ff9800', '#f57c00'],
    error: ['#f44336', '#d32f2f'],
    sunset: ['#ff6b6b', '#ffa726'],
    ocean: ['#00bcd4', '#2196f3'],
    forest: ['#4caf50', '#8bc34a'],
    royal: ['#9c27b0', '#3f51b5'],
    fire: ['#ff5722', '#ff9800'],
    cool: ['#00bcd4', '#009688'],
    warm: ['#ff9800', '#ff5722'],
    calm: ['#2196f3', '#00bcd4'],
  },
  
  // Bordes con gradientes
  borderGradients: {
    primary: ['#00bcd4', '#0097a7'],
    success: ['#4caf50', '#388e3c'],
    warning: ['#ff9800', '#f57c00'],
    error: ['#f44336', '#d32f2f'],
  },
  
  // Efectos de glassmorphism
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Efectos de neumorphism
  neumorphism: {
    light: {
      shadowColor: COLORS.white,
      shadowOffset: { width: -2, height: -2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 4,
    },
    dark: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
  },
}; 
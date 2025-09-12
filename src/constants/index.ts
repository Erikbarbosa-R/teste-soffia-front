// Constantes da aplicação

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://jsonplaceholder.typicode.com',
  POSTS: '/posts',
  USERS: '/users',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
};

export const STORAGE_KEYS = {
  USER_TOKEN: '@app:user_token',
  USER_DATA: '@app:user_data',
  FAVORITES: '@app:favorites',
  OFFLINE_POSTS: '@app:offline_posts',
};

export const PAGINATION = {
  POSTS_PER_PAGE: 10,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  POST_TITLE_MIN_LENGTH: 3,
  POST_CONTENT_MIN_LENGTH: 10,
};

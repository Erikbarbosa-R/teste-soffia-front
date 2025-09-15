import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VALIDATION_RULES } from '../constants';

// Exportar funções de toast
export * from './toast';

// Utilitários de validação
export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

export const validatePostTitle = (title: string): boolean => {
  return title.trim().length >= VALIDATION_RULES.POST_TITLE_MIN_LENGTH;
};

export const validatePostContent = (content: string): boolean => {
  return content.trim().length >= VALIDATION_RULES.POST_CONTENT_MIN_LENGTH;
};

// Utilitários de formatação
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Agora mesmo';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min atrás`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h atrás`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} dias atrás`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Utilitários de string
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Utilitários de busca
export const searchPosts = (posts: any[], query: string): any[] => {
  if (!query.trim()) return posts;
  
  const searchTerm = query.toLowerCase().trim();
  return posts.filter(post => {
    // Buscar no título
    const titleMatch = post.title?.toLowerCase().includes(searchTerm) || false;
    
    // Buscar no conteúdo
    const contentMatch = post.content?.toLowerCase().includes(searchTerm) || false;
    
    // Buscar no nome do autor
    const authorMatch = (post.author?.name || post.author?.nome || '')
      .toLowerCase().includes(searchTerm) || false;
    
    // Retorna true se encontrar em qualquer campo
    return titleMatch || contentMatch || authorMatch;
  });
};

// Utilitários de performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Utilitários de AsyncStorage
export const getStorageItem = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erro ao ler ${key} do AsyncStorage:`, error);
    return defaultValue;
  }
};

export const setStorageItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar ${key} no AsyncStorage:`, error);
  }
};

// Utilitários de animação
export const createSpringConfig = (tension: number = 300, friction: number = 30) => ({
  tension,
  friction,
});

export const createTimingConfig = (duration: number = 300) => ({
  duration,
  useNativeDriver: true,
});

// Utilitários de layout
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

export const isTablet = () => {
  const { width, height } = getScreenDimensions();
  const minDimension = Math.min(width, height);
  return minDimension >= 768;
};

// Utilitários de erro
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Erro desconhecido';
};

// Utilitários de URL
export const generateAvatarUrl = (name: string, size: number = 100): string => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=007AFF&color=fff`;
};

// Utilitários de validação de formulário
export const validateForm = (values: Record<string, any>, rules: Record<string, (value: any) => boolean>) => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const validator = rules[field];
    
    if (!validator(value)) {
      errors[field] = `${field} é obrigatório`;
    }
  });
  
  return errors;
};

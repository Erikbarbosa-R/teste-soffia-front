// Tipos principais da aplicação

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked?: boolean;
  isFavorite?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Post[];
  favorites: string[]; // IDs dos posts favoritos
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  searchQuery: string;
}

export interface RootState {
  auth: AuthState;
  posts: PostsState;
}

// Tipos para navegação
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Feed: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Tipos para API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Tipos para componentes
export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
}

// Tipos do Redux
export type AppDispatch = import('../store').AppDispatch;

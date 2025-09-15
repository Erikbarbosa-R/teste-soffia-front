// Tipos principais da aplicação
export interface User {
id: string;
nome: string;
email: string;
telefone?: string;
is_valid: boolean;
created_at: string;
updated_at: string;
}
export interface Tag {
id: string;
nome: string;
cor: string;
created_at: string;
updated_at: string;
}
export interface Comment {
id: string;
content: string;
post_id: string;
user_id: string;
created_at: string;
updated_at: string;
user?: {
id: string;
nome: string;
email: string;
telefone?: string;
};
}
export interface Post {
id: string;
title: string;
content: string;
author: {
id: string;
nome: string;
telefone?: string;
email: string;
};
tags: string[];
created_at?: string;
updated_at?: string;
comments?: Comment[];
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
Profile: { userId: string };
};
export type TabParamList = {
Feed: undefined;
Search: undefined;
Favorites: undefined;
Profile: undefined;
};
// Tipos para API
export interface ApiResponse<T> {
data?: T;
message?: string;
success?: boolean;
}
export interface LoginResponse {
token: string;
message: string;
user: User;
}
export interface CreatePostRequest {
title: string;
content: string;
author: string; // UUID do usuário autor
tags?: string[]; // Array de nomes das tags
}
export interface LoginRequest {
email: string;
password: string;
}
export interface RegisterRequest {
nome: string;
email: string;
password: string;
telefone?: string;
}
export interface CreateCommentRequest {
content: string;
}
export interface DashboardStats {
total_users: number;
total_posts: number;
total_tags: number;
total_comments: number;
recent_posts: number;
active_users: number;
}
export interface ActivityItem {
id: string;
type: string;
description: string;
created_at: string;
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

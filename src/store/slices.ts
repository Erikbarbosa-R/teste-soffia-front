import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';
import apiService from '../services/api';
import { Post, User, CreatePostRequest, LoginRequest, RegisterRequest, LoginResponse } from '../types';
// Thunks para autenticação
export const loginUser = createAsyncThunk(
'auth/login',
async (credentials: LoginRequest, { rejectWithValue }) => {
try {
const response = await apiService.login(credentials);
return response;
} catch (error) {
return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
}
}
);
export const registerUser = createAsyncThunk(
'auth/register',
async (userData: RegisterRequest, { rejectWithValue }) => {
try {
await apiService.register(userData);
// Após registro, fazer login automaticamente
const loginResponse = await apiService.login({
email: userData.email,
password: userData.password
});
return loginResponse;
} catch (error) {
return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
}
}
);
export const logoutUser = createAsyncThunk(
'auth/logout',
async (_, { rejectWithValue }) => {
try {
await apiService.logout();
} catch (error) {
return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
}
}
);
// Thunks para posts
export const fetchPosts = createAsyncThunk(
'posts/fetchPosts',
async (_, { rejectWithValue }) => {
try {
const posts = await apiService.getPosts();
return posts;
} catch (error) {
return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
}
}
);
export const createPost = createAsyncThunk(
'posts/createPost',
async (postData: CreatePostRequest, { rejectWithValue }) => {
try {
const post = await apiService.createPost(postData);
return post;
} catch (error) {
return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
}
}
);
export const deletePost = createAsyncThunk(
'posts/deletePost',
async (postId: string, { rejectWithValue }) => {
try {
await apiService.deletePost(postId);
return postId;
} catch (error) {
return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
}
}
);
export const toggleFavorite = createAsyncThunk(
'posts/toggleFavorite',
async (postId: string, { getState, rejectWithValue }) => {
try {
const state = getState() as RootState;
const isFavorite = state.posts.favorites.includes(postId);
if (isFavorite) {
await apiService.removeFromFavorites(postId);
} else {
await apiService.addToFavorites(postId);
}
return postId;
} catch (error) {
return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido');
}
}
);
// Slice de autenticação
const authSlice = createSlice({
name: 'auth',
initialState: {
user: null as User | null,
isAuthenticated: false,
isLoading: false,
error: null as string | null,
},
reducers: {
clearError: (state) => {
state.error = null;
},
setUser: (state, action: PayloadAction<User>) => {
state.user = action.payload;
state.isAuthenticated = true;
},
},
extraReducers: (builder) => {
builder
// Login
.addCase(loginUser.pending, (state) => {
state.isLoading = true;
state.error = null;
})
.addCase(loginUser.fulfilled, (state, action) => {
state.isLoading = false;
state.user = action.payload.user;
state.isAuthenticated = true;
state.error = null;
})
.addCase(loginUser.rejected, (state, action) => {
state.isLoading = false;
state.error = action.payload as string;
})
// Register
.addCase(registerUser.pending, (state) => {
state.isLoading = true;
state.error = null;
})
.addCase(registerUser.fulfilled, (state, action) => {
state.isLoading = false;
state.user = action.payload.user;
state.isAuthenticated = true;
state.error = null;
})
.addCase(registerUser.rejected, (state, action) => {
state.isLoading = false;
state.error = action.payload as string;
})
// Logout
.addCase(logoutUser.fulfilled, (state) => {
state.user = null;
state.isAuthenticated = false;
state.error = null;
});
},
});
// Slice de posts
const postsSlice = createSlice({
name: 'posts',
initialState: {
posts: [] as Post[],
favorites: [] as string[],
isLoading: false,
error: null as string | null,
hasMore: true,
currentPage: 1,
searchQuery: '',
},
reducers: {
clearError: (state) => {
state.error = null;
},
clearPosts: (state) => {
state.posts = [];
state.currentPage = 1;
state.hasMore = true;
},
setSearchQuery: (state, action: PayloadAction<string>) => {
state.searchQuery = action.payload;
},
loadFavorites: (state, action: PayloadAction<string[]>) => {
state.favorites = action.payload;
},
},
extraReducers: (builder) => {
builder
// Fetch Posts
.addCase(fetchPosts.pending, (state) => {
state.isLoading = true;
state.error = null;
})
.addCase(fetchPosts.fulfilled, (state, action) => {
state.isLoading = false;
state.error = null;
state.posts = action.payload;
})
.addCase(fetchPosts.rejected, (state, action) => {
state.isLoading = false;
state.error = action.payload as string;
})
// Create Post
.addCase(createPost.pending, (state) => {
state.isLoading = true;
state.error = null;
})
.addCase(createPost.fulfilled, (state, action) => {
state.isLoading = false;
state.error = null;
state.posts.unshift(action.payload);
})
.addCase(createPost.rejected, (state, action) => {
state.isLoading = false;
state.error = action.payload as string;
})
// Delete Post
.addCase(deletePost.fulfilled, (state, action) => {
state.posts = state.posts.filter(post => post.id !== action.payload);
state.favorites = state.favorites.filter(id => id !== action.payload);
})
// Toggle Favorite
.addCase(toggleFavorite.fulfilled, (state, action) => {
const postId = action.payload;
const isFavorite = state.favorites.includes(postId);
if (isFavorite) {
state.favorites = state.favorites.filter(id => id !== postId);
} else {
state.favorites.push(postId);
}
// Atualizar o post na lista
const postIndex = state.posts.findIndex(post => post.id === postId);
if (postIndex !== -1) {
state.posts[postIndex].isFavorite = !isFavorite;
}
});
},
});
export const { clearError: clearAuthError, setUser } = authSlice.actions;
export const { clearError: clearPostsError, clearPosts, setSearchQuery, loadFavorites } = postsSlice.actions;
export { authSlice, postsSlice };

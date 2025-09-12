import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, User, CreatePostRequest, LoginRequest, RegisterRequest, ApiResponse } from '../types';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';

// Dados mock para simular uma API
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=007AFF&color=fff',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=5856D6&color=fff',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    avatar: 'https://ui-avatars.com/api/?name=Pedro+Oliveira&background=34C759&color=fff',
    createdAt: '2024-01-03T00:00:00Z',
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Primeiro Post',
    content: 'Este é o conteúdo do primeiro post. Aqui você pode escrever sobre qualquer coisa interessante.',
    author: MOCK_USERS[0],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    likes: 15,
  },
  {
    id: '2',
    title: 'React Native é Incrível',
    content: 'Desenvolvimento mobile com React Native oferece uma experiência única. A possibilidade de criar apps para iOS e Android com uma única base de código é fantástica.',
    author: MOCK_USERS[1],
    createdAt: '2024-01-02T14:30:00Z',
    updatedAt: '2024-01-02T14:30:00Z',
    likes: 28,
  },
  {
    id: '3',
    title: 'Dicas de Performance',
    content: 'Algumas dicas importantes para otimizar a performance do seu app React Native: use FlatList para listas grandes, implemente lazy loading e otimize as imagens.',
    author: MOCK_USERS[2],
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-03T09:15:00Z',
    likes: 42,
  },
];

class ApiService {
  private static instance: ApiService;
  private posts: Post[] = [...MOCK_POSTS];
  private users: User[] = [...MOCK_USERS];

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Simular delay de rede
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simular erro ocasional
  private shouldSimulateError(): boolean {
    return Math.random() < 0.01; // 1% de chance de erro (reduzido para testes)
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.delay(800);
    
    if (this.shouldSimulateError()) {
      throw new Error('Erro de conexão. Tente novamente.');
    }

    // Aceitar login com usuário específico ou qualquer usuário existente
    let user = this.users.find(u => u.email === credentials.email);
    
    // Se não encontrar o usuário específico, usar o primeiro usuário disponível
    if (!user) {
      user = this.users[0]; // João Silva
    }

    const token = `token_${user.id}_${Date.now()}`;
    
    // Salvar token no AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return {
      data: { user, token },
      message: 'Login realizado com sucesso',
      success: true,
    };
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.delay(1000);
    
    if (this.shouldSimulateError()) {
      throw new Error('Erro de conexão. Tente novamente.');
    }

    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      id: (this.users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=007AFF&color=fff`,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    const token = `token_${newUser.id}_${Date.now()}`;

    // Salvar dados no AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));

    return {
      data: { user: newUser, token },
      message: 'Usuário criado com sucesso',
      success: true,
    };
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER_TOKEN, STORAGE_KEYS.USER_DATA]);
  }

  // Posts
  async getPosts(page: number = 1, limit: number = 10, searchQuery?: string): Promise<ApiResponse<{ posts: Post[]; hasMore: boolean }>> {
    await this.delay(600);
    
    if (this.shouldSimulateError()) {
      throw new Error('Erro ao carregar posts');
    }

    let filteredPosts = [...this.posts];

    // Aplicar filtro de busca se fornecido
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query)
      );
    }

    // Aplicar paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Carregar favoritos do AsyncStorage
    const favorites = await this.getFavorites();
    const postsWithFavorites = paginatedPosts.map(post => ({
      ...post,
      isFavorite: favorites.includes(post.id),
    }));

    const hasMore = endIndex < filteredPosts.length;

    return {
      data: { posts: postsWithFavorites, hasMore },
      message: 'Posts carregados com sucesso',
      success: true,
    };
  }

  async createPost(postData: CreatePostRequest, authorId: string): Promise<ApiResponse<Post>> {
    await this.delay(800);
    
    if (this.shouldSimulateError()) {
      throw new Error('Erro ao criar post');
    }

    const author = this.users.find(u => u.id === authorId);
    if (!author) {
      throw new Error('Autor não encontrado');
    }

    const newPost: Post = {
      id: (this.posts.length + 1).toString(),
      title: postData.title,
      content: postData.content,
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    };

    this.posts.unshift(newPost); // Adicionar no início da lista

    return {
      data: newPost,
      message: 'Post criado com sucesso',
      success: true,
    };
  }

  async deletePost(postId: string): Promise<ApiResponse<void>> {
    await this.delay(500);
    
    if (this.shouldSimulateError()) {
      throw new Error('Erro ao deletar post');
    }

    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post não encontrado');
    }

    this.posts.splice(postIndex, 1);

    // Remover dos favoritos também
    await this.removeFavorite(postId);

    return {
      data: undefined,
      message: 'Post deletado com sucesso',
      success: true,
    };
  }

  // Favoritos (usando AsyncStorage como cache)
  async getFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      return [];
    }
  }

  async addFavorite(postId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(postId)) {
        favorites.push(postId);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      throw error;
    }
  }

  async removeFavorite(postId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== postId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      throw error;
    }
  }

  // Verificar se está offline
  async isOffline(): Promise<boolean> {
    // Simular verificação de conectividade
    return Math.random() < 0.05; // 5% de chance de estar offline
  }

  // Salvar posts offline
  async saveOfflinePosts(posts: Post[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_POSTS, JSON.stringify(posts));
    } catch (error) {
      console.error('Erro ao salvar posts offline:', error);
    }
  }

  // Carregar posts offline
  async getOfflinePosts(): Promise<Post[]> {
    try {
      const posts = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_POSTS);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Erro ao carregar posts offline:', error);
      return [];
    }
  }
}

export default ApiService.getInstance();

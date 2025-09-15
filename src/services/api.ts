import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Post, 
  User, 
  Tag,
  Comment,
  CreatePostRequest, 
  LoginRequest, 
  RegisterRequest,
  CreateCommentRequest,
  LoginResponse,
  DashboardStats,
  ActivityItem
} from '../types';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { getBaseURL } from '../config/environment';

class ApiService {
  private static instance: ApiService;
  private baseURL: string;
  private token: string | null = null;

  private constructor() {
    this.baseURL = getBaseURL();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Método para fazer requisições HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('API Request:', { 
      url, 
      method: config.method || 'GET', 
      hasToken: !!this.token,
      tokenPreview: this.token ? this.token.substring(0, 20) + '...' : 'N/A',
      body: config.body,
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      
      console.log('API Response Status:', response.status, response.statusText);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response Text:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error('API Error Response JSON:', errorData);
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
      }

      // Se a resposta for 204 (No Content), retorna void
      if (response.status === 204) {
        return {} as T;
      }

      const responseText = await response.text();
      console.log('API Response Text:', responseText);
      
      try {
        const data = JSON.parse(responseText);
        console.log('API Response Data:', data);
        return data;
      } catch (parseError) {
        console.error('API Response não é JSON válido:', responseText);
        throw new Error('Resposta da API não é JSON válido');
      }
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Método para definir o token de autenticação
  public async setToken(token: string | null): Promise<void> {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    }
  }

  // Método para carregar token do AsyncStorage
  public async loadToken(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      this.token = token;
    } catch (error) {
      console.error('Erro ao carregar token:', error);
      this.token = null;
    }
  }

  // Health Check
  async checkHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>(API_ENDPOINTS.HEALTH);
  }

  async ping(): Promise<{ pong: boolean }> {
    return this.request<{ pong: boolean }>(API_ENDPOINTS.PING);
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    // Salvar token e dados do usuário
    await this.setToken(response.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

    return response;
  }

  async register(userData: RegisterRequest): Promise<void> {
    await this.request<void>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
  }

  async getCurrentUser(): Promise<User> {
    console.log('ApiService - Obtendo usuário atual...');
    console.log('ApiService - Token atual:', this.token ? 'Presente' : 'Ausente');
    
    try {
      const response = await this.request<User>(API_ENDPOINTS.AUTH.ME);
      console.log('ApiService - Resposta do usuário atual:', response);
      
      // A API pode retornar o usuário diretamente ou dentro de um campo data
      const user = (response as any)?.data || response;
      console.log('ApiService - Usuário processado:', user);
      
      return user;
    } catch (error: any) {
      console.error('ApiService - Erro ao obter usuário atual:', error);
      console.error('ApiService - Status do erro:', error?.status);
      console.error('ApiService - Mensagem do erro:', error?.message);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      });
    } finally {
      // Sempre limpar dados locais, mesmo se a requisição falhar
      await this.setToken(null);
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.OFFLINE_POSTS,
      ]);
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      {
        method: 'POST',
      }
    );

    await this.setToken(response.token);
    return response;
  }

  // Posts
  async getPosts(params?: { query?: string; tag?: string; per_page?: number; sort?: string }): Promise<Post[]> {
    let endpoint = API_ENDPOINTS.POSTS;
    
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.query) {
        // Normalizar query para busca case-insensitive
        const normalizedQuery = params.query.trim().toLowerCase();
        queryParams.append('query', normalizedQuery);
      }
      if (params.tag) queryParams.append('tag', params.tag);
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      
      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }
    }
    
    console.log('ApiService - Carregando posts com endpoint:', endpoint);
    const response = await this.request<any>(endpoint);
    
    // A API retorna { data: Post[], message: string, pagination: object }
    const posts = response?.data || [];
    console.log('ApiService - Posts recebidos:', posts.length);
    
    return posts;
  }

  async searchPosts(query: string): Promise<Post[]> {
    // Normalizar a query para busca case-insensitive
    const normalizedQuery = query.trim().toLowerCase();
    return this.getPosts({ query: normalizedQuery });
  }

  async getPost(id: string): Promise<Post> {
    const response = await this.request<any>(`${API_ENDPOINTS.POSTS}/${id}`);
    console.log('ApiService - Post carregado:', response);
    // A API retorna { data: Post, message: string }
    return response?.data || response;
  }

  // Buscar posts de um usuário específico
  async getUserPosts(userId: string): Promise<Post[]> {
    console.log('ApiService - Buscando posts do usuário:', userId);
    
    try {
      const response = await this.request<any>(`${API_ENDPOINTS.POSTS}/user/${userId}`);
      
      // A API retorna { data: Post[], message: string }
      const posts = response?.data || [];
      console.log('ApiService - Posts do usuário recebidos:', posts.length);
      
      return posts;
    } catch (error) {
      console.error('Erro ao buscar posts do usuário:', error);
      
      // Fallback: buscar todos os posts e filtrar localmente
      console.log('ApiService - Fallback: buscando todos os posts e filtrando...');
      const allPosts = await this.getPosts();
      const userPosts = allPosts.filter(post => post.author.id === userId);
      
      console.log('ApiService - Posts filtrados localmente:', userPosts.length);
      return userPosts;
    }
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    console.log('ApiService - Criando post com dados:', postData);
    console.log('ApiService - Token atual:', this.token ? 'Presente' : 'Ausente');
    console.log('ApiService - Token completo:', this.token);
    console.log('ApiService - Base URL:', this.baseURL);
    console.log('ApiService - Endpoint:', API_ENDPOINTS.POSTS);
    
    try {
      const response = await this.request<any>(API_ENDPOINTS.POSTS, {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      
      console.log('ApiService - Resposta da criação:', response);
      
      // A API pode retornar o post diretamente ou dentro de um campo data
      return response?.data || response;
    } catch (error: any) {
      console.error('ApiService - Erro ao criar post:', error);
      console.error('ApiService - Status do erro:', error?.status);
      console.error('ApiService - Mensagem do erro:', error?.message);
      console.error('ApiService - Dados enviados:', postData);
      throw error;
    }
  }

  async updatePost(id: string, postData: Partial<CreatePostRequest>): Promise<Post> {
    console.log('ApiService - Atualizando post:', id, postData);
    console.log('ApiService - Token atual:', this.token ? 'Presente' : 'Ausente');
    console.log('ApiService - URL da requisição:', `${API_ENDPOINTS.POSTS}/${id}`);
    console.log('ApiService - Payload sendo enviado:', JSON.stringify(postData));
    
    try {
      const response = await this.request<any>(`${API_ENDPOINTS.POSTS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
      });
      
      console.log('ApiService - Resposta da atualização:', response);
      console.log('ApiService - Tipo da resposta:', typeof response);
      console.log('ApiService - Response.data:', response?.data);
      console.log('ApiService - Response.message:', response?.message);
      
      // A API retorna { message: string, data: Post } - conforme visto no Postman
      if (response?.data && response.data.id) {
        console.log('ApiService - Post atualizado (estrutura data):', response.data);
        return response.data;
      } else if (response?.message === 'Post atualizado com sucesso.' && response?.data) {
        // Estrutura específica do Postman: { message: "Post atualizado com sucesso.", data: Post }
        console.log('ApiService - Post atualizado (estrutura Postman):', response.data);
        return response.data;
      } else if (response?.id && response?.title) {
        // Estrutura: Post direto
        console.log('ApiService - Post atualizado (estrutura direta):', response);
        return response;
      } else if (response?.message === 'Post não encontrado.') {
        throw new Error('Post não encontrado');
      } else if (response?.message) {
        // Resposta com mensagem mas sem dados
        console.log('ApiService - Resposta com mensagem:', response.message);
        throw new Error(response.message);
      } else {
        // Resposta vazia ou inválida
        console.error('ApiService - Resposta inválida:', response);
        throw new Error('Resposta inválida da API');
      }
    } catch (error: any) {
      console.error('ApiService - Erro na atualização:', error);
      console.error('ApiService - Erro completo:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async deletePost(id: string): Promise<void> {
    return this.request<void>(`${API_ENDPOINTS.POSTS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Comentários
  async createComment(postId: string, commentData: CreateCommentRequest): Promise<Comment> {
    console.log('ApiService - Criando comentário...');
    console.log('ApiService - Post ID:', postId);
    console.log('ApiService - Dados do comentário:', commentData);
    console.log('ApiService - Token atual:', this.token ? 'Presente' : 'Ausente');
    console.log('ApiService - Token completo:', this.token);
    console.log('ApiService - URL completa:', `${this.baseURL}${API_ENDPOINTS.POSTS}/${postId}/comments`);
    
    // Garantir que os dados estão no formato correto
    const requestData = {
      content: commentData.content,
      post_id: postId
    };
    
    console.log('ApiService - Dados formatados para envio:', requestData);
    
    try {
      const response = await this.request<Comment>(`${API_ENDPOINTS.POSTS}/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      
      console.log('ApiService - Resposta da criação do comentário:', response);
      
      // A API pode retornar o comentário diretamente ou dentro de um campo data
      return (response as any)?.data || response;
    } catch (error: any) {
      console.error('ApiService - Erro ao criar comentário:', error);
      console.error('ApiService - Status do erro:', error?.status);
      console.error('ApiService - Mensagem do erro:', error?.message);
      console.error('ApiService - Dados enviados:', requestData);
      
      // Se der erro 500, tentar formato alternativo
      if (error?.status === 500) {
        console.log('ApiService - Tentando formato alternativo para comentário...');
        try {
          const alternativeData = {
            conteudo: commentData.content,
            post_id: postId
          };
          
          console.log('ApiService - Dados alternativos:', alternativeData);
          
          const response = await this.request<Comment>(`${API_ENDPOINTS.POSTS}/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(alternativeData),
          });
          
          console.log('ApiService - Resposta alternativa:', response);
          return (response as any)?.data || response;
        } catch (altError) {
          console.error('ApiService - Erro na tentativa alternativa:', altError);
          throw altError;
        }
      }
      
      throw error;
    }
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    return this.request<void>(`${API_ENDPOINTS.POSTS}/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Usuários
  async getUsers(): Promise<User[]> {
    return this.request<User[]>(API_ENDPOINTS.USERS);
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`${API_ENDPOINTS.USERS}/${id}`);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`${API_ENDPOINTS.USERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`${API_ENDPOINTS.USERS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return this.request<Tag[]>(API_ENDPOINTS.TAGS);
  }

  async createTag(tagData: { nome: string; cor: string }): Promise<Tag> {
    return this.request<Tag>(API_ENDPOINTS.TAGS, {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  }

  async updateTag(id: string, tagData: Partial<Tag>): Promise<Tag> {
    return this.request<Tag>(`${API_ENDPOINTS.TAGS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tagData),
    });
  }

  async deleteTag(id: string): Promise<void> {
    return this.request<void>(`${API_ENDPOINTS.TAGS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
  }

  async getDashboardActivity(): Promise<ActivityItem[]> {
    return this.request<ActivityItem[]>(API_ENDPOINTS.DASHBOARD.ACTIVITY);
  }

  // Favoritos (mantido para compatibilidade com o frontend atual)
  async getFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      return [];
    }
  }

  async addToFavorites(postId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(postId)) {
        favorites.push(postId);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  }

  async removeFromFavorites(postId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== postId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  }

  // Método para salvar posts offline
  async saveOfflinePosts(posts: Post[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_POSTS, JSON.stringify(posts));
    } catch (error) {
      console.error('Erro ao salvar posts offline:', error);
    }
  }

  // Método para carregar posts offline
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

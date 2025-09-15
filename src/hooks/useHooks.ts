import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Hook para gerenciar formulários
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    setFieldError,
    reset,
    isValid,
  };
};

// Hook para gerenciar posts
export const usePosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Tentar carregar posts ordenados por data (mais novos primeiro)
      const postsData = await apiService.getPosts({ sort: 'created_at_desc' });
      const postsArray = Array.isArray(postsData) ? postsData : [];
      
      // Se o backend não suportar ordenação, ordenar localmente
      const sortedPosts = postsArray.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime(); // Ordem decrescente (mais novos primeiro)
      });
      
      console.log('usePosts - Posts carregados:', sortedPosts.length);
      console.log('usePosts - Primeiro post:', sortedPosts[0]?.title);
      console.log('usePosts - Último post:', sortedPosts[sortedPosts.length - 1]?.title);
      
      setPosts(sortedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData: { title: string; content: string; author: string; tags?: string[] }) => {
    try {
      const newPost = await apiService.createPost(postData);
      console.log('usePosts - Novo post criado:', newPost.title);
      
      // Adicionar o novo post no início da lista e reordenar
      setPosts(prev => {
        const updatedPosts = [newPost, ...prev];
        // Reordenar por data para garantir ordem correta
        return updatedPosts.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
      });
      
      return newPost;
    } catch (err) {
      throw err;
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await apiService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    posts,
    isLoading,
    error,
    loadPosts,
    createPost,
    deletePost,
  };
};

// Hook para gerenciar busca
export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    clearSearch,
  };
};

// Hook para gerenciar conectividade
export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        await apiService.checkHealth();
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Verificar conectividade inicial
    checkConnectivity();

    // Verificar periodicamente
    const interval = setInterval(checkConnectivity, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return { isOnline };
};

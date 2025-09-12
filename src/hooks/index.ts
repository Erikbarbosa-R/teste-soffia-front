import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../types';
import { fetchPosts, createPost, deletePost, toggleFavorite } from '../store/slices';
import apiService from '../services/api';

// Hook para gerenciar posts
export const usePosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading, error, hasMore, currentPage, searchQuery } = useSelector(
    (state: RootState) => state.posts
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const loadPosts = useCallback(
    (page: number = 1, search: string = '') => {
      dispatch(fetchPosts({ page, searchQuery: search }));
    },
    [dispatch]
  );

  const loadMorePosts = useCallback(() => {
    if (hasMore && !isLoading) {
      loadPosts(currentPage + 1, searchQuery);
    }
  }, [hasMore, isLoading, currentPage, searchQuery, loadPosts]);

  const createNewPost = useCallback(
    (postData: { title: string; content: string }) => {
      if (user) {
        dispatch(createPost({ postData, authorId: user.id }));
      }
    },
    [dispatch, user]
  );

  const removePost = useCallback(
    (postId: string) => {
      dispatch(deletePost(postId));
    },
    [dispatch]
  );


  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadPosts,
    loadMorePosts,
    createNewPost,
    removePost,
  };
};

// Hook para gerenciar favoritos
export const useFavorites = () => {
  const { favorites } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch<AppDispatch>();

  const toggleFavoriteAction = useCallback(
    (postId: string) => {
      dispatch(toggleFavorite(postId));
    },
    [dispatch]
  );

  const isFavorite = useCallback(
    (postId: string) => {
      return favorites.includes(postId);
    },
    [favorites]
  );

  return {
    favorites,
    toggleFavorite: toggleFavoriteAction,
    isFavorite,
  };
};

// Hook para gerenciar busca
export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Executar busca quando o query debounced mudar
  useEffect(() => {
    if (debouncedQuery !== '') {
      dispatch(fetchPosts({ page: 1, searchQuery: debouncedQuery }));
    }
  }, [debouncedQuery, dispatch]);

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
        const offline = await apiService.isOffline();
        setIsOnline(!offline);
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

// Hook para gerenciar paginação
export const usePagination = () => {
  const { hasMore, isLoading, currentPage } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch<AppDispatch>();

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(fetchPosts({ page: currentPage + 1 }));
    }
  }, [hasMore, isLoading, currentPage, dispatch]);

  const canLoadMore = hasMore && !isLoading;

  return {
    canLoadMore,
    loadMore,
    currentPage,
    isLoading,
  };
};

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

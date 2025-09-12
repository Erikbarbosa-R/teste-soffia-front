import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import apiService from '../services/api';

// Hook que gerencia posts e favoritos juntos
export const usePostsAndFavorites = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar posts e favoritos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar posts
      const postsResponse = await apiService.getPosts(1, 10, '');
      const postsData = postsResponse?.data?.posts || [];
      setPosts(Array.isArray(postsData) ? postsData : []);

      // Carregar favoritos
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavorites) {
        const favoritesData = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setPosts([]);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const toggleFavorite = useCallback((postId: string) => {
    setFavorites(prevFavorites => {
      let newFavorites: string[];
      
      if (prevFavorites.includes(postId)) {
        // Remover dos favoritos
        newFavorites = prevFavorites.filter(id => id !== postId);
      } else {
        // Adicionar aos favoritos
        newFavorites = [...prevFavorites, postId];
      }
      
      // Salvar no AsyncStorage
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((postId: string) => {
    return favorites.includes(postId);
  }, [favorites]);

  const getFavoritePosts = useCallback(() => {
    if (!posts || !Array.isArray(posts)) return [];
    return posts.filter(post => favorites.includes(post.id));
  }, [posts, favorites]);

  const refreshData = async () => {
    await loadData();
  };

  return {
    posts,
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    getFavoritePosts,
    refreshData,
  };
};

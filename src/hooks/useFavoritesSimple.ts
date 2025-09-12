import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

// Hook simples para gerenciar favoritos
export const useFavoritesSimple = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Carregar favoritos do AsyncStorage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
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

  const addFavorite = useCallback((postId: string) => {
    if (!favorites.includes(postId)) {
      const newFavorites = [...favorites, postId];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
    }
  }, [favorites]);

  const removeFavorite = useCallback((postId: string) => {
    const newFavorites = favorites.filter(id => id !== postId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
  };
};

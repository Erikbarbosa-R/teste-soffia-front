import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (postId: string) => void;
  isFavorite: (postId: string) => boolean;
  addFavorite: (postId: string) => void;
  removeFavorite: (postId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Carregar favoritos do AsyncStorage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavorites) {
        const favoritesData = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
        console.log('FavoritesProvider - Favoritos carregados:', favoritesData);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
      console.log('FavoritesProvider - Favoritos salvos:', newFavorites);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addFavorite = (postId: string) => {
    if (!favorites.includes(postId)) {
      const newFavorites = [...favorites, postId];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
      console.log('FavoritesProvider - Adicionado aos favoritos:', postId);
    }
  };

  const removeFavorite = (postId: string) => {
    const newFavorites = favorites.filter(id => id !== postId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    console.log('FavoritesProvider - Removido dos favoritos:', postId);
  };

  const toggleFavorite = (postId: string) => {
    console.log('FavoritesProvider - Toggle favorite:', postId);
    console.log('FavoritesProvider - Favoritos atuais:', favorites);
    
    if (favorites.includes(postId)) {
      removeFavorite(postId);
    } else {
      addFavorite(postId);
    }
  };

  const isFavorite = (postId: string) => {
    return favorites.includes(postId);
  };

  const value: FavoritesContextType = {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};
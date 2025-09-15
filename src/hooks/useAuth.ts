import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import { STORAGE_KEYS } from '../constants';
import { User } from '../types';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      
      // Carregar token do AsyncStorage
      await apiService.loadToken();
      
      // Verificar se o token existe
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      console.log('useAuth - Token encontrado:', !!token);
      
      if (token) {
        try {
          // Verificar se o token ainda é válido fazendo uma chamada para /auth/me
          const currentUser = await apiService.getCurrentUser();
          console.log('useAuth - Usuário carregado:', currentUser);
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.log('Token inválido ou expirado, fazendo logout...');
          setUser(null);
          setIsAuthenticated(false);
          await logout();
        }
      } else {
        console.log('useAuth - Nenhum token encontrado');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, password });
      
      // Definir o usuário e autenticação
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { nome: string; email: string; password: string; telefone?: string }) => {
    try {
      setIsLoading(true);
      await apiService.register(userData);
      
      // Após registro, fazer login automaticamente
      const response = await apiService.login({
        email: userData.email,
        password: userData.password
      });
      
      // Definir o usuário e autenticação
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar o estado local
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loadStoredAuth,
  };
};

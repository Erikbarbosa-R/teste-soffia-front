import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesContext } from '../context/FavoritesContext';
import apiService from '../services/api';

// Componentes styled para o design da busca
const SearchContainer = styled.View`
  flex: 1;
  background-color: #F2F2F7;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 24px;
  padding-top: 50px;
  background-color: #FFFFFF;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const SearchInputContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: #F2F2F7;
  border-radius: 12px;
  padding: 12px 16px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #000000;
  margin-left: 8px;
`;

const ClearButton = styled.TouchableOpacity`
  padding: 4px;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 16px 24px;
`;

const PostCard = styled.View`
  background-color: #FFFFFF;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const PostHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const ProfileImage = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #E5E5EA;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const ProfileImageText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #8E8E93;
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const ProfileName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 2px;
`;

const ProfileUsername = styled.Text`
  font-size: 14px;
  color: #8E8E93;
`;

const FavoriteButton = styled.TouchableOpacity`
  padding: 4px;
`;

const PostTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
  line-height: 24px;
`;

const PostContent = styled.Text`
  font-size: 14px;
  color: #8E8E93;
  line-height: 20px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #8E8E93;
  text-align: center;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: #8E8E93;
  margin-top: 16px;
`;

const TestButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 12px 24px;
  border-radius: 8px;
  margin: 16px 0;
`;

const TestButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

interface SearchScreenProps {
  navigation: any;
  route?: {
    params?: {
      searchType?: 'all' | 'favorites';
    };
  };
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchType = route?.params?.searchType || 'all';

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      let postsData: any[] = [];
      
      if (searchType === 'favorites') {
        // Para busca em favoritos, primeiro buscar todos os posts e filtrar
        const allPosts = await apiService.getPosts();
        postsData = allPosts.filter((post: any) => favorites.includes(post.id));
      } else {
        // Para busca geral, buscar todos os posts e filtrar localmente
        // Isso garante que a busca funcione tanto no título quanto no conteúdo
        postsData = await apiService.getPosts();
      }

      // Sempre filtrar localmente para garantir busca completa
      const normalizedQuery = query.toLowerCase().trim();
      const filteredPosts = postsData.filter((post: any) => {
        // Buscar no título
        const titleMatch = post.title?.toLowerCase().includes(normalizedQuery) || false;
        
        // Buscar no conteúdo
        const contentMatch = post.content?.toLowerCase().includes(normalizedQuery) || false;
        
        // Buscar no nome do autor
        const authorMatch = (post.author?.nome || post.author?.name || '')
          .toLowerCase().includes(normalizedQuery) || false;
        
        // Debug temporário
        if (titleMatch || contentMatch || authorMatch) {
          console.log('Post encontrado:', {
            title: post.title,
            content: post.content?.substring(0, 50) + '...',
            author: post.author?.nome || post.author?.name,
            query: normalizedQuery,
            titleMatch,
            contentMatch,
            authorMatch
          });
        }
        
        // Retorna true se encontrar em qualquer campo
        return titleMatch || contentMatch || authorMatch;
      });

      setSearchResults(filteredPosts);
    } catch (error) {
      console.error('SearchScreen - Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchType, favorites]);

  // Debounce para busca automática
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const testAPI = async () => {
    console.log('SearchScreen - Testando API...');
    console.log('SearchScreen - Tipo de busca:', searchType);
    try {
      const response = await apiService.getPosts();
      console.log('SearchScreen - Teste API - Resposta:', response);
      console.log('SearchScreen - Teste API - Posts:', response);
      
      let postsData = response || [];
      
      // Se for busca apenas em favoritos, filtrar pelos favoritos
      if (searchType === 'favorites') {
        postsData = postsData.filter((post: any) => favorites.includes(post.id));
        console.log('SearchScreen - Teste API - Posts após filtro de favoritos:', postsData.length);
        console.log('SearchScreen - Teste API - Favoritos atuais:', favorites);
      }
      
      if (postsData.length > 0) {
        setSearchResults(postsData);
        setHasSearched(true);
        console.log('SearchScreen - Teste API - Posts definidos:', postsData.length);
      }
    } catch (error) {
      console.error('SearchScreen - Teste API - Erro:', error);
    }
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleFavorite = (postId: string) => {
    toggleFavorite(postId);
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePostPress(item.id)}>
      <PostCard>
        <PostHeader>
          <ProfileImage>
            <ProfileImageText>
              {item.author?.name?.charAt(0)?.toUpperCase() || '?'}
            </ProfileImageText>
          </ProfileImage>
          <ProfileInfo>
            <ProfileName>{item.author?.name || 'Autor Desconhecido'}</ProfileName>
            <ProfileUsername>@{item.author?.name?.toLowerCase().replace(/\s+/g, '') || 'usuario'}</ProfileUsername>
          </ProfileInfo>
          <FavoriteButton onPress={() => handleFavorite(item.id)}>
            <Ionicons 
              name={isFavorite(item.id) ? "star" : "star-outline"} 
              size={24} 
              color={isFavorite(item.id) ? "#FFD700" : "#8E8E93"} 
            />
          </FavoriteButton>
        </PostHeader>
        
        <PostTitle>{item.title}</PostTitle>
        <PostContent>{item.content}</PostContent>
      </PostCard>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <Ionicons name="search" size={48} color="#8E8E93" />
          <LoadingText>Buscando...</LoadingText>
        </LoadingContainer>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <EmptyContainer>
          <Ionicons name="search-outline" size={48} color="#8E8E93" />
          <EmptyText>
            Nenhum resultado encontrado para{'\n'}"{searchQuery}"
          </EmptyText>
        </EmptyContainer>
      );
    }

    return (
      <EmptyContainer>
        <Ionicons name="search-outline" size={48} color="#8E8E93" />
        <EmptyText>
          {searchType === 'favorites' 
            ? 'Digite para buscar nos seus favoritos por título, conteúdo ou nome do autor'
            : 'Digite para buscar posts por título, conteúdo ou nome do autor'
          }
        </EmptyText>
        <TestButton onPress={testAPI}>
          <TestButtonText>
            {searchType === 'favorites' ? 'Testar Favoritos' : 'Testar API'}
          </TestButtonText>
        </TestButton>
      </EmptyContainer>
    );
  };

  return (
    <SearchContainer>
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </BackButton>
        
        <SearchInputContainer>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <SearchInput
            placeholder="Buscar posts..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <ClearButton onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </ClearButton>
          )}
        </SearchInputContainer>
      </Header>

      <ContentContainer>
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          renderEmptyState()
        )}
      </ContentContainer>
    </SearchContainer>
  );
};

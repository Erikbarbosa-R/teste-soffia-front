import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesContext } from '../context/FavoritesContext';
import apiService from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

// Componentes styled para o design da imagem
const FavoritesContainer = styled.View`
  flex: 1;
  background-color: #F2F2F7;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  padding-top: 50px;
  background-color: #FFFFFF;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
`;

const SearchButton = styled.TouchableOpacity`
  padding: 8px;
`;

const FeedContainer = styled.View`
  flex: 1;
  padding: 16px 24px;
  background-color: #F2F2F7;
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

interface FavoritesScreenProps {
  navigation: any;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { favorites, toggleFavorite } = useFavoritesContext();
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [favoritePosts, setFavoritePosts] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carregar todos os posts
  useEffect(() => {
    loadPosts();
  }, []);

  // Recarregar posts quando a tela for focada (ex: após favoritar/desfavoritar)
  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [])
  );

  // Filtrar posts favoritos quando favoritos ou posts mudarem
  useEffect(() => {
    console.log('FavoritesScreen - Favoritos:', favorites);
    console.log('FavoritesScreen - Posts disponíveis:', allPosts.length);
    
    const filteredPosts = allPosts.filter(post => {
      const isFav = favorites.includes(post.id);
      console.log(`Post ${post.id} (${post.title}) - Favorito: ${isFav}`);
      return isFav;
    });
    
    console.log('FavoritesScreen - Posts filtrados:', filteredPosts.length);
    setFavoritePosts(filteredPosts);
  }, [allPosts, favorites]);

  const loadPosts = async () => {
    try {
      const response = await apiService.getPosts(1, 10, '');
      const postsData = response?.data?.posts || [];
      setAllPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setAllPosts([]);
    }
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleFavorite = (postId: string) => {
    toggleFavorite(postId);
  };

  const handleSearch = () => {
    navigation.navigate('Search', { searchType: 'favorites' });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePostPress(item.id)}>
      <PostCard>
        <PostHeader>
          <ProfileImage>
            <ProfileImageText>
              {item.author.name.charAt(0).toUpperCase()}
            </ProfileImageText>
          </ProfileImage>
          <ProfileInfo>
            <ProfileName>{item.author.name}</ProfileName>
            <ProfileUsername>@{item.author.name.toLowerCase().replace(/\s+/g, '')}</ProfileUsername>
          </ProfileInfo>
          <FavoriteButton onPress={() => handleFavorite(item.id)}>
            <Ionicons 
              name="star" 
              size={24} 
              color="#FFD700" 
            />
          </FavoriteButton>
        </PostHeader>
        
        <PostTitle>{item.title}</PostTitle>
        <PostContent>{item.content}</PostContent>
      </PostCard>
    </TouchableOpacity>
  );

  return (
    <FavoritesContainer>
      <Header>
        <HeaderTitle>Favoritos</HeaderTitle>
        <SearchButton onPress={handleSearch}>
          <Ionicons name="search-outline" size={24} color="#000000" />
        </SearchButton>
      </Header>

      <FeedContainer>
        {favoritePosts.length > 0 ? (
          <FlatList
            data={favoritePosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#007AFF"
              />
            }
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        ) : (
          <EmptyContainer>
            <EmptyText>
              Nenhum post favoritado ainda{'\n'}
              Toque na estrela dos posts para adicioná-los aos favoritos
            </EmptyText>
          </EmptyContainer>
        )}
      </FeedContainer>
    </FavoritesContainer>
  );
};

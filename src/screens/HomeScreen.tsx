import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { SafeContainer } from '../components';
import { useFavoritesContext } from '../context/FavoritesContext';
import apiService from '../services/api';
import { Loading } from '../components';
import { Ionicons } from '@expo/vector-icons';

// Componentes styled para o design da imagem
const HomeContainer = styled.View`
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
`;

const ProfileUsername = styled.Text`
  font-size: 14px;
  color: #8E8E93;
  margin-top: 2px;
`;

const FavoriteButton = styled.TouchableOpacity`
  padding: 8px;
`;

const PostTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
  line-height: 24px;
`;

const PostContent = styled.Text`
  font-size: 16px;
  color: #8E8E93;
  line-height: 22px;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #007AFF;
  justify-content: center;
  align-items: center;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar posts
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getPosts(1, 10, '');
      const postsData = response?.data?.posts || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleRefresh = async () => {
    await loadPosts();
  };

  const handleFavorite = (postId: string) => {
    console.log('HomeScreen - Toggle favorite para post:', postId);
    console.log('HomeScreen - Favoritos antes:', favorites);
    toggleFavorite(postId);
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const handleSearch = () => {
    navigation.navigate('Search', { searchType: 'all' });
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

  const renderFooter = () => {
    if (!isLoading || posts.length === 0) return null;
    return <Loading size="small" text="Carregando mais posts..." />;
  };

  if (isLoading && posts.length === 0) {
    return <Loading text="Carregando posts..." />;
  }

  return (
    <SafeContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HomeContainer>
        <Header>
          <HeaderTitle>Início</HeaderTitle>
          <SearchButton onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#000000" />
          </SearchButton>
        </Header>

        <FeedContainer>
          <FlatList
            data={Array.isArray(posts) ? posts : []}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={handleRefresh}
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
          />
        </FeedContainer>

        <FloatingButton onPress={handleCreatePost}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </FloatingButton>
      </HomeContainer>
    </SafeContainer>
  );
};
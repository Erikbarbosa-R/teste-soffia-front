import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { SafeContainer } from '../components';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useAuthContext } from '../context/AuthContext';
import { usePosts } from '../hooks/useHooks';
import { Loading } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiService from '../services/api';

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
  background-color: #F2F2F7;
`;

const PostCard = styled.View`
  background-color: #FFFFFF;
  margin-bottom: 16px;
  margin-top: 16px;
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

const MenuButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

const MenuOverlay = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 10;
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 50px;
  right: 20px;
  background-color: #FFFFFF;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
  z-index: 20;
  min-width: 120px;
`;

const MenuItem = styled.TouchableOpacity`
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

const MenuItemText = styled.Text`
  font-size: 16px;
  color: #000000;
`;

const MenuItemTextDanger = styled.Text`
  font-size: 16px;
  color: #FF3B30;
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
  const { user } = useAuthContext();
  const { posts, isLoading, loadPosts } = usePosts();
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null);

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

  const handleProfilePress = (userId: string) => {
    navigation.navigate('Profile', { userId });
  };

  const handleEditPost = (post: any) => {
    setShowPostMenu(null);
    navigation.navigate('CreatePost', { 
      editMode: true, 
      postId: post.id, 
      postData: {
        title: post.title,
        content: post.content,
        tags: post.tags || []
      }
    });
  };

  const handleDeletePost = async (postId: string) => {
    try {
      console.log('HomeScreen - Deletando post:', postId);
      await apiService.deletePost(postId);
      setShowPostMenu(null);
      // Recarregar posts após deletar
      await loadPosts();
      console.log('HomeScreen - Post deletado com sucesso');
    } catch (error) {
      console.error('HomeScreen - Erro ao deletar post:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [])
  );
  
  const renderPost = ({ item }: { item: any }) => {
    console.log('HomeScreen - Renderizando post:', item.id);
    console.log('HomeScreen - User atual:', user);
    console.log('HomeScreen - Post author:', item.author);
    console.log('HomeScreen - Post author.id:', item.author?.id);
    console.log('HomeScreen - User ID:', user?.id);
    console.log('HomeScreen - Condição para mostrar menu:', user && item.author?.id === user?.id);
    
    return (
    <View>
      <TouchableOpacity onPress={() => handlePostPress(item.id)}>
        <PostCard>
          <PostHeader>
            <TouchableOpacity onPress={() => handleProfilePress(item.author.id)}>
              <ProfileImage>
                <ProfileImageText>
                  {item.author?.nome?.charAt(0)?.toUpperCase() || '?'}
                </ProfileImageText>
              </ProfileImage>
            </TouchableOpacity>
            <ProfileInfo>
              <ProfileName>{item.author?.nome || 'Autor Desconhecido'}</ProfileName>
              <ProfileUsername>@{item.author?.nome?.toLowerCase().replace(/\s+/g, '') || 'usuario'}</ProfileUsername>
            </ProfileInfo>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FavoriteButton onPress={() => handleFavorite(item.id)}>
                <Ionicons 
                  name={isFavorite(item.id) ? "star" : "star-outline"} 
                  size={24} 
                  color={isFavorite(item.id) ? "#FFD700" : "#8E8E93"} 
                />
              </FavoriteButton>
              {/* Menu de 3 pontos - só aparece se o usuário for o autor */}
              {user && item.author?.id === user?.id && (
                <MenuButton onPress={() => {
                  console.log('HomeScreen - Clicou no menu do post:', item.id);
                  console.log('HomeScreen - User ID:', user?.id);
                  console.log('HomeScreen - Post author.id:', item.author?.id);
                  console.log('HomeScreen - São iguais:', user?.id === item.author?.id);
                  setShowPostMenu(showPostMenu === item.id ? null : item.id);
                }}>
                  <Ionicons name="ellipsis-vertical" size={24} color="#8E8E93" />
                </MenuButton>
              )}
            </View>
          </PostHeader>
          
          <PostTitle>{item.title}</PostTitle>
          <PostContent>{item.content}</PostContent>
        </PostCard>
      </TouchableOpacity>
      
      {/* Menu dropdown para posts */}
      {showPostMenu === item.id && (
        <>
          <MenuOverlay onPress={() => setShowPostMenu(null)} />
          <MenuContainer>
            <MenuItem onPress={() => handleEditPost(item)}>
              <MenuItemText>Editar</MenuItemText>
            </MenuItem>
            <MenuItem onPress={() => handleDeletePost(item.id)}>
              <MenuItemTextDanger>Deletar</MenuItemTextDanger>
            </MenuItem>
          </MenuContainer>
        </>
      )}
    </View>
    );
  };

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
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
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
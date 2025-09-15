import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesContext } from '../context/FavoritesContext';
import apiService from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Componentes styled para o design da tela de perfil
const ProfileContainer = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 24px;
  padding-top: 50px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5EA;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  flex: 1;
`;

const ProfileContent = styled.ScrollView`
  flex: 1;
`;

const UserInfoSection = styled.View`
  padding: 24px;
  background-color: #FFFFFF;
`;

const ProfileImageContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #E5E5EA;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const ProfileImageText = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #8E8E93;
`;

const UserName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  margin-bottom: 4px;
`;

const UserUsername = styled.Text`
  font-size: 16px;
  color: #8E8E93;
  text-align: center;
  margin-bottom: 20px;
`;

const ContactInfoContainer = styled.View`
  background-color: #F8F9FA;
  border-radius: 12px;
  padding: 16px;
`;

const ContactItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const ContactIcon = styled.View`
  width: 20px;
  margin-right: 12px;
`;

const ContactText = styled.Text`
  font-size: 14px;
  color: #5E6064;
  flex: 1;
`;

const PostsSection = styled.View`
  padding: 24px;
`;

const PostsTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 16px;
`;

const PostCard = styled.View`
  background-color: #F8F9FA;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const PostHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const PostAuthorImage = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #E5E5EA;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const PostAuthorImageText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #8E8E93;
`;

const PostAuthorInfo = styled.View`
  flex: 1;
`;

const PostAuthorName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
`;

const PostAuthorUsername = styled.Text`
  font-size: 14px;
  color: #8E8E93;
`;

const FavoriteButton = styled.TouchableOpacity`
  padding: 4px;
`;

const PostTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
  line-height: 22px;
`;

const PostContent = styled.Text`
  font-size: 14px;
  color: #5E6064;
  line-height: 20px;
`;

interface ProfileScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
  route: RouteProp<RootStackParamList, 'Profile'>;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  // Verificar se route.params existe
  if (!route?.params?.userId) {
    console.error('ProfileScreen - userId não encontrado nos parâmetros');
    return (
      <ProfileContainer>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </BackButton>
          <HeaderTitle>Erro</HeaderTitle>
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FF3B30', fontSize: 16 }}>
            Erro: ID do usuário não encontrado
          </Text>
        </View>
      </ProfileContainer>
    );
  }

  const { userId } = route.params;
  
  // Proteção para evitar crash se o contexto não estiver disponível
  let favoritesContext;
  try {
    favoritesContext = useFavoritesContext();
  } catch (error) {
    console.error('ProfileScreen - Erro ao acessar contexto de favoritos:', error);
    // Valores padrão para evitar crash
    favoritesContext = {
      favorites: [],
      toggleFavorite: () => {},
      isFavorite: () => false,
      addFavorite: () => {},
      removeFavorite: () => {}
    };
  }
  
  const { favorites, toggleFavorite, isFavorite } = favoritesContext;
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('ProfileScreen - userId recebido:', userId);
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    console.log('ProfileScreen - Iniciando carregamento do perfil...');
    setIsLoading(true);
    try {
      // Simular dados do usuário (em uma API real, você faria uma chamada específica)
      const mockUser = {
        id: userId,
        name: 'Lorem Ipsum Dolor',
        username: '@loremipsum',
        email: 'Loremipsum@gmail.com',
        location: 'Rua lorem ipsum, Fortaleza-CE',
        job: 'Lorem Ipsum Dolor',
        phone: '(85) 9 9999-9999'
      };
      
      console.log('ProfileScreen - Usuário mockado:', mockUser);
      setUser(mockUser);

      // Carregar posts reais do usuário
      console.log('ProfileScreen - Carregando posts reais do usuário:', userId);
      try {
        const realPosts = await apiService.getUserPosts(userId);
        console.log('ProfileScreen - Posts reais carregados:', realPosts.length);
        setUserPosts(realPosts);
      } catch (apiError) {
        console.error('ProfileScreen - Erro ao carregar posts reais:', apiError);
        
        // Fallback: usar posts mockados se a API falhar
        console.log('ProfileScreen - Usando posts mockados como fallback...');
        const mockPosts = [
          {
            id: '1',
            title: 'Primeiro post do usuário',
            content: 'Este é o primeiro post deste usuário. Conteúdo interessante aqui.',
            author: {
              id: userId,
              name: mockUser.name,
              username: mockUser.username
            },
            created_at: new Date().toISOString(),
            tags: ['exemplo', 'teste']
          },
          {
            id: '2',
            title: 'Segundo post do usuário',
            content: 'Este é o segundo post. Mais conteúdo interessante para mostrar.',
            author: {
              id: userId,
              name: mockUser.name,
              username: mockUser.username
            },
            created_at: new Date().toISOString(),
            tags: ['exemplo', 'teste']
          }
        ];
        
        console.log('ProfileScreen - Posts mockados aplicados:', mockPosts.length);
        setUserPosts(mockPosts);
      }
      
    } catch (error) {
      console.error('ProfileScreen - Erro ao carregar perfil do usuário:', error);
      // Em caso de erro, definir arrays vazios para evitar crash
      setUserPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFavorite = (postId: string) => {
    toggleFavorite(postId);
  };

  if (isLoading || !user) {
    return (
      <ProfileContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="hourglass-outline" size={48} color="#8E8E93" />
        </View>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </BackButton>
        <HeaderTitle>Perfil</HeaderTitle>
      </Header>
      
      <ProfileContent showsVerticalScrollIndicator={false}>
        <UserInfoSection>
          <ProfileImageContainer>
            <ProfileImage>
              <ProfileImageText>
                {user.name.charAt(0).toUpperCase()}
              </ProfileImageText>
            </ProfileImage>
            <UserName>{user.name}</UserName>
            <UserUsername>{user.username}</UserUsername>
          </ProfileImageContainer>

          <ContactInfoContainer>
            <ContactItem>
              <ContactIcon>
                <Ionicons name="mail-outline" size={16} color="#8E8E93" />
              </ContactIcon>
              <ContactText>{user.email}</ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>
                <Ionicons name="location-outline" size={16} color="#8E8E93" />
              </ContactIcon>
              <ContactText>{user.location}</ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>
                <Ionicons name="briefcase-outline" size={16} color="#8E8E93" />
              </ContactIcon>
              <ContactText>{user.job}</ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>
                <Ionicons name="call-outline" size={16} color="#8E8E93" />
              </ContactIcon>
              <ContactText>{user.phone}</ContactText>
            </ContactItem>
          </ContactInfoContainer>
        </UserInfoSection>

        <PostsSection>
          <PostsTitle>Publicações</PostsTitle>
          {userPosts && userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post.id}>
                <PostHeader>
                  <PostAuthorImage>
                    <PostAuthorImageText>
                      {post.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </PostAuthorImageText>
                  </PostAuthorImage>
                  <PostAuthorInfo>
                    <PostAuthorName>{post.author?.name || 'Usuário'}</PostAuthorName>
                    <PostAuthorUsername>{post.author?.username || '@usuario'}</PostAuthorUsername>
                  </PostAuthorInfo>
                  <FavoriteButton onPress={() => handleFavorite(post.id)}>
                    <Ionicons 
                      name={isFavorite(post.id) ? "star" : "star-outline"} 
                      size={20} 
                      color={isFavorite(post.id) ? "#FFD700" : "#8E8E93"} 
                    />
                  </FavoriteButton>
                </PostHeader>
                <PostTitle>{post.title || 'Título não disponível'}</PostTitle>
                <PostContent>
                  {post.content && post.content.length > 100 
                    ? `${post.content.substring(0, 100)}...` 
                    : post.content || 'Conteúdo não disponível'
                  }
                </PostContent>
              </PostCard>
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#8E8E93', fontSize: 16 }}>
                Nenhuma publicação encontrada
              </Text>
            </View>
          )}
        </PostsSection>
      </ProfileContent>
    </ProfileContainer>
  );
};

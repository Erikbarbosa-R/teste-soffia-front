import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesContext } from '../context/FavoritesContext';
import apiService from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Componentes styled para o design da tela de detalhes
const DetailContainer = styled.View`
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

const FavoriteButton = styled.TouchableOpacity`
  padding: 8px;
`;


const PostSection = styled.View`
  margin-bottom: 32px;
`;

const AuthorSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const ProfileImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #E5E5EA;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const ProfileImageText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #8E8E93;
`;

const AuthorInfo = styled.View`
  flex: 1;
`;

const AuthorName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
`;

const AuthorUsername = styled.Text`
  font-size: 14px;
  color: #8E8E93;
  margin-top: 2px;
`;

const PostTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 12px;
  line-height: 28px;
`;

const PostContent = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  line-height: 16px;
  letter-spacing: 0px;
`;

const CommentsSection = styled.View`
  margin-top: 12px;
 
  padding-top: 12px;
`;

const CommentsTitleContainer = styled.View`
  margin-top: 10px;
`;

const CommentsTitleLine = styled.View`
  height: 1px;
  background-color: #E5E5EA;
  margin-left: -24px;
  margin-right: -24px;
`;

const CommentsTitleLineTop = styled.View`
  height: 1px;
  background-color: #E5E5EA;
  margin-bottom: 12px;
  margin-left: -24px;
  margin-right: -24px;
`;

const CommentsTitleLineBottom = styled.View`
  height: 1px;
  background-color: #E5E5EA;
  margin-top: 1px;
  margin-left: -24px;
  margin-right: -24px;
`;

const CommentsTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  text-align: left;
  margin-top: 8px;
  margin-bottom: 12px;
  width: 350px;
  height: 27px;
  line-height: 20px;
  letter-spacing: -0.4px;
`;

const CommentItem = styled.View`
  padding: 12px 0;
  margin-bottom: 1px;
  width: 100%;
`;

const CommentHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 2px;
`;

const CommentTextContainer = styled.View`
  margin-left: 32px;
`;

const CommentSeparator = styled.View`
  height: 1px;
  background-color: #E5E5EA;
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: 1px;
`;

const CommentProfileImage = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #E5E5EA;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
`;

const CommentProfileImageText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #8E8E93;
`;

const CommentContent = styled.View`
  flex: 1;
`;

const CommentAuthorName = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #5E6064;
  margin-bottom: 4px;
  line-height: 16px;
  letter-spacing: -0.32px;
`;

const CommentText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  line-height: 16px;
  letter-spacing: 0px;
`;

const Overlay = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const CommentInputSection = styled.View`
  background-color: #FFFFFF;
  padding: 16px 24px;
  border-top-width: 1px;
  border-top-color: #E5E5EA;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const CommentInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #EFF1F5;
  border-radius: 10px;
  padding: 12px 16px;
`;

const CommentInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #000000;
  margin-right: 12px;
  min-width: 0;
`;

const SendButton = styled.TouchableOpacity`
  background-color: #007AFF;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

interface PostDetailScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PostDetail'>;
  route: RouteProp<RootStackParamList, 'PostDetail'>;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ navigation, route }) => {
  const { postId } = route.params;
  const { favorites, toggleFavorite, isFavorite } = useFavoritesContext();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadPostDetails();
  }, [postId]);

  const loadPostDetails = async () => {
    setIsLoading(true);
    try {
      // Carregar todos os posts para encontrar o post específico
      const response = await apiService.getPosts(1, 100, '');
      const postsData = response?.data?.posts || [];
      const foundPost = postsData.find((p: any) => p.id === postId);
      
      if (foundPost) {
        setPost(foundPost);
        // Simular comentários (em uma API real, você faria uma chamada separada)
        setComments([
          {
            id: '1',
            author: {
              name: 'Maria Silva',
              username: '@mariasilva'
            },
            content: 'Muito interessante este post! Gostei bastante da abordagem.',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            author: {
              name: 'João Santos',
              username: '@joaosantos'
            },
            content: 'Concordo totalmente com o que foi dito aqui. Parabéns pelo conteúdo!',
            createdAt: '2024-01-15T11:15:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFavorite = () => {
    if (post) {
      toggleFavorite(post.id);
    }
  };

  const handleSendComment = () => {
    if (newComment.trim() && post) {
      const comment = {
        id: Date.now().toString(),
        author: {
          name: 'Você',
          username: '@usuario'
        },
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
    }
  };

  const handleInputFocus = () => {
    console.log('Campo de comentário focado');
    setIsInputFocused(true);
    // Scroll para o final quando o input for focado
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleInputBlur = () => {
    console.log('Campo de comentário perdeu foco');
    setIsInputFocused(false);
  };

  if (isLoading || !post) {
    return (
      <DetailContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="hourglass-outline" size={48} color="#8E8E93" />
        </View>
      </DetailContainer>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <DetailContainer>
        <Header>
          <BackButton onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </BackButton>
          <HeaderTitle>
            Publicação
          </HeaderTitle>
        </Header>
        
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            padding: 24, 
            paddingBottom: 100 
          }}
          showsVerticalScrollIndicator={false}
        >
          <PostSection>
            <AuthorSection>
              <ProfileImage>
                <ProfileImageText>
                  {post.author.name.charAt(0).toUpperCase()}
                </ProfileImageText>
              </ProfileImage>
              <AuthorInfo>
                <AuthorName>{post.author.name}</AuthorName>
                <AuthorUsername>@{post.author.name.toLowerCase().replace(/\s+/g, '')}</AuthorUsername>
              </AuthorInfo>
              <FavoriteButton onPress={handleFavorite}>
                <Ionicons 
                  name={isFavorite(post.id) ? "star" : "star-outline"} 
                  size={24} 
                  color={isFavorite(post.id) ? "#FFD700" : "#8E8E93"} 
                />
              </FavoriteButton>
            </AuthorSection>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>{post.content}</PostContent>
          </PostSection>

          <CommentsSection>
            <CommentsTitleContainer>
              <CommentsTitleLineTop />
              <CommentsTitle>Comentários</CommentsTitle>
              <CommentsTitleLineBottom />
            </CommentsTitleContainer>
            {comments.map((comment, index) => (
              <View key={comment.id}>
                <CommentItem>
                  <CommentHeader>
                    <CommentProfileImage>
                      <CommentProfileImageText>
                        {comment.author.name.charAt(0).toUpperCase()}
                      </CommentProfileImageText>
                    </CommentProfileImage>
                    <CommentAuthorName>{comment.author.name}</CommentAuthorName>
                  </CommentHeader>
                  <CommentTextContainer>
                    <CommentText>{comment.content}</CommentText>
                  </CommentTextContainer>
                </CommentItem>
                <CommentSeparator />
              </View>
            ))}
          </CommentsSection>
        </ScrollView>

        <CommentInputSection>
          <CommentInputContainer>
            {!isInputFocused && (
              <Ionicons name="chatbubble-outline" size={20} color="#8E8E93" />
            )}
            <CommentInput
              placeholder="Adicione um comentário"
              placeholderTextColor="#8E8E93"
              value={newComment}
              onChangeText={setNewComment}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              multiline={false}
              maxLength={500}
              autoCorrect={false}
              autoCapitalize="sentences"
              returnKeyType="send"
              onSubmitEditing={handleSendComment}
              blurOnSubmit={false}
              style={{ 
                flex: 1,
                fontSize: 16,
                color: '#000000',
                marginLeft: isInputFocused ? 0 : 8,
                marginRight: 12,
                paddingVertical: 0,
                paddingHorizontal: 0,
                textAlignVertical: 'center',
                minWidth: 0
              }}
            />
            {isInputFocused && (
              <SendButton onPress={handleSendComment} disabled={!newComment.trim()}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </SendButton>
            )}
          </CommentInputContainer>
        </CommentInputSection>

        {isInputFocused && <Overlay onPress={handleInputBlur} />}
      </DetailContainer>
    </KeyboardAvoidingView>
  );
};
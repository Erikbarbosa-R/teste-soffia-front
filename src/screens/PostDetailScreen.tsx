import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, BackHandler, Animated } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useAuthContext } from '../context/AuthContext';
import apiService from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  z-index: 10;
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
  margin-top: 16px;
`;

const AuthorSection = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  margin-top: 1px;
  margin-bottom: 2px;
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
  justify-content: space-between;
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
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const CommentInputSection = styled(Animated.View)`
  background-color: #FFFFFF;
  padding: 16px 24px;
  border-top-width: 1px;
  border-top-color: #E5E5EA;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  align-items: center;
`;

const CommentInputContainer = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  background-color: #EFF1F5;
  height: 48px;
  border-radius: 8px;
  padding-top: 12px;
  padding-right: 16px;
  padding-bottom: 12px;
  padding-left: 16px;
  position: relative;
`;

const CommentInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #000000;
  margin-right: 12px;
  min-width: 0;
`;

const CommentIcon = styled.View`
  position: absolute;
  left: 16px;
  z-index: 1;
`;

const SendButton = styled.TouchableOpacity`
  background-color: #007AFF;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const MenuButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
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

interface PostDetailScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'PostDetail'>;
  route: RouteProp<RootStackParamList, 'PostDetail'>;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ navigation, route }) => {
  const { postId } = route.params;
  const { favorites, toggleFavorite, isFavorite } = useFavoritesContext();
  const { user } = useAuthContext();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const inputPositionAnimation = useRef(new Animated.Value(0)).current;
  const inputWidthAnimation = useRef(new Animated.Value(350)).current;

  useEffect(() => {
    loadPostDetails();
  }, [postId]);

  // Recarregar comentários quando voltar à tela
  useFocusEffect(
    React.useCallback(() => {
      if (post) {
        loadComments();
      }
    }, [post])
  );

  // Configurar o botão de voltar do celular para desfocar o input
  useEffect(() => {
    const backAction = () => {
      if (isInputFocused) {
        // Se o input estiver focado, desfoca ele em vez de sair da tela
        inputRef.current?.blur();
        setIsInputFocused(false);
        return true; // Indica que o evento foi tratado
      }
      return false; // Permite o comportamento padrão (sair da tela)
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isInputFocused]);

  const loadPostDetails = async () => {
    setIsLoading(true);
    try {
      // Carregar o post específico com seus comentários
      const postData = await apiService.getPost(postId);
      console.log('PostDetailScreen - Post carregado:', postData);
      
      if (postData) {
        setPost(postData);
        // Os comentários vêm junto com o post
        const comments = postData.comments || [];
        setComments(comments);
        console.log('PostDetailScreen - Comentários carregados:', comments.length);
        // Salvar no AsyncStorage como backup
        await saveCommentsToStorage(comments);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do post:', error);
      // Se der erro, carregar do AsyncStorage
      await loadCommentsFromStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      // Carregar o post específico com seus comentários
      const postData = await apiService.getPost(postId);
      console.log('PostDetailScreen - Post recarregado:', postData);
      
      if (postData) {
        // Os comentários vêm junto com o post
        const comments = postData.comments || [];
        setComments(comments);
        console.log('PostDetailScreen - Comentários recarregados:', comments.length);
        // Salvar no AsyncStorage como backup
        await saveCommentsToStorage(comments);
      }
    } catch (commentError) {
      console.error('Erro ao recarregar comentários:', commentError);
      // Se der erro, carregar do AsyncStorage
      console.log('Carregando comentários do AsyncStorage devido ao erro da API');
      await loadCommentsFromStorage();
    }
  };

  const saveCommentsToStorage = async (comments: any[]) => {
    try {
      const key = `comments_${postId}`;
      await AsyncStorage.setItem(key, JSON.stringify(comments));
      console.log('Comentários salvos no AsyncStorage');
    } catch (error) {
      console.error('Erro ao salvar comentários no AsyncStorage:', error);
    }
  };

  const loadCommentsFromStorage = async () => {
    try {
      const key = `comments_${postId}`;
      const storedComments = await AsyncStorage.getItem(key);
      if (storedComments) {
        const comments = JSON.parse(storedComments);
        setComments(comments);
        console.log('Comentários carregados do AsyncStorage:', comments.length);
      } else {
        setComments([]);
        console.log('Nenhum comentário encontrado no AsyncStorage');
      }
    } catch (error) {
      console.error('Erro ao carregar comentários do AsyncStorage:', error);
      setComments([]);
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

  const handleSendComment = async () => {
    if (!newComment.trim() || !post) return;

    try {
      console.log('PostDetailScreen - Criando comentário...');
      const response = await apiService.createComment(post.id, {
        content: newComment.trim()
      });
      console.log('PostDetailScreen - Comentário criado:', response);
      
      // A API retorna o comentário dentro de response.data
      const newCommentData = (response as any)?.data || response;
      
      // Adicionar o novo comentário à lista
      setComments(prev => {
        const newComments = [...prev, newCommentData];
        // Salvar no AsyncStorage
        saveCommentsToStorage(newComments);
        return newComments;
      });
      setNewComment('');
      
      // Desfocar o input automaticamente após enviar o comentário
      inputRef.current?.blur();
      setIsInputFocused(false);
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      // Aqui você pode adicionar um alert ou toast para mostrar o erro
    }
  };

  const handleDeletePost = async () => {
    if (post) {
      try {
        console.log('Deletando post:', post.id);
        await apiService.deletePost(post.id);
        console.log('Post deletado com sucesso');
        setShowPostMenu(false);
        navigation.goBack();
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      console.log('Deletando comentário:', commentId);
      await apiService.deleteComment(post.id, commentId);
      console.log('Comentário deletado com sucesso');
      setComments(prev => {
        const newComments = prev.filter(comment => comment.id !== commentId);
        // Salvar no AsyncStorage
        saveCommentsToStorage(newComments);
        return newComments;
      });
      setShowCommentMenu(null);
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  const handleInputFocus = () => {
    console.log('Campo de comentário focado');
    setIsInputFocused(true);
    
    // Animar o input para cima quando focado
    Animated.parallel([
      Animated.timing(inputPositionAnimation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(inputWidthAnimation, {
        toValue: 325,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start();
    
    // Scroll para o final quando o input for focado
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleInputBlur = () => {
    console.log('Campo de comentário perdeu foco');
    setIsInputFocused(false);
    
    // Animar o input de volta para a posição inicial
    Animated.parallel([
      Animated.timing(inputPositionAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(inputWidthAnimation, {
        toValue: 350,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleOutsidePress = () => {
    if (isInputFocused) {
      inputRef.current?.blur();
      setIsInputFocused(false);
    }
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
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <ProfileImage>
                  <ProfileImageText>
                    {post.author.nome.charAt(0).toUpperCase()}
                  </ProfileImageText>
                </ProfileImage>
                <AuthorInfo>
                  <AuthorName>{post.author.nome}</AuthorName>
                  <AuthorUsername>@{post.author.nome.toLowerCase().replace(/\s+/g, '')}</AuthorUsername>
                </AuthorInfo>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FavoriteButton onPress={handleFavorite}>
                  <Ionicons 
                    name={isFavorite(post.id) ? "star" : "star-outline"} 
                    size={24} 
                    color={isFavorite(post.id) ? "#FFD700" : "#8E8E93"} 
                  />
                </FavoriteButton>
                {/* Menu de 3 pontos - só aparece se o usuário for o autor */}
                {user && post?.author?.id === user?.id && (
                  <MenuButton onPress={() => setShowPostMenu(!showPostMenu)}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#8E8E93" />
                  </MenuButton>
                )}
              </View>
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
            {comments.map((comment, index) => {
              console.log('PostDetailScreen - Renderizando comentário:', comment.id);
              console.log('PostDetailScreen - User atual:', user);
              console.log('PostDetailScreen - Comment user:', comment.user);
              console.log('PostDetailScreen - Comment user.id:', comment.user?.id);
              console.log('PostDetailScreen - User ID:', user?.id);
              console.log('PostDetailScreen - Condição para mostrar menu:', user && comment.user?.id === user.id);
              
              return (
              <View key={comment.id}>
                <CommentItem>
                  <CommentHeader>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <CommentProfileImage>
                        <CommentProfileImageText>
                          {comment.user?.nome?.charAt(0)?.toUpperCase() || '?'}
                        </CommentProfileImageText>
                      </CommentProfileImage>
                      <CommentAuthorName>{comment.user?.nome || 'Usuário'}</CommentAuthorName>
                    </View>
                    {/* Menu de 3 pontos para comentários - só aparece se o usuário for o autor */}
                    {user && comment.user?.id === user.id && (
                      <MenuButton onPress={() => {
                        console.log('PostDetailScreen - Clicou no menu do comentário:', comment.id);
                        console.log('PostDetailScreen - User ID:', user?.id);
                        console.log('PostDetailScreen - Comment user.id:', comment.user?.id);
                        console.log('PostDetailScreen - São iguais:', user?.id === comment.user?.id);
                        setShowCommentMenu(showCommentMenu === comment.id ? null : comment.id);
                      }}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#8E8E93" />
                      </MenuButton>
                    )}
                  </CommentHeader>
                  <CommentTextContainer>
                    <CommentText>{comment.content}</CommentText>
                  </CommentTextContainer>
                </CommentItem>
                <CommentSeparator />
                
                {/* Menu dropdown para comentários */}
                {showCommentMenu === comment.id && (
                  <>
                    <MenuOverlay onPress={() => setShowCommentMenu(null)} />
                    <MenuContainer style={{ top: 80, right: 20 }}>
                      <MenuItem onPress={() => handleDeleteComment(comment.id)}>
                        <MenuItemTextDanger>Deletar</MenuItemTextDanger>
                      </MenuItem>
                    </MenuContainer>
                  </>
                )}
              </View>
              );
            })}
          </CommentsSection>
        </ScrollView>

        {/* Menu dropdown para posts */}
        {showPostMenu && (
          <>
            <MenuOverlay onPress={() => setShowPostMenu(false)} />
            <MenuContainer>
              <MenuItem onPress={handleDeletePost}>
                <MenuItemTextDanger>Deletar</MenuItemTextDanger>
              </MenuItem>
            </MenuContainer>
          </>
        )}

        <CommentInputSection
          style={{
            bottom: inputPositionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [Platform.OS === 'ios' ? 0 : 40, Platform.OS === 'ios' ? 380 : 330],
            }),
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <CommentInputContainer
              style={{
                width: inputWidthAnimation,
              }}
            >
              {!isInputFocused && (
                <CommentIcon>
                  <Ionicons name="chatbubble-outline" size={16} color="#8E8E93" />
                </CommentIcon>
              )}
              <TextInput
                ref={inputRef}
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
                  paddingVertical: 0,
                  paddingHorizontal: isInputFocused ? 0 : 24,
                  textAlignVertical: 'center',
                  minWidth: 0
                }}
              />
            </CommentInputContainer>
            {isInputFocused && (
              <SendButton onPress={handleSendComment} disabled={!newComment.trim()}>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
              </SendButton>
            )}
          </View>
        </CommentInputSection>
      </DetailContainer>
    </TouchableWithoutFeedback>
  );
};
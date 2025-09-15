import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../context/AuthContext';
import { usePosts } from '../hooks/useHooks';
import apiService from '../services/api';

const CreatePostContainer = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  padding-top: 50px;
  background-color: #FFFFFF;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  flex: 1;
  text-align: center;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 24px;
`;

const InputContainer = styled.View`
  margin-bottom: 24px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
`;

const TitleInput = styled.TextInput`
  background-color: #F2F2F7;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #000000;
  min-height: 56px;
`;

const ContentInput = styled.TextInput`
  background-color: #F2F2F7;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #000000;
  min-height: 200px;
  text-align-vertical: top;
`;

const PublishButtonSection = styled(Animated.View)`
  position: absolute;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 16px 24px;
  border-top-width: 1px;
  border-top-color: #E5E5EA;
`;

const PublishButton = styled.TouchableOpacity<{ disabled?: boolean; isPublishing?: boolean }>`
  background-color: ${props => props.isPublishing ? '#C6C6C8' : '#007AFF'};
  padding: 16px 24px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  opacity: ${props => props.disabled && !props.isPublishing ? 0.5 : 1};
`;

const PublishButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
`;

interface CreatePostScreenProps {
  navigation: any;
  route?: {
    params?: {
      editMode?: boolean;
      postId?: string;
      postData?: {
        title: string;
        content: string;
        tags?: any[];
      };
    };
  };
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation, route }) => {
  const { isAuthenticated, user } = useAuthContext();
  const { createPost } = usePosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  // Verificar se está em modo de edição
  const isEditMode = route?.params?.editMode || false;
  const postId = route?.params?.postId;
  const postData = route?.params?.postData;

  // Inicializar campos com dados do post em modo de edição
  useEffect(() => {
    if (isEditMode && postData) {
      setTitle(postData.title || '');
      setContent(postData.content || '');
    }
  }, [isEditMode, postData]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    
    Animated.timing(buttonAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    
    Animated.timing(buttonAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleOutsidePress = () => {
    if (isInputFocused) {
      Keyboard.dismiss();
      setIsInputFocused(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;

    console.log('CreatePostScreen - Usuário atual:', user);
    console.log('CreatePostScreen - isAuthenticated:', isAuthenticated);
    console.log('CreatePostScreen - Modo de edição:', isEditMode);
    console.log('CreatePostScreen - User existe:', !!user);
    console.log('CreatePostScreen - User tem ID:', !!user?.id);

    setIsLoading(true);
    try {
      if (isAuthenticated && user && user.id) {
        if (isEditMode && postId) {
          // Modo de edição
          console.log('CreatePostScreen - Editando post...');
          console.log('CreatePostScreen - Dados de edição:', {
            postId,
            title: title.trim(),
            content: content.trim(),
            tags: postData?.tags || []
          });
          
          await apiService.updatePost(postId, {
            title: title.trim(),
            content: content.trim(),
            tags: postData?.tags || []
          });
          console.log('CreatePostScreen - Post editado com sucesso');
        } else {
          // Modo de criação
          console.log('CreatePostScreen - Criando post...');
          console.log('CreatePostScreen - User completo:', user);
          console.log('CreatePostScreen - User ID:', user?.id);
          console.log('CreatePostScreen - User ID tipo:', typeof user?.id);
          
          const postData = {
            title: title.trim(),
            content: content.trim(),
            author: user?.id,
            tags: []
          };
          
          console.log('CreatePostScreen - Dados do post:', postData);
          const newPost = await createPost(postData);
          console.log('CreatePostScreen - Post criado com sucesso:', newPost);
        }
        
        // Limpar campos após sucesso
        setTitle('');
        setContent('');
      } else {
        console.error('CreatePostScreen - Usuário não encontrado ou não autenticado');
        throw new Error('Usuário não autenticado');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('CreatePostScreen - Erro ao processar post:', error);
      
      // Mostrar erro mais específico
      if (error instanceof Error) {
        console.error('CreatePostScreen - Mensagem de erro:', error.message);
      }
      
      // Aqui você pode adicionar um alert ou toast para mostrar o erro
      // Por enquanto, apenas volta para a tela anterior
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !title.trim() || !content.trim();
  const isPublishing = isLoading;

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <CreatePostContainer> 
        <ContentContainer>
          <InputContainer>
            <InputLabel>Título da publicação</InputLabel>
            <TitleInput
              placeholder="Adicione um título"
              placeholderTextColor="#8E8E93"
              value={title}
              onChangeText={setTitle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              maxLength={100}
            />
          </InputContainer>

          <InputContainer>
            <InputLabel>Texto da publicação</InputLabel>
            <ContentInput
              placeholder="O que gostaria de compartilhar?"
              placeholderTextColor="#8E8E93"
              value={content}
              onChangeText={setContent}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
          </InputContainer>
        </ContentContainer>

        <PublishButtonSection
          style={{
            bottom: 0,
            transform: [{
              translateY: buttonAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Platform.OS === 'ios' ? -380 : -330],
              })
            }]
          }}
        >
          <PublishButton 
            onPress={handlePublish} 
            disabled={isDisabled}
            isPublishing={isPublishing}
          >
            <Ionicons 
              name="paper-plane" 
              size={20} 
              color="#FFFFFF" 
            />
            <PublishButtonText>
              {isPublishing 
                ? (isEditMode ? 'Salvando...' : 'Publicando...') 
                : (isEditMode ? 'Salvar' : 'Publicar')
              }
            </PublishButtonText>
          </PublishButton>
        </PublishButtonSection>
      </CreatePostContainer>
    </TouchableWithoutFeedback>
  );
};
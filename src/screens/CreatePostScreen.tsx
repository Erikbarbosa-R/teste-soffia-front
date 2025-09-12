import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

// Componentes styled para o design da imagem
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

const PublishButton = styled.TouchableOpacity<{ disabled?: boolean; isPublishing?: boolean }>`
  background-color: ${props => props.isPublishing ? '#C6C6C8' : '#007AFF'};
  padding: 16px 24px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  margin-top: auto;
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
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    navigation.goBack();
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsLoading(true);
    try {
      // Criar o post usando a API
      if (user) {
        await apiService.createPost(
          { title: title.trim(), content: content.trim() },
          user.id
        );
      }
      
      // Voltar para a tela anterior
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar post:', error);
      // Mesmo com erro, volta para a tela anterior
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !title.trim() || !content.trim();
  const isPublishing = isLoading;

  return (
    <CreatePostContainer>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ContentContainer>
          <InputContainer>
            <InputLabel>Título da publicação</InputLabel>
            <TitleInput
              placeholder="Adicione um título"
              placeholderTextColor="#8E8E93"
              value={title}
              onChangeText={setTitle}
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
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
          </InputContainer>

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
              {isPublishing ? 'Publicando...' : 'Publicar'}
            </PublishButtonText>
          </PublishButton>
        </ContentContainer>
      </KeyboardAvoidingView>
    </CreatePostContainer>
  );
};

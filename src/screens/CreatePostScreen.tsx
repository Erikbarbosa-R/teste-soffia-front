import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback, Keyboard, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../context/AuthContext';
import { usePosts } from '../hooks/useHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const { createPost, updatePost } = usePosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  // Função para adicionar logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev.slice(-9), logMessage]); // Manter apenas os últimos 10 logs
  };

  // Verificar se está em modo de edição
  const isEditMode = route?.params?.editMode || false;
  const postId = route?.params?.postId;
  const postData = route?.params?.postData;

  // Debug: verificar se os parâmetros estão chegando
  console.log('CreatePostScreen - route:', route);
  console.log('CreatePostScreen - route.params:', route?.params);
  console.log('CreatePostScreen - editMode:', route?.params?.editMode);
  console.log('CreatePostScreen - isEditMode:', isEditMode);

  // Log inicial quando a tela carrega
  useEffect(() => {
    addLog('=== TELA CARREGADA ===');
    addLog(`Route: ${JSON.stringify(route)}`);
    addLog(`Route params: ${JSON.stringify(route?.params)}`);
    addLog(`isEditMode: ${isEditMode}`);
    addLog(`postId: ${postId}`);
    addLog(`postData: ${JSON.stringify(postData)}`);
    addLog(`route?.params?.editMode: ${route?.params?.editMode}`);
    addLog(`typeof route?.params?.editMode: ${typeof route?.params?.editMode}`);
  }, []);

  // Log dos parâmetros recebidos
  useEffect(() => {
    addLog(`Parâmetros: editMode=${isEditMode}, postId=${postId}`);
    addLog(`PostData: ${JSON.stringify(postData)}`);
    addLog(`Estado: title="${title}", content="${content}"`);
    addLog(`Route params: ${JSON.stringify(route?.params)}`);
  }, [isEditMode, postId, postData, title, content, route?.params]);

  // Inicializar campos com dados do post em modo de edição
  useEffect(() => {
    addLog(`Inicializando campos - isEditMode: ${isEditMode}, postData: ${!!postData}`);
    if (isEditMode && postData) {
      addLog(`Inicializando com dados: title="${postData.title}", content="${postData.content}"`);
      setTitle(postData.title || '');
      setContent(postData.content || '');
    }
  }, [isEditMode, postData]);

  const handleTestAPI = async () => {
    addLog('=== INICIANDO TESTE DA API ===');
    try {
      const token = await AsyncStorage.getItem('@app:user_token');
      addLog(`Token encontrado: ${!!token}`);
      
      if (!token) {
        addLog('ERRO: Token não encontrado!');
        return;
      }
      
      // Primeiro teste: GET para verificar se a API está funcionando
      addLog('Teste 1: GET /posts');
      const getUrl = 'https://teste-back-soffia-production.up.railway.app/api/posts';
      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      addLog(`GET Status: ${getResponse.status}`);
      const getData = await getResponse.text();
      addLog(`GET Resposta: ${getData.substring(0, 200)}...`);
      
      // Tentar encontrar um post real para testar
      let realPostId = postId;
      try {
        const posts = JSON.parse(getData);
        if (posts && posts.length > 0) {
          realPostId = posts[0].id;
          addLog(`Post encontrado para teste: ${realPostId}`);
        }
      } catch (e) {
        addLog('Não foi possível parsear posts');
      }
      
      // Segundo teste: PUT com ID real
      addLog('Teste 2: PUT /posts/{id}');
      const putUrl = `https://teste-back-soffia-production.up.railway.app/api/posts/${realPostId}`;
      const testPayload = {
        title: 'Teste de atualização - ' + new Date().toLocaleTimeString(),
        content: 'Conteúdo de teste atualizado',
        author: user?.id || 'test-author-id',
        tags: []
      };
      
      addLog(`PUT URL: ${putUrl}`);
      addLog(`PUT Payload: ${JSON.stringify(testPayload)}`);
      
      const putResponse = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });
      
      addLog(`PUT Status: ${putResponse.status} ${putResponse.statusText}`);
      
      const putData = await putResponse.text();
      addLog(`PUT Resposta: ${putData}`);
      
      // Tentar parsear como JSON
      try {
        const jsonData = JSON.parse(putData);
        addLog(`PUT JSON válido: ${JSON.stringify(jsonData)}`);
      } catch (parseError) {
        addLog('PUT Resposta não é JSON válido');
      }
      
    } catch (error: any) {
      addLog(`ERRO: ${error.message}`);
    }
  };

  const handleTestCreate = async () => {
    addLog('=== TESTE DE CRIAÇÃO ===');
    try {
      const token = await AsyncStorage.getItem('@app:user_token');
      addLog(`Token encontrado: ${!!token}`);
      
      if (!token) {
        addLog('ERRO: Token não encontrado!');
        return;
      }
      
      const createUrl = 'https://teste-back-soffia-production.up.railway.app/api/posts';
      const createPayload = {
        title: 'Teste de criação - ' + new Date().toLocaleTimeString(),
        content: 'Conteúdo de teste para criação',
        author: user?.id || 'test-author-id',
        tags: []
      };
      
      addLog(`POST URL: ${createUrl}`);
      addLog(`POST Payload: ${JSON.stringify(createPayload)}`);
      
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPayload),
      });
      
      addLog(`POST Status: ${createResponse.status} ${createResponse.statusText}`);
      
      const createData = await createResponse.text();
      addLog(`POST Resposta: ${createData}`);
      
      // Tentar parsear como JSON
      try {
        const jsonData = JSON.parse(createData);
        addLog(`POST JSON válido: ${JSON.stringify(jsonData)}`);
      } catch (parseError) {
        addLog('POST Resposta não é JSON válido');
      }
      
    } catch (error: any) {
      addLog(`ERRO: ${error.message}`);
    }
  };

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

    addLog('=== INICIANDO PUBLICAÇÃO ===');
    addLog(`Usuário: ${user?.nome || 'N/A'}`);
    addLog(`Autenticado: ${isAuthenticated}`);
    addLog(`Modo edição: ${isEditMode}`);
    addLog(`Post ID: ${postId}`);

    setIsLoading(true);
    try {
      if (isAuthenticated && user && user.id) {
        if (isEditMode && postId) {
          // Modo de edição
          addLog('Editando post...');
          
          // Verificar se o token está presente
          const token = await AsyncStorage.getItem('@app:user_token');
          addLog(`Token presente: ${!!token}`);
          addLog(`User ID: ${user.id}`);
          
          if (!token) {
            addLog('ERRO: Token não encontrado');
            throw new Error('Token de autenticação não encontrado');
          }
          
          const testPayload = {
            title: title.trim(),
            content: content.trim(),
            author: user.id,
            tags: postData?.tags || []
          };
          addLog(`Payload: ${JSON.stringify(testPayload)}`);
          
          addLog('Chamando updatePost...');
          addLog(`PostId: ${postId}`);
          addLog(`Payload final: ${JSON.stringify(testPayload)}`);
          
          try {
            const result = await updatePost(postId, testPayload);
            addLog(`Resultado da atualização: ${JSON.stringify(result)}`);
            addLog('Post editado com sucesso!');
          } catch (updateError: any) {
            addLog(`ERRO na atualização: ${updateError.message}`);
            addLog(`Erro completo: ${JSON.stringify(updateError)}`);
            throw updateError;
          }
          
          // Navegar de volta após edição bem-sucedida
          navigation.goBack();
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
          
          // Limpar campos após criação bem-sucedida
          setTitle('');
          setContent('');
          
          // Navegar de volta após criação bem-sucedida
          navigation.goBack();
        }
      } else {
        console.error('CreatePostScreen - Usuário não encontrado ou não autenticado');
        throw new Error('Usuário não autenticado');
      }
    } catch (error: any) {
      console.error('CreatePostScreen - Erro ao processar post:', error);
      
      // Mostrar erro específico
      let errorMessage = 'Erro ao salvar publicação';
      if (error?.message?.includes('não encontrado')) {
        errorMessage = 'Post não encontrado';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Não autorizado. Faça login novamente';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Post não encontrado';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.error('CreatePostScreen - Erro:', errorMessage);
      
      // Aqui você pode adicionar um Alert ou Toast para mostrar o erro
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
        <Header>
          <HeaderTitle>
            {isEditMode ? 'Editando' : 'Nova Publicação'}
          </HeaderTitle>
          <CloseButton onPress={handleClose}>
            <Ionicons name="close" size={24} color="#007AFF" />
          </CloseButton>
        </Header>
        
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

        {/* Área de logs - sempre visível para debug */}
        {logs.length > 0 && (
          <View style={{
            position: 'absolute',
            top: 100,
            left: 20,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 10,
            borderRadius: 8,
            maxHeight: 200,
            zIndex: 1000
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
              LOGS DE DEBUG:
            </Text>
            <ScrollView style={{ maxHeight: 150 }}>
              {logs.map((log, index) => (
                <Text key={index} style={{ color: 'white', fontSize: 10, marginBottom: 2 }}>
                  {log}
                </Text>
              ))}
            </ScrollView>
          </View>
        )}

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
          {/* Botões de teste temporários */}
          {isEditMode && (
            <>
              <PublishButton 
                onPress={handleTestAPI} 
                disabled={false}
                isPublishing={false}
                style={{ backgroundColor: '#FF6B6B', marginBottom: 10 }}
              >
                <Ionicons 
                  name="bug" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <PublishButtonText>Testar API</PublishButtonText>
              </PublishButton>
              
              <PublishButton 
                onPress={handleTestCreate} 
                disabled={false}
                isPublishing={false}
                style={{ backgroundColor: '#4CAF50', marginBottom: 10 }}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <PublishButtonText>Testar Criar</PublishButtonText>
              </PublishButton>
            </>
          )}
          
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
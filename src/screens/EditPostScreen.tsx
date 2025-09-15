import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, TouchableWithoutFeedback, Keyboard, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../context/AuthContext';
import { usePosts } from '../hooks/useHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import { 
showErrorToast, 
showSuccessToast, 
showInfoToast,
showApiErrorToast,
showTestResultToast 
} from '../utils';
const EditPostContainer = styled.View`
flex: 1;
background-color: #FFFFFF;
`;
const Header = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 16px 20px;
border-bottom-width: 1px;
border-bottom-color: #E5E5EA;
`;
const HeaderTitle = styled.Text`
font-size: 18px;
font-weight: bold;
color: #000000;
`;
const CloseButton = styled.TouchableOpacity`
padding: 8px;
`;
const ContentContainer = styled.ScrollView`
flex: 1;
padding: 20px;
`;
const InputContainer = styled.View`
margin-bottom: 24px;
`;
const InputLabel = styled.Text`
font-size: 16px;
font-weight: 600;
color: #000000;
margin-bottom: 8px;
`;
const TitleInput = styled.TextInput`
background-color: #F2F2F7;
border-radius: 12px;
padding: 16px;
font-size: 16px;
color: #000000;
min-height: 56px;
`;
const ContentInput = styled.TextInput`
background-color: #F2F2F7;
border-radius: 12px;
padding: 16px;
font-size: 16px;
color: #000000;
min-height: 120px;
`;
const PublishButtonSection = styled.View`
padding: 20px;
background-color: #FFFFFF;
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
interface EditPostScreenProps {
navigation: any;
route?: {
params?: {
postId?: string;
postData?: {
title: string;
content: string;
tags?: any[];
};
};
};
}
export const EditPostScreen: React.FC<EditPostScreenProps> = ({ navigation, route }) => {
const { isAuthenticated, user } = useAuthContext();
const { updatePost } = usePosts();
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
// Parâmetros da rota
const postId = route?.params?.postId;
const postData = route?.params?.postData;
// Log inicial quando a tela carrega
useEffect(() => {
addLog('=== TELA DE EDIÇÃO CARREGADA ===');
addLog(`PostId: ${postId}`);
addLog(`PostData: ${JSON.stringify(postData)}`);
addLog(`User: ${user?.nome || 'N/A'}`);
addLog(`User ID: ${user?.id || 'N/A'}`);
}, []);
// Inicializar campos com dados do post
useEffect(() => {
if (postData) {
addLog(`Inicializando campos: title="${postData.title}", content="${postData.content}"`);
setTitle(postData.title || '');
setContent(postData.content || '');
}
}, [postData]);
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
const handleTestAPI = async () => {
showInfoToast('Teste da API', 'Iniciando teste da API...');
try {
const token = await AsyncStorage.getItem('@app:user_token');
if (!token) {
showErrorToast('Erro', 'Token não encontrado!');
return;
}
const testUrl = `https://teste-back-soffia-production.up.railway.app/api/posts/${postId}`;
const testPayload = {
title: 'Teste de atualização - ' + new Date().toLocaleTimeString(),
content: 'Conteúdo de teste atualizado',
author: user?.id || 'test-author-id',
tags: []
};
const response = await fetch(testUrl, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify(testPayload),
});
if (response.ok) {
showTestResultToast(true, 'Teste da API');
} else {
showTestResultToast(false, 'Teste da API');
}
} catch (error: any) {
showErrorToast('Erro no teste', error.message);
}
};
const handleDirectTest = async () => {
addLog('=== TESTE DIRETO DA API ===');
try {
// Testar se a API está funcionando
const healthResponse = await fetch('https://teste-back-soffia-production.up.railway.app/api/health');
addLog(`Health Status: ${healthResponse.status}`);
// Testar se conseguimos buscar posts
const postsResponse = await fetch('https://teste-back-soffia-production.up.railway.app/api/posts');
addLog(`Posts Status: ${postsResponse.status}`);
const postsData = await postsResponse.json();
addLog(`Posts encontrados: ${postsData.length || 0}`);
if (postsData.length > 0) {
const firstPost = postsData[0];
addLog(`Primeiro post ID: ${firstPost.id}`);
addLog(`Primeiro post título: ${firstPost.title}`);
// Testar update direto
const token = await AsyncStorage.getItem('@app:user_token');
if (token) {
addLog('Testando UPDATE direto...');
const updateResponse = await fetch(`https://teste-back-soffia-production.up.railway.app/api/posts/${firstPost.id}`, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify({
title: `TESTE DIRETO - ${new Date().toLocaleTimeString()}`,
content: firstPost.content,
author: firstPost.author.id,
tags: firstPost.tags || []
}),
});
addLog(`UPDATE Status: ${updateResponse.status}`);
const updateData = await updateResponse.text();
addLog(`UPDATE Response: ${updateData}`);
} else {
addLog('ERRO: Token não encontrado para teste direto');
}
}
} catch (error: any) {
addLog(`ERRO NO TESTE DIRETO: ${error.message}`);
}
};
const handlePostmanTest = async () => {
addLog('=== TESTE EXATO DO POSTMAN ===');
try {
const token = await AsyncStorage.getItem('@app:user_token');
if (!token) {
addLog('ERRO: Token não encontrado');
return;
}
addLog(`Token encontrado: ${token.substring(0, 20)}...`);
// Usar exatamente os mesmos dados do Postman
const postmanPayload = {
title: "post atualizado",
content: "Conteúdo do post...",
author: user?.id || "9fe0f1eb-17d8-4ab5-92fd-ae91e184d723"
};
addLog(`Payload: ${JSON.stringify(postmanPayload)}`);
addLog(`URL: https://teste-back-soffia-production.up.railway.app/api/posts/${postId}`);
const response = await fetch(`https://teste-back-soffia-production.up.railway.app/api/posts/${postId}`, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify(postmanPayload),
});
addLog(`Status: ${response.status} ${response.statusText}`);
addLog(`Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
const responseText = await response.text();
addLog(`Response Text: ${responseText}`);
try {
const responseJson = JSON.parse(responseText);
addLog(`Response JSON: ${JSON.stringify(responseJson, null, 2)}`);
if (responseJson.message === 'Post atualizado com sucesso.') {
addLog('✅ SUCESSO! Post atualizado como no Postman!');
} else {
addLog('❌ Resposta diferente do Postman');
}
} catch (parseError) {
addLog(`Erro ao parsear JSON: ${parseError}`);
}
} catch (error: any) {
addLog(`ERRO NO TESTE POSTMAN: ${error.message}`);
addLog(`Erro completo: ${JSON.stringify(error)}`);
}
};
const handleAuthTest = async () => {
addLog('=== TESTE DE AUTENTICAÇÃO ===');
try {
// Testar se conseguimos fazer login
addLog('Testando login...');
const loginResponse = await fetch('https://teste-back-soffia-production.up.railway.app/api/auth/login', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
email: 'vitinnho@example.com',
password: '123456'
}),
});
addLog(`Login Status: ${loginResponse.status}`);
if (loginResponse.ok) {
const loginData = await loginResponse.json();
addLog(`Login Success: ${JSON.stringify(loginData)}`);
const newToken = loginData.token;
addLog(`Novo Token: ${newToken ? newToken.substring(0, 20) + '...' : 'N/A'}`);
// Testar se conseguimos buscar posts com o novo token
addLog('Testando busca de posts com novo token...');
const postsResponse = await fetch('https://teste-back-soffia-production.up.railway.app/api/posts', {
headers: {
'Authorization': `Bearer ${newToken}`,
'Content-Type': 'application/json',
},
});
addLog(`Posts Status: ${postsResponse.status}`);
if (postsResponse.ok) {
const postsData = await postsResponse.json();
addLog(`Posts encontrados: ${postsData.length}`);
if (postsData.length > 0) {
const firstPost = postsData[0];
addLog(`Primeiro post ID: ${firstPost.id}`);
// Testar update com o novo token
addLog('Testando UPDATE com novo token...');
const updateResponse = await fetch(`https://teste-back-soffia-production.up.railway.app/api/posts/${firstPost.id}`, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${newToken}`,
'Content-Type': 'application/json',
},
body: JSON.stringify({
title: `TESTE AUTH - ${new Date().toLocaleTimeString()}`,
content: firstPost.content,
author: firstPost.author.id,
tags: firstPost.tags || []
}),
});
addLog(`UPDATE Status: ${updateResponse.status}`);
const updateData = await updateResponse.text();
addLog(`UPDATE Response: ${updateData}`);
if (updateResponse.ok) {
addLog('✅ SUCESSO! Update funcionou com novo token!');
} else {
addLog('❌ UPDATE falhou mesmo com novo token');
}
}
} else {
addLog('❌ Não conseguiu buscar posts com novo token');
}
} else {
addLog('❌ Login falhou');
const loginError = await loginResponse.text();
addLog(`Login Error: ${loginError}`);
}
} catch (error: any) {
addLog(`ERRO NO TESTE AUTH: ${error.message}`);
addLog(`Erro completo: ${JSON.stringify(error)}`);
}
};
const handleSave = async () => {
if (!title.trim() || !content.trim()) return;
showInfoToast('Salvando', 'Salvando suas alterações...');
setIsLoading(true);
try {
if (isAuthenticated && user && user.id && postId) {
const token = await AsyncStorage.getItem('@app:user_token');
if (!token) {
showErrorToast('Erro', 'Token não encontrado');
return;
}
const updatePayload = {
title: title.trim(),
content: content.trim(),
author: user.id,
tags: postData?.tags || []
};
try {
const result = await updatePost(postId, updatePayload);
if (result && result.id) {
showSuccessToast('Sucesso!', 'Post atualizado com sucesso!');
navigation.goBack();
} else {
showErrorToast('Erro', 'Post não foi atualizado corretamente');
}
} catch (updateError: any) {
showApiErrorToast(updateError);
}
} else {
showErrorToast('Erro', 'Dados insuficientes para salvar');
}
} catch (error: any) {
showApiErrorToast(error);
} finally {
setIsLoading(false);
}
};
const isDisabled = !title.trim() || !content.trim();
const isPublishing = isLoading;
return (
<TouchableWithoutFeedback onPress={handleOutsidePress}>
<EditPostContainer> 
<Header>
<HeaderTitle>Editar</HeaderTitle>
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
{}
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
{}
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
<PublishButtonText>Testar API PUT</PublishButtonText>
</PublishButton>
{}
<PublishButton 
onPress={handleDirectTest} 
disabled={false}
isPublishing={false}
style={{ backgroundColor: '#4ECDC4', marginBottom: 10 }}
>
<Ionicons 
name="flash" 
size={20} 
color="#FFFFFF" 
/>
<PublishButtonText>Teste Direto</PublishButtonText>
</PublishButton>
{}
<PublishButton 
onPress={handlePostmanTest} 
disabled={false}
isPublishing={false}
style={{ backgroundColor: '#FF9500', marginBottom: 10 }}
>
<Ionicons 
name="send" 
size={20} 
color="#FFFFFF" 
/>
<PublishButtonText>Teste Postman</PublishButtonText>
</PublishButton>
{}
<PublishButton 
onPress={handleAuthTest} 
disabled={false}
isPublishing={false}
style={{ backgroundColor: '#8E44AD', marginBottom: 10 }}
>
<Ionicons 
name="key" 
size={20} 
color="#FFFFFF" 
/>
<PublishButtonText>Teste Auth</PublishButtonText>
</PublishButton>
<PublishButton 
onPress={handleSave} 
disabled={isDisabled}
isPublishing={isPublishing}
>
<Ionicons 
name="checkmark" 
size={20} 
color="#FFFFFF" 
/>
<PublishButtonText>
{isPublishing ? 'Salvando...' : 'Salvar'}
</PublishButtonText>
</PublishButton>
</PublishButtonSection>
</EditPostContainer>
</TouchableWithoutFeedback>
);
};

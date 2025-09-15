import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
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
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
console.log('ProfileScreen - Componente montado');
console.log('ProfileScreen - Route params:', route.params);
// Simular carregamento
setTimeout(() => {
setIsLoading(false);
}, 1000);
}, []);
const handleBack = () => {
console.log('ProfileScreen - Voltando...');
navigation.goBack();
};
if (isLoading) {
return (
<ProfileContainer>
<Header>
<BackButton onPress={handleBack}>
<Ionicons name="arrow-back" size={24} color="#000000" />
</BackButton>
<HeaderTitle>Perfil</HeaderTitle>
</Header>
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
<Ionicons name="hourglass-outline" size={48} color="#8E8E93" />
<Text style={{ color: '#8E8E93', marginTop: 16 }}>Carregando...</Text>
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
<ProfileImageText>U</ProfileImageText>
</ProfileImage>
<UserName>Usuário Teste</UserName>
<UserUsername>@usuario_teste</UserUsername>
</ProfileImageContainer>
<ContactInfoContainer>
<ContactItem>
<ContactIcon>
<Ionicons name="mail-outline" size={16} color="#8E8E93" />
</ContactIcon>
<ContactText>usuario@teste.com</ContactText>
</ContactItem>
<ContactItem>
<ContactIcon>
<Ionicons name="location-outline" size={16} color="#8E8E93" />
</ContactIcon>
<ContactText>Fortaleza, CE</ContactText>
</ContactItem>
<ContactItem>
<ContactIcon>
<Ionicons name="call-outline" size={16} color="#8E8E93" />
</ContactIcon>
<ContactText>(85) 9 9999-9999</ContactText>
</ContactItem>
</ContactInfoContainer>
</UserInfoSection>
<PostsSection>
<PostsTitle>Publicações</PostsTitle>
<PostCard>
<PostTitle>Primeiro Post</PostTitle>
<PostContent>
Este é um post de exemplo para testar o perfil do usuário.
</PostContent>
</PostCard>
<PostCard>
<PostTitle>Segundo Post</PostTitle>
<PostContent>
Outro post de exemplo para mostrar como funciona o sistema de perfil.
</PostContent>
</PostCard>
</PostsSection>
</ProfileContent>
</ProfileContainer>
);
};

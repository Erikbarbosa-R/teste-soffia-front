import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { SafeContainer } from '../components';
import { CustomInput } from '../components';
import { CustomButton } from '../components';
import { Loading } from '../components';
import { useForm } from '../hooks';
import { validateEmail, validatePassword } from '../utils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../types';
import { loginUser, registerUser, clearAuthError } from '../store/slices';
import { Ionicons } from '@expo/vector-icons';

// Componentes styled específicos para o design das imagens
const LoginContainer = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  padding: 0 24px;
  justify-content: flex-start;
  padding-top: 120px;
`;

const LoginTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  margin-bottom: 32px;
  text-transform: uppercase;
`;

const RegisterContainer = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

const RegisterHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 24px;
  padding-top: 50px;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 16px;
`;

const RegisterTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
`;

const RegisterContent = styled.View`
  flex: 1;
  padding: 0 24px;
  justify-content: flex-start;
  padding-top: 40px;
`;

const LinkText = styled.Text`
  font-size: 16px;
  color: #007AFF;
  text-align: center;
  margin-top: 24px;
`;

interface AuthScreenProps {
  navigation: any;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const { values, errors, setValue, setFieldTouched, isValid, reset } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = () => {
    // Usuário e senha específicos para login
    if (isLogin) {
      dispatch(loginUser({
        email: values.email || 'usuario@teste.com',
        password: values.password || 'senha123',
      }));
    } else {
      dispatch(registerUser({
        name: values.name || 'Usuário Teste',
        email: values.email || 'usuario@teste.com',
        password: values.password || 'senha123',
      }));
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    reset();
    dispatch(clearAuthError());
  };

  if (isLoading) {
    return <Loading text={isLogin ? "Fazendo login..." : "Criando conta..."} />;
  }

  // Tela de Login
  if (isLogin) {
    return (
      <SafeContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <LoginContainer>
          <LoginTitle>LOGIN</LoginTitle>
          
          {error && (
            <Text style={{ color: '#FF3B30', marginBottom: 16, textAlign: 'center' }}>
              {error}
            </Text>
          )}

          <CustomInput
            label="E-mail"
            placeholder="Endereço de e-mail"
            value={values.email}
            onChangeText={(text) => setValue('email', text)}
            error={errors.email}
            keyboardType="email-address"
            onBlur={() => setFieldTouched('email')}
          />

          <CustomInput
            label="Senha"
            placeholder="Senha"
            value={values.password}
            onChangeText={(text) => setValue('password', text)}
            error={errors.password}
            secureTextEntry
            onBlur={() => setFieldTouched('password')}
          />

          <CustomButton
            title="ENTRAR"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          />

          <TouchableOpacity onPress={handleToggleMode}>
            <LinkText>Criar nova conta</LinkText>
          </TouchableOpacity>
        </LoginContainer>
      </SafeContainer>
    );
  }

  // Tela de Registro
  return (
    <SafeContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <RegisterContainer>
        <RegisterHeader>
          <BackButton onPress={handleToggleMode}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </BackButton>
          <RegisterTitle>Criar nova conta</RegisterTitle>
        </RegisterHeader>

        <RegisterContent>
          {error && (
            <Text style={{ color: '#FF3B30', marginBottom: 16, textAlign: 'center' }}>
              {error}
            </Text>
          )}

          <CustomInput
            label="Nome de usuário"
            placeholder="Nome de usuário"
            value={values.name}
            onChangeText={(text) => setValue('name', text)}
            error={errors.name}
            onBlur={() => setFieldTouched('name')}
          />

          <CustomInput
            label="E-mail"
            placeholder="Endereço de e-mail"
            value={values.email}
            onChangeText={(text) => setValue('email', text)}
            error={errors.email}
            keyboardType="email-address"
            onBlur={() => setFieldTouched('email')}
          />

          <CustomInput
            label="Senha"
            placeholder="Adicione uma senha"
            value={values.password}
            onChangeText={(text) => setValue('password', text)}
            error={errors.password}
            secureTextEntry
            onBlur={() => setFieldTouched('password')}
          />

          <CustomButton
            title="Criar conta"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          />
        </RegisterContent>
      </RegisterContainer>
    </SafeContainer>
  );
};
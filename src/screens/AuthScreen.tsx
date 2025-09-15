import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import styled from 'styled-components/native';
import { SafeContainer } from '../components';
import { CustomInput } from '../components';
import { CustomButton } from '../components';
import { Loading } from '../components';
import { useForm } from '../hooks';
import { validateEmail, validatePassword } from '../utils';
import { useAuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { 
  showErrorToast, 
  showValidationErrorToast, 
  showApiErrorToast,
  showAuthErrorToast 
} from '../utils';

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

const ErrorContainer = styled.View`
  background-color: #FFE6E6;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: #FF3B30;
`;

const ErrorText = styled.Text`
  color: #FF3B30;
  font-size: 14px;
  text-align: center;
`;

interface AuthScreenProps {
  navigation: any;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { login, register, isLoading } = useAuthContext();

  const { values, errors, setValue, setFieldTouched, isValid, reset } = useForm({
    nome: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    try {
      setErrorMessage(''); // Limpar erro anterior
      
      // Validação de campos obrigatórios para cadastro
      if (!isLogin) {
        const validationErrors: string[] = [];
        
        if (!values.nome || values.nome.trim() === '') {
          validationErrors.push('Nome é obrigatório');
        }
        
        if (!values.email || values.email.trim() === '') {
          validationErrors.push('Email é obrigatório');
        }
        
        if (!values.password || values.password.trim() === '') {
          validationErrors.push('Senha é obrigatória');
        }
        
        // Se há erros de validação, mostrar e parar
        if (validationErrors.length > 0) {
          const errorMsg = validationErrors.join('. ') + '.';
          setErrorMessage(errorMsg);
          
          showValidationErrorToast(validationErrors);
          return;
        }
      }
      
      // Validação de campos obrigatórios para login
      if (isLogin) {
        const validationErrors: string[] = [];
        
        if (!values.email || values.email.trim() === '') {
          validationErrors.push('Email é obrigatório');
        }
        
        if (!values.password || values.password.trim() === '') {
          validationErrors.push('Senha é obrigatória');
        }
        
        // Se há erros de validação, mostrar e parar
        if (validationErrors.length > 0) {
          const errorMsg = validationErrors.join('. ') + '.';
          setErrorMessage(errorMsg);
          
          showValidationErrorToast(validationErrors);
          return;
        }
      }
      
      if (isLogin) {
        await login(
          values.email,
          values.password
        );
      } else {
        await register({
          nome: values.nome,
          email: values.email,
          password: values.password,
        });
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      
      // Tratar diferentes tipos de erro
      let errorMsg = '';
      
      if (error?.response?.status === 401) {
        errorMsg = 'Email ou senha incorretos. Verifique suas credenciais.';
      } else if (error?.response?.status === 404) {
        errorMsg = 'Usuário não encontrado. Verifique seu email.';
      } else if (error?.response?.status === 400) {
        if (error?.response?.data?.message?.includes('email')) {
          errorMsg = 'Email inválido. Verifique o formato do email.';
        } else if (error?.response?.data?.message?.includes('senha')) {
          errorMsg = 'Senha incorreta. Tente novamente.';
        } else {
          errorMsg = 'Dados inválidos. Verifique as informações.';
        }
      } else if (error?.response?.status === 409) {
        errorMsg = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error?.message?.includes('Network')) {
        errorMsg = 'Erro de conexão. Verifique sua internet.';
      } else {
        errorMsg = isLogin 
          ? 'Erro ao fazer login. Tente novamente.' 
          : 'Erro ao criar conta. Tente novamente.';
      }
      
      setErrorMessage(errorMsg);
      
      // Mostrar toast também
      showApiErrorToast(error);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(''); // Limpar erro ao trocar de modo
    reset();
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
          
          {errorMessage ? (
            <ErrorContainer>
              <ErrorText>{errorMessage}</ErrorText>
            </ErrorContainer>
          ) : null}
          
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
          {errorMessage ? (
            <ErrorContainer>
              <ErrorText>{errorMessage}</ErrorText>
            </ErrorContainer>
          ) : null}
          
          <CustomInput
            label="Nome de usuário"
            placeholder="Nome de usuário"
            value={values.nome}
            onChangeText={(text) => setValue('nome', text)}
            error={errors.nome}
            onBlur={() => setFieldTouched('nome')}
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
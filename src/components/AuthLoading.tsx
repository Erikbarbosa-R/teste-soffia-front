import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from '../constants';

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.background};
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: ${COLORS.textSecondary};
  margin-top: 16px;
`;

interface AuthLoadingProps {
  text?: string;
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({ 
  text = "Verificando autenticação..." 
}) => {
  return (
    <LoadingContainer>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

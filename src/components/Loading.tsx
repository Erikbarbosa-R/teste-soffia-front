import React from 'react';
import { ActivityIndicator } from 'react-native';
import { LoadingContainer, LoadingText } from './styled';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'large', 
  color = '#007AFF', 
  text 
}) => {
  return (
    <LoadingContainer>
      <ActivityIndicator size={size} color={color} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

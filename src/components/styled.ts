import React from 'react';
import styled from 'styled-components/native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants';

// Componentes base
export const Container = styled.View<{ padding?: number; backgroundColor?: string }>`
  flex: 1;
  padding: ${props => props.padding || SPACING.md}px;
  background-color: ${props => props.backgroundColor || COLORS.background};
`;

export const SafeContainer = styled.SafeAreaView<{ backgroundColor?: string }>`
  flex: 1;
  background-color: ${props => props.backgroundColor || COLORS.background};
`;

export const ScrollContainer = styled.ScrollView<{ padding?: number }>`
  flex: 1;
  padding: ${props => props.padding || SPACING.md}px;
`;

export const Row = styled.View<{ justifyContent?: string; alignItems?: string; marginBottom?: number }>`
  flex-direction: row;
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: ${props => props.alignItems || 'center'};
  margin-bottom: ${props => props.marginBottom || 0}px;
`;

export const Column = styled.View<{ alignItems?: string; marginBottom?: number }>`
  flex-direction: column;
  align-items: ${props => props.alignItems || 'stretch'};
  margin-bottom: ${props => props.marginBottom || 0}px;
`;

// Componentes de texto
export const Title = styled.Text<{ color?: string; size?: number; weight?: string; marginBottom?: number }>`
  font-size: ${props => props.size || FONT_SIZES.xl}px;
  font-weight: ${props => props.weight || 'bold'};
  color: ${props => props.color || COLORS.text};
  margin-bottom: ${props => props.marginBottom || SPACING.sm}px;
`;

export const Subtitle = styled.Text<{ color?: string; size?: number }>`
  font-size: ${props => props.size || FONT_SIZES.md}px;
  font-weight: 600;
  color: ${props => props.color || COLORS.textSecondary};
  margin-bottom: ${SPACING.xs}px;
`;

export const Text = styled.Text<{ color?: string; size?: number; weight?: string; marginBottom?: number }>`
  font-size: ${props => props.size || FONT_SIZES.md}px;
  font-weight: ${props => props.weight || 'normal'};
  color: ${props => props.color || COLORS.text};
  margin-bottom: ${props => props.marginBottom || 0}px;
`;

export const Caption = styled.Text<{ color?: string }>`
  font-size: ${FONT_SIZES.sm}px;
  color: ${props => props.color || COLORS.textSecondary};
`;

// Componentes de botão
export const Button = styled.TouchableOpacity<{ 
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
}>`
  background-color: ${props => {
    if (props.disabled) return '#C6C6C8';
    switch (props.variant) {
      case 'secondary': return COLORS.secondary;
      case 'outline': return 'transparent';
      default: return '#007AFF';
    }
  }};
  border: ${props => props.variant === 'outline' ? `1px solid #007AFF` : 'none'};
  padding: 16px 24px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

export const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' | 'outline'; disabled?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => {
    if (props.disabled) return '#8E8E93';
    return props.variant === 'outline' ? '#007AFF' : '#FFFFFF';
  }};
  text-transform: uppercase;
`;

// Componentes de input
export const InputContainer = styled.View<{ error?: boolean }>`
  margin-bottom: ${SPACING.lg}px;
`;

export const Input = styled.TextInput<{ multiline?: boolean; error?: boolean }>`
  background-color: #F2F2F7;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #000000;
  min-height: 56px;
  text-align-vertical: ${props => props.multiline ? 'top' : 'center'};
`;

export const InputLabel = styled.Text<{ error?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
`;

export const ErrorText = styled.Text`
  font-size: ${FONT_SIZES.xs}px;
  color: ${COLORS.error};
  margin-top: ${SPACING.xs}px;
`;

// Componentes de card
export const Card = styled.TouchableOpacity<{ padding?: number; marginBottom?: number }>`
  background-color: ${COLORS.surface};
  border-radius: ${BORDER_RADIUS.lg}px;
  padding: ${props => props.padding || SPACING.md}px;
  margin-bottom: ${props => props.marginBottom || SPACING.md}px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

// Componentes de loading
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.background};
`;

export const LoadingText = styled.Text`
  font-size: ${FONT_SIZES.md}px;
  color: ${COLORS.textSecondary};
  margin-top: ${SPACING.md}px;
`;

// Componentes de avatar
export const Avatar = styled.Image<{ size?: number }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: ${props => (props.size || 40) / 2}px;
  background-color: ${COLORS.border};
`;

export const AvatarContainer = styled.TouchableOpacity<{ size?: number }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: ${props => (props.size || 40) / 2}px;
  background-color: ${COLORS.border};
  justify-content: center;
  align-items: center;
`;

export const AvatarText = styled.Text<{ size?: number }>`
  font-size: ${props => (props.size || 40) / 2}px;
  font-weight: bold;
  color: ${COLORS.surface};
`;

// Componentes de ícone
export const IconButton = styled.TouchableOpacity<{ size?: number; color?: string }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  justify-content: center;
  align-items: center;
  border-radius: ${props => (props.size || 40) / 2}px;
`;

// Componentes de separador
export const Separator = styled.View<{ height?: number; color?: string; margin?: number }>`
  height: ${props => props.height || 1}px;
  background-color: ${props => props.color || COLORS.border};
  margin: ${props => props.margin || SPACING.md}px 0;
`;

// Componentes de badge
export const Badge = styled.View<{ backgroundColor?: string }>`
  background-color: ${props => props.backgroundColor || COLORS.primary};
  padding: ${SPACING.xs}px ${SPACING.sm}px;
  border-radius: ${BORDER_RADIUS.round}px;
  align-self: flex-start;
`;

export const BadgeText = styled.Text<{ color?: string }>`
  font-size: ${FONT_SIZES.xs}px;
  font-weight: 600;
  color: ${props => props.color || COLORS.surface};
`;

// Componentes de lista
export const ListItem = styled.TouchableOpacity<{ padding?: number }>`
  background-color: ${COLORS.surface};
  padding: ${props => props.padding || SPACING.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.border};
`;

export const ListItemContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ListItemText = styled.View`
  flex: 1;
  margin-left: ${SPACING.md}px;
`;

// Componentes de modal
export const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View<{ width?: number }>`
  background-color: ${COLORS.surface};
  border-radius: ${BORDER_RADIUS.lg}px;
  padding: ${SPACING.lg}px;
  width: ${props => props.width || 90}%;
  max-height: 80%;
`;

// Componentes de status
export const StatusContainer = styled.View<{ backgroundColor?: string }>`
  background-color: ${props => props.backgroundColor || COLORS.surface};
  padding: ${SPACING.md}px;
  border-radius: ${BORDER_RADIUS.md}px;
  margin-bottom: ${SPACING.md}px;
`;

export const StatusText = styled.Text<{ color?: string }>`
  font-size: ${FONT_SIZES.md}px;
  color: ${props => props.color || COLORS.text};
  text-align: center;
`;

import React from 'react';
import { Button, ButtonText } from './styled';
import { Loading } from './Loading';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  return (
    <Button
      variant={variant}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onPress={onPress}
    >
      {loading ? (
        <Loading size="small" color={variant === 'outline' ? '#007AFF' : '#FFFFFF'} />
      ) : (
        <ButtonText variant={variant} disabled={disabled || loading}>
          {title}
        </ButtonText>
      )}
    </Button>
  );
};

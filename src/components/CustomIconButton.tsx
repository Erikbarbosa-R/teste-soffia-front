import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from './styled';
import { COLORS } from '../constants';
interface IconButtonProps {
name: keyof typeof Ionicons.glyphMap;
size?: number;
color?: string;
onPress: () => void;
backgroundColor?: string;
}
export const CustomIconButton: React.FC<IconButtonProps> = ({
name,
size = 24,
color = COLORS.text,
onPress,
backgroundColor,
}) => {
return (
<IconButton
size={size + 16}
color={backgroundColor}
onPress={onPress}
style={{ backgroundColor }}
>
<Ionicons name={name} size={size} color={color} />
</IconButton>
);
};

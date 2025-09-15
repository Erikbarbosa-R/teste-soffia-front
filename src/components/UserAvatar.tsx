import React from 'react';
import { Avatar, AvatarContainer, AvatarText } from './styled';
import { generateAvatarUrl } from '../utils';
interface UserAvatarProps {
name: string;
avatar?: string;
size?: number;
onPress?: () => void;
}
export const UserAvatar: React.FC<UserAvatarProps> = ({ 
name, 
avatar, 
size = 40,
onPress
}) => {
const avatarUrl = avatar || generateAvatarUrl(name, size);
return (
<AvatarContainer size={size} onPress={onPress}>
{avatar ? (
<Avatar source={{ uri: avatarUrl }} size={size} />
) : (
<AvatarText size={size}>
{name.charAt(0).toUpperCase()}
</AvatarText>
)}
</AvatarContainer>
);
};

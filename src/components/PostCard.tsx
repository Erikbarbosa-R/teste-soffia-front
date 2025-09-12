import React from 'react';
import { Card, Row, Column, Title, Text, Caption } from './styled';
import { UserAvatar } from './UserAvatar';
import { CustomIconButton } from './CustomIconButton';
import { formatDate, truncateText } from '../utils';
import { Post } from '../types';
import { COLORS } from '../constants';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onLike: () => void;
  onFavorite: () => void;
  onProfilePress?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onFavorite,
  onProfilePress,
  onDelete,
  showActions = true,
}) => {
  return (
    <Card onPress={onPress}>
      <Row marginBottom={12}>
        <UserAvatar 
          name={post.author.name} 
          avatar={post.author.avatar} 
          size={40} 
          onPress={onProfilePress}
        />
        <Column style={{ flex: 1, marginLeft: 12 }}>
          <Text weight="600" size={16}>{post.author.name}</Text>
          <Caption>{formatDate(post.createdAt)}</Caption>
        </Column>
        {showActions && (
          <Row>
            {onDelete && (
              <CustomIconButton
                name="trash-outline"
                size={20}
                color={COLORS.error}
                onPress={onDelete}
              />
            )}
            <CustomIconButton
              name={post.isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={post.isFavorite ? COLORS.error : COLORS.textSecondary}
              onPress={onFavorite}
            />
          </Row>
        )}
      </Row>

      <Title size={18} marginBottom={8}>{post.title}</Title>
      <Text marginBottom={12}>{truncateText(post.content, 150)}</Text>

      {showActions && (
        <Row justifyContent="space-between" alignItems="center">
          <Row alignItems="center">
            <CustomIconButton
              name={post.isLiked ? "heart" : "heart-outline"}
              size={18}
              color={post.isLiked ? COLORS.error : COLORS.textSecondary}
              onPress={onLike}
            />
            <Text size={14} color={COLORS.textSecondary} style={{ marginLeft: 4 }}>
              {post.likes}
            </Text>
          </Row>
          
          <Text size={14} color={COLORS.textSecondary}>
            {post.content.length > 150 ? 'Ver mais...' : ''}
          </Text>
        </Row>
      )}
    </Card>
  );
};

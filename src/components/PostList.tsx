import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { PostCard } from './PostCard';
import { Loading } from './Loading';
import { StatusContainer, StatusText } from './styled';
import { Post } from '../types';
import { COLORS } from '../constants';
interface PostListProps {
posts: Post[];
isLoading: boolean;
isRefreshing: boolean;
hasMore: boolean;
onRefresh: () => void;
onLoadMore: () => void;
onPostPress: (postId: string) => void;
onLike: (postId: string) => void;
onFavorite: (postId: string) => void;
onDelete?: (postId: string) => void;
showActions?: boolean;
}
export const PostList: React.FC<PostListProps> = ({
posts,
isLoading,
isRefreshing,
hasMore,
onRefresh,
onLoadMore,
onPostPress,
onLike,
onFavorite,
onDelete,
showActions = true,
}) => {
const renderPost = ({ item }: { item: Post }) => (
<PostCard
post={item}
onPress={() => onPostPress(item.id)}
onLike={() => onLike(item.id)}
onFavorite={() => onFavorite(item.id)}
onDelete={onDelete ? () => onDelete(item.id) : undefined}
showActions={showActions}
/>
);
const renderFooter = () => {
if (!isLoading || posts.length === 0) return null;
return <Loading size="small" text="Carregando mais posts..." />;
};
const renderEmpty = () => (
<StatusContainer>
<StatusText>Nenhum post encontrado</StatusText>
</StatusContainer>
);
const handleEndReached = () => {
if (hasMore && !isLoading) {
onLoadMore();
}
};
if (posts.length === 0 && !isLoading) {
return renderEmpty();
}
return (
<FlatList
data={posts}
renderItem={renderPost}
keyExtractor={(item) => item.id}
refreshControl={
<RefreshControl
refreshing={isRefreshing}
onRefresh={onRefresh}
colors={[COLORS.primary]}
tintColor={COLORS.primary}
/>
}
onEndReached={handleEndReached}
onEndReachedThreshold={0.1}
ListFooterComponent={renderFooter}
showsVerticalScrollIndicator={false}
contentContainerStyle={{ paddingBottom: 20 }}
/>
);
};

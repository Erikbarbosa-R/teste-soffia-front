import React, { useState, useEffect } from 'react';
import { SafeContainer, Container, Title, Text, Row, Column } from '../components';
import { PostCard } from '../components';
import { CustomButton } from '../components';
import { Loading } from '../components';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

interface PostDetailScreenProps {
  navigation: any;
  route: any;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ navigation, route }) => {
  const { postId } = route.params;
  const { posts } = useSelector((state: RootState) => state.posts);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const foundPost = posts.find(p => p.id === postId);
    setPost(foundPost);
  }, [posts, postId]);

  const handleLike = () => {
    // Implementar like
  };

  const handleFavorite = () => {
    // Implementar favorito
  };

  const handleEdit = () => {
    navigation.navigate('EditPost', { postId });
  };

  const handleDelete = () => {
    // Implementar delete
    navigation.goBack();
  };

  if (!post) {
    return <Loading text="Carregando post..." />;
  }

  return (
    <SafeContainer>
      <Container>
        <PostCard
          post={post}
          onPress={() => {}}
          onLike={handleLike}
          onFavorite={handleFavorite}
          onDelete={handleDelete}
          showActions={true}
        />

        <Row justifyContent="space-between" marginTop={20}>
          <CustomButton
            title="Editar"
            variant="outline"
            onPress={handleEdit}
            style={{ flex: 0.45 }}
          />
          <CustomButton
            title="Voltar"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={{ flex: 0.45 }}
          />
        </Row>
      </Container>
    </SafeContainer>
  );
};

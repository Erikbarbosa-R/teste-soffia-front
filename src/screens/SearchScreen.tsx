import React, { useState, useEffect } from 'react';
import { SafeContainer, Container, Title, Text, Row, Column } from '../components';
import { PostCard } from '../components';
import { CustomInput } from '../components';
import { Loading } from '../components';
import { usePosts, useSearch } from '../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { posts, isLoading, loadPosts } = usePosts();
  const { query, setQuery, clearSearch } = useSearch();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim()) {
      loadPosts(1, query);
    } else {
      setSearchResults([]);
    }
  }, [query, loadPosts]);

  useEffect(() => {
    setSearchResults(posts);
  }, [posts]);

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleLike = (postId: string) => {
    // Implementar like
  };

  const handleFavorite = (postId: string) => {
    // Implementar favorito
  };

  return (
    <SafeContainer>
      <Container>
        <Title>Buscar Posts</Title>
        
        <CustomInput
          label="Buscar"
          placeholder="Digite para buscar posts..."
          value={query}
          onChangeText={setQuery}
        />

        {isLoading && query.trim() ? (
          <Loading text="Buscando..." />
        ) : searchResults.length > 0 ? (
          searchResults.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => handlePostPress(post.id)}
              onLike={() => handleLike(post.id)}
              onFavorite={() => handleFavorite(post.id)}
            />
          ))
        ) : query.trim() ? (
          <Text>Nenhum resultado encontrado para "{query}"</Text>
        ) : (
          <Text>Digite algo para buscar posts</Text>
        )}
      </Container>
    </SafeContainer>
  );
};

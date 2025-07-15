import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useBookStore } from '@/store/useBookStore';
import { useRouter } from 'expo-router';
import BookCard from '@/components/common/BookCard';

const BookScreen = () => {
  const { books, loading, error, fetchBooks } = useBookStore();
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookPress = (bookId: number) => {
    router.push(`/startadventure?bookId=${bookId}`);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Choisis ton livre</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookCard
            title={item.title}
            description={item.description}
            pagesCount={item.page?.length}
            author={item.author}
            onPress={() => handleBookPress(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: { gap: 16 },
});

export default BookScreen;

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useBookStore } from '@/store/useBookStore';
import { useRouter } from 'expo-router';

const BookScreen = () => {
  const { books, loading, error, fetchBooks } = useBookStore();
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookPress = (bookId: number) => {
    console.log('Book selected:', bookId);
    // router.push(`/chapter/${bookId}`); // à activer plus tard
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
          <Pressable style={styles.card} onPress={() => handleBookPress(item.id)}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookDesc}>{item.description}</Text>

            <View style={styles.metaInfo}>
              <Text style={styles.meta}>📄 {item.page?.length ?? 0} pages</Text>
              <Text style={styles.meta}>✍️ {item.author ?? 'Auteur inconnu'}</Text>
            </View>
          </Pressable>
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
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    elevation: 2,
  },
  bookTitle: { fontSize: 18, fontWeight: '600' },
  bookDesc: { fontSize: 14, color: '#555', marginTop: 6 },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  meta: {
    fontSize: 12,
    color: '#777',
  },
});

export default BookScreen;

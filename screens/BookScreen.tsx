import React, { useEffect, useCallback } from 'react';
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
import { globalStyles } from '@/styles/global';
import { useFocusEffect } from '@react-navigation/native';
import { useAdventurerStore } from '@/store/useAdventurerStore';

const BookScreen = () => {
  const { books, loading, error, fetchBooks } = useBookStore();
  const router = useRouter();
  const clearActiveAdventurer = useAdventurerStore(s => s.clearActiveAdventurer);

  useFocusEffect(
    useCallback(() => {
      clearActiveAdventurer(); // purge l’ancien (évite les requêtes sur 22…)
    }, [clearActiveAdventurer])
  );

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookPress = (bookId: number) => {
    router.push(`/startadventure?bookId=${bookId}`);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

  return (
    <View style={globalStyles.pageContainer}>
      <Text style={globalStyles.titleCenter}>Choisis ton livre</Text>

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

  list: { gap: 16 },
});

export default BookScreen;

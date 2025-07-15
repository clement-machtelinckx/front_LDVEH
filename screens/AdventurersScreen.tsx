// screens/AdventurersScreen.tsx
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import AdventurerCard from '@/components/common/AdventurerCard';

type Adventurer = {
  id: number;
  AdventurerName: string;
  Ability: number;
  Endurance: number;
  adventure: {
    id: number;
    book: { id: number; title: string };
    currentPage: { id: number; pageNumber: number };
    fromLastPage?: { id: number; pageNumber: number } | null;
    isFinished: boolean;
  } | null;
};


export default function AdventurersScreen() {
  const {
    adventurers,
    fetchAdventurers,
    setActiveAdventurer,
    loading,
  } = useAdventurerStore();

  const router = useRouter();

  useEffect(() => {
    fetchAdventurers();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
    <FlatList
      data={adventurers}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Text style={styles.title}>🧙‍♂️ Tes Aventuriers</Text>
      }
      renderItem={({ item }) => (
        <AdventurerCard
          name={item.AdventurerName}
          ability={item.Ability}
          endurance={item.Endurance}
          bookTitle={item.adventure?.book.title}
          currentPage={item.adventure?.currentPage.pageNumber}
          onResume={
            item.adventure
              ? () => {
                  setActiveAdventurer(item);
                  useAdventureStore.setState({
                    adventureId: item.adventure!.id,
                    adventurerId: item.id,
                  });
                  router.replace(`/page/${item.adventure!.currentPage.id}`);
                }
              : undefined
          }
        />
      )}
    />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  list: { gap: 16 },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  adventure: { marginTop: 8, fontStyle: 'italic' },
  noAdventure: { color: '#777' },
});

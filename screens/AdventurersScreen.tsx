// screens/AdventurersScreen.tsx
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useAdventurerStore } from '@/store/useAdventurerStore';

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
      <Text style={styles.title}>🧙‍♂️ Tes Aventuriers</Text>
      <FlatList
        data={adventurers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.AdventurerName}</Text>
            <Text>⚔️ Habileté : {item.Ability} | ❤️ Endurance : {item.Endurance}</Text>

            {item.adventure ? (
              <>
                <Text style={styles.adventure}>
                  📖 {item.adventure.book.title} – Page {item.adventure.currentPage.pageNumber}
                </Text>
                <Button
                  title="➡️ Reprendre"
                  onPress={() => {
                    setActiveAdventurer(item);
                    useAdventureStore.setState({
                      adventureId: item.adventure!.id,
                      adventurerId: item.id,
                    });
                    router.replace(`/page/${item.adventure!.currentPage.id}`);
                  }}
                />
              </>
            ) : (
              <Text style={styles.noAdventure}>Aucune aventure en cours</Text>
            )}
          </View>
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
    borderRadius: 12,
    gap: 8,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  adventure: { marginTop: 8, fontStyle: 'italic' },
  noAdventure: { color: '#777' },
});

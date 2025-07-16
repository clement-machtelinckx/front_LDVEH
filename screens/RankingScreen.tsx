import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAdventureStore } from '@/store/useAdventureStore';

export default function RankingScreen() {
  const { histories, fetchHistories } = useAdventureStore();

  useEffect(() => {
    fetchHistories();
  }, []);

  const sortedHistories = [...histories].sort(
    (a, b) => new Date(b.finishAt).getTime() - new Date(a.finishAt).getTime()
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏆 Classement des Aventuriers</Text>

      {histories.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : (
        sortedHistories.map((entry, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.details}>
              <Text style={styles.name}>🧙 {entry.adventurerName}</Text>
              <Text>📖 {entry.bookTitle}</Text>
              <Text style={styles.date}>
                🕓 {new Date(entry.finishAt).toLocaleString('fr-FR')}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#555',
    marginTop: 4,
    fontSize: 12,
  },
});

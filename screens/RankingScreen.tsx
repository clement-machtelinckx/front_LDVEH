import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAdventureStore } from '@/store/useAdventureStore';
import AdventureHistoryList from '@/components/metier/AdventureHistoryList'; 

export default function RankingScreen() {
  const { histories, fetchHistories } = useAdventureStore();

  useEffect(() => {
    fetchHistories();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏆 Classement des Aventuriers</Text>

      {histories.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : (
        <AdventureHistoryList histories={histories} showRanking />
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
});

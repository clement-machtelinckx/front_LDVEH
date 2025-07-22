import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAdventureStore } from '@/store/useAdventureStore';
import AdventureHistoryList from '@/components/metier/AdventureHistoryList'; 
import { globalStyles } from '@/styles/global';

export default function RankingScreen() {
  const { histories, fetchHistories } = useAdventureStore();

  useEffect(() => {
    fetchHistories();
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyles.pageContainer}>
      <Text style={globalStyles.titleCenter}>🏆 Hall of Fame !!</Text>

      {histories.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : (
        <AdventureHistoryList histories={histories} showRanking />
      )}
    </ScrollView>
  );
}


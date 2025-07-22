// components/metier/AdventureHistoryList.tsx
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/global'; // Adjust the import path as necessary

type Props = {
  histories: {
    bookTitle: string;
    adventurerName: string;
    finishAt: string;
  }[];
  showRanking?: boolean;
};

export default function AdventureHistoryList({ histories, showRanking }: Props) {
  if (!histories.length) {
    return <Text>Aucune aventure terminée pour le moment.</Text>;
  }

  return (
    <View style={styles.list}>
      {histories.map((h, index) => (
        <View key={index} style={globalStyles.container}>
          {showRanking && (
            <Text style={styles.rank}>#{index + 1}</Text>
          )}
          <View style={styles.details}>
            <Text style={styles.title}>📖 {h.bookTitle}</Text>
            <Text>👤 {h.adventurerName}</Text>
            <Text style={styles.date}>🏁 {new Date(h.finishAt).toLocaleDateString()}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  list: { gap: 12, marginTop: 12 },
  item: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontStyle: 'italic',
    color: '#444',
  },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    details: {
        flex: 1,
    },
});

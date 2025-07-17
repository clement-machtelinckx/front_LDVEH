import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AdventurerCard from '@/components/common/AdventurerCard';

type Adventurer = {
  id: number;
  AdventurerName: string;
  Ability: number;
  Endurance: number;
  adventure?: {
    id: number;
    book: { title: string };
    currentPage: { id: number; pageNumber: number };
  };
};

type Props = {
  adventurers: Adventurer[];
  loading?: boolean;
  onResume?: (a: Adventurer) => void;
  onDelete?: (a: Adventurer) => void;
};

export default function AdventurerList({ adventurers, loading, onResume, onDelete }: Props) {
  if (loading) return <ActivityIndicator size="large" />;

  if (!adventurers.length) return <Text>Aucun aventurier trouvé.</Text>;

  return (
    <View style={styles.list}>
      {adventurers.map((a) => (
        <AdventurerCard
        key={a.id}
        name={a.AdventurerName}
        ability={a.Ability}
        endurance={a.Endurance}
        bookTitle={a.adventure.book.title}
        currentPage={a.adventure.currentPage.pageNumber}
        onResume={() => onResume?.(a)}
        onDelete={() => onDelete?.(a)}
        />

      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
});

import { View, ActivityIndicator, StyleSheet, Text, FlatList } from 'react-native';
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
 <FlatList
    data={adventurers.filter((a) => a.adventure)}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <AdventurerCard
        name={item.AdventurerName}
        ability={item.Ability}
        endurance={item.Endurance}
        bookTitle={item.adventure?.book?.title}
        currentPage={item.adventure?.currentPage?.pageNumber}
        onResume={() => onResume?.(item)}
        onDelete={() => onDelete?.(item)}
      />
    )}
    contentContainerStyle={styles.list}
    ListEmptyComponent={<Text>Aucun aventurier trouvé.</Text>}
  />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
});

import { View, ActivityIndicator, StyleSheet, Text, FlatList } from 'react-native';
import AdventurerCard from '@/components/common/AdventurerCard';
import { colors, fonts, fontSize, spacing } from '@/styles/theme';

type Adventurer = {
  id: number;
  AdventurerName: string;
  Ability: number;
  Endurance: number;
  gold: number;
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

  if (!adventurers.length) return <Text style={styles.empty}>Aucune aventure en cours.</Text>;

  return (
 <FlatList
    data={adventurers.filter((a) => a.adventure)}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <AdventurerCard
        name={item.AdventurerName}
        ability={item.Ability}
        endurance={item.Endurance}
        gold={item.gold ?? 0}
        bookTitle={item.adventure?.book?.title}
        currentPage={item.adventure?.currentPage?.pageNumber}
        onResume={() => onResume?.(item)}
        onDelete={() => onDelete?.(item)}
      />
    )}
    contentContainerStyle={styles.list}
    ListEmptyComponent={<Text style={styles.empty}>Aucune aventure en cours.</Text>}
  />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.inkMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});

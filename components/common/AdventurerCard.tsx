// components/common/AdventurerCard.tsx
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';

type Props = {
  name: string;
  ability: number;
  endurance: number;
  bookTitle?: string;
  currentPage?: number;
  onResume?: () => void;
};

export default function AdventurerCard({
  name,
  ability,
  endurance,
  bookTitle,
  currentPage,
  onResume,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text>⚔️ Habileté : {ability} | ❤️ Endurance : {endurance}</Text>

      {bookTitle && currentPage ? (
        <>
          <Text style={styles.adventure}>
            📖 {bookTitle} – Page {currentPage}
          </Text>
          {onResume && <PrimaryButton title="➡️ Reprendre" onPress={onResume} />}
        </>
      ) : (
        <Text style={styles.noAdventure}>Aucune aventure en cours</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

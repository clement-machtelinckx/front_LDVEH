import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';

type Props = {
  name: string;
  ability: number;
  endurance: number;
  bookTitle: string;
  currentPage: number;
  onResume?: () => void;
  onDelete?: () => void;
};

export default function AdventurerCard({
  name,
  ability,
  endurance,
  bookTitle,
  currentPage,
  onResume,
  onDelete,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text>⚔️ Habileté : {ability} | ❤️ Endurance : {endurance}</Text>

      <Text style={styles.adventure}>
        📖 {bookTitle} – Page {currentPage}
      </Text>

      {onResume && <PrimaryButton title="➡️ Reprendre" onPress={onResume} />}
      {onDelete && <PrimaryButton title="❌ Supprimer" onPress={onDelete} />}
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
});

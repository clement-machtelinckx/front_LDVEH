import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { globalStyles } from '@/styles/global';

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
    <View style={globalStyles.card}>
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
  name: { fontSize: 18, fontWeight: 'bold' },
  adventure: { marginTop: 8, fontStyle: 'italic' },
});

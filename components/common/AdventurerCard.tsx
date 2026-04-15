// components/common/AdventurerCard.tsx
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
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

      <View style={styles.statRow}>
        <Icon name="sword-cross" size={16} style={styles.icon} />
        <Text style={styles.statText}>Habileté : {ability}</Text>

        <Text style={styles.separator}> | </Text>

        <Icon name="heart-outline" size={16} style={styles.icon} />
        <Text style={styles.statText}>Endurance : {endurance}</Text>
      </View>

      <View style={styles.adventureRow}>
        <Icon name="book-open-page-variant" size={16} style={styles.icon} />
        <Text style={styles.adventureText}>
          {bookTitle} – Page {currentPage}
        </Text>
      </View>

      <View style={styles.actions}>
        {onResume && (
          <PrimaryButton
            title="Reprendre"
            iconLeft="play-circle-outline"
            onPress={onResume}
          />
        )}
        {onDelete && (
          <PrimaryButton
            title="Supprimer"
            iconLeft="trash-can-outline"
            onPress={onDelete}
            style={styles.dangerBtn} // override couleur
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 18, fontWeight: 'bold' },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  icon: { marginRight: 6, color: '#555' },
  statText: { fontSize: 14, color: '#444' },
  separator: { marginHorizontal: 8, color: '#888' },

  adventureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  adventureText: { fontStyle: 'italic', color: '#444' },

  actions: { marginTop: 12, gap: 8 },
  dangerBtn: { backgroundColor: '#B91C1C' }, // rouge pour "Supprimer"
});

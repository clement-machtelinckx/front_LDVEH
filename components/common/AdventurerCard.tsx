import { View, Text, Image, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { globalStyles } from '@/styles/global';

type Props = {
  name: string;
  ability: number;
  endurance: number;
  gold: number;
  bookTitle: string;
  currentPage: number;
  onResume?: () => void;
  onDelete?: () => void;
};

export default function AdventurerCard({
  name,
  ability,
  endurance,
  gold,
  bookTitle,
  currentPage,
  onResume,
  onDelete,
}: Props) {
  return (
    <View style={globalStyles.card}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.statRow}>
        <Image source={require('@/assets/images/swords.png')} style={styles.icon} />
        <Text> Habileté : {ability}  </Text>
        <Image source={require('@/assets/images/heart.png')} style={styles.icon} />
        <Text> Endurance : {endurance}  </Text>
        <Image source={require('@/assets/images/coin.png')} style={styles.icon} />
        <Text> Couronnes : {gold}</Text>
      </View>

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
  statRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  icon: { width: 50, height: 50, resizeMode: 'contain' },
});

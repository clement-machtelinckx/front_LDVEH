// components/common/AdventurerStats.tsx
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { globalStyles } from '@/styles/global';
import Dice from '@/components/common/Dice';

type Props = {
  name: string;
  ability: number;
  endurance: number;
  bookTitle?: string;
  currentPage?: number;
};

export default function AdventurerStats({
  name,
  ability,
  endurance,
}: Props) {
  return (
    <View style={[globalStyles.topCard, styles.row]}>
      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Icon name="human" size={18} style={styles.icon} />
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.statRow}>
          <Icon name="sword-cross" size={18} style={styles.icon} />
          <Text style={styles.statText}>Habileté : {ability}</Text>
        </View>

        <View style={styles.statRow}>
          <Icon name="heart-outline" size={18} style={styles.icon} />
          <Text style={styles.statText}>Endurance : {endurance}</Text>
        </View>
      </View>

      <View style={styles.diceBox}>
        <Dice />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  icon: {
    marginRight: 6,
    color: '#555',
  },
  statText: {
    fontSize: 14,
    color: '#444',
  },
  diceBox: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

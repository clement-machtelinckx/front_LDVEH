import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '@/styles/global';
import Dice from '@/components/common/dice';

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
        <Text style={styles.name}>{name}</Text>
        <Text>⚔️ Habileté : {ability}</Text>
        <Text>❤️ Endurance : {endurance}</Text>

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
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  diceBox: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

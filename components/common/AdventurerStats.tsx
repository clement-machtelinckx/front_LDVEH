import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles/global';
import Dice from '@/components/common/Dice';
import { useState } from 'react';
import InventoryModal from '@/components/metier/InventoryModal';

type Props = {
  name: string;
  ability: number;
  endurance: number;
  gold: number;
  adventurerId: number | null;
  bookTitle?: string;
  currentPage?: number;
  onRollDice: () => void;
  diceValue: number | null;
  isRolling?: boolean;
};

export default function AdventurerStats({
  name,
  ability,
  endurance,
  gold,
  adventurerId,
  onRollDice,
  diceValue,
  isRolling,
}: Props) {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <View style={[globalStyles.topCard, styles.row]}>
      <InventoryModal
        visible={inventoryOpen}
        adventurerId={adventurerId}
        onClose={() => setInventoryOpen(false)}
      />
      <View style={styles.stats}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.statRow}>
          <Image source={require('@/assets/images/swords.png')} style={styles.icon} />
          <Text> Habileté : {ability}</Text>
        </View>
        <View style={styles.statRow}>
          <Image source={require('@/assets/images/heart.png')} style={styles.icon} />
          <Text> Endurance : {endurance}</Text>
        </View>
        <View style={styles.statRow}>
          <Image source={require('@/assets/images/coin.png')} style={styles.icon} />
          <Text> Couronnes : {gold}</Text>
        </View>
      </View>

      <View style={styles.diceBox}>
        <Dice onRoll={onRollDice} value={diceValue} isRolling={isRolling} />
        <TouchableOpacity onPress={() => setInventoryOpen(true)} style={styles.backpackBtn}>
          <Image source={require('@/assets/images/backpack.png')} style={styles.backpackIcon} />
        </TouchableOpacity>
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
    gap: 8,
  },
  backpackBtn: {
    padding: 4,
  },
  backpackIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Dice from '@/components/common/Dice';
import { useState } from 'react';
import InventoryModal from '@/components/metier/InventoryModal';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

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
    <View style={styles.bar}>
      <InventoryModal
        visible={inventoryOpen}
        adventurerId={adventurerId}
        onClose={() => setInventoryOpen(false)}
      />

      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.statsRow}>
          <Stat icon={require('@/assets/images/swords.png')} value={ability} />
          <Stat icon={require('@/assets/images/heart.png')} value={endurance} />
          <Stat icon={require('@/assets/images/coin.png')} value={gold} />
        </View>
      </View>

      <View style={styles.right}>
        <Dice onRoll={onRollDice} value={diceValue} isRolling={isRolling} />
        <View style={styles.backpackWrapper}>
          <TouchableOpacity onPress={() => setInventoryOpen(true)} style={styles.backpackBtn} activeOpacity={0.85}>
            <Image source={require('@/assets/images/backpack.png')} style={styles.backpackIcon} />
          </TouchableOpacity>
          <Text style={styles.backpackLabel}>Sac</Text>
        </View>
      </View>
    </View>
  );
}

function Stat({ icon, value }: { icon: any; value: number }) {
  return (
    <View style={styles.stat}>
      <Image source={icon} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.parchment,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  left: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    color: colors.ink,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  statValue: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.ink,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backpackWrapper: {
    alignItems: 'center',
    gap: 2,
  },
  backpackLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    fontWeight: '700',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  backpackBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radius.md,
    backgroundColor: colors.parchmentDark,
  },
  backpackIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
});

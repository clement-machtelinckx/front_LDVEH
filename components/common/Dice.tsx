import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

type Props = {
  onRoll: () => void;
  value: number | null;
  isRolling?: boolean;
};

export default function Dice({ onRoll, value, isRolling }: Props) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onRoll}
        disabled={isRolling}
        activeOpacity={0.7}
        style={styles.die}
      >
        {isRolling ? (
          <ActivityIndicator color={colors.goldDeep} />
        ) : value !== null ? (
          <Text style={styles.face}>{value}</Text>
        ) : (
          <DicePips />
        )}
      </TouchableOpacity>
      <Text style={styles.label}>{isRolling ? '...' : value !== null ? 'Résultat' : 'Lancer'}</Text>
    </View>
  );
}

function DicePips() {
  return (
    <View style={styles.pips}>
      <View style={[styles.pip, { top: 0, left: 0 }]} />
      <View style={[styles.pip, { top: 0, right: 0 }]} />
      <View style={[styles.pip, { top: '50%', left: '50%', marginTop: -3, marginLeft: -3 }]} />
      <View style={[styles.pip, { bottom: 0, left: 0 }]} />
      <View style={[styles.pip, { bottom: 0, right: 0 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 2,
  },
  die: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.parchment,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  face: {
    fontFamily: fonts.heading,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 9,
    fontWeight: '700',
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  pips: {
    width: 26,
    height: 26,
    position: 'relative',
  },
  pip: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ink,
  },
});

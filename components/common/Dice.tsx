import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '@/components/common/PrimaryButton';

type Props = {
  onRoll: () => void;
  value: number | null;
  isRolling?: boolean;
};

export default function Dice({ onRoll, value, isRolling }: Props) {
  return (
    <View style={styles.container}>
      <PrimaryButton
        title={isRolling ? '...' : '🎲 Lancer le dé'}
        onPress={onRoll}
        disabled={isRolling}
      />
      {value !== null && (
        <Text style={styles.result}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
});

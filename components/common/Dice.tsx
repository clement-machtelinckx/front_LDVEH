// components/Dice.tsx (ou où il est situé)
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '@/components/common/PrimaryButton';

export default function Dice() {
  const [value, setValue] = useState<number | null>(null);

  // Si tu veux un D6 classique, mets const sides = 6;
  const sides = 10;

  const rollDice = () => {
    const random = Math.floor(Math.random() * sides) + 1;
    setValue(random);
  };

  return (
    <View style={styles.container}>
      <PrimaryButton
        title="Lancer le dé"
        iconLeft="dice-multiple-outline" 
        onPress={rollDice}
      />
      {value !== null && <Text style={styles.result}>Résultat : {value}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#222',
  },
});

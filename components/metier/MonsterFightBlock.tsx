import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PrimaryButton from '@/components/common/PrimaryButton';

type Props = {
  monsterName: string;
  isBlocking: boolean;
  pageId: number;
  status: 'idle' | 'inProgress' | 'won' | 'lost';
  result: string | null;
  currentFoughtPageId: number | null;
  onFight: () => void;
};

export default function MonsterFightBlock({
  monsterName,
  isBlocking,
  pageId,
  status,
  result,
  currentFoughtPageId,
  onFight,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ⚔️ Monstre : {monsterName} ({isBlocking ? 'bloquant' : 'non bloquant'})
      </Text>

      {status === 'idle' && <PrimaryButton title="Combattre ce monstre" onPress={onFight} />}
      {status === 'inProgress' && <ActivityIndicator size="large" />}
      {status !== 'idle' && result && currentFoughtPageId === pageId && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
          {status === 'won' && <Text style={{ color: 'green' }}>✅ Victoire ! Tu peux avancer.</Text>}
          {status === 'lost' && <Text style={{ color: 'red' }}>💀 Défaite... (retour au début à implémenter)</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fef5f5',
    borderColor: '#ff9999',
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
  },
});

import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PrimaryButton from '@/components/common/PrimaryButton';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

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
      <View style={styles.header}>
        <Text style={styles.label}>Rencontre hostile</Text>
        <View style={styles.rule} />
        <Text style={styles.name}>{monsterName}</Text>
        <Text style={styles.modifier}>{isBlocking ? 'Combat obligatoire' : 'Combat évitable'}</Text>
      </View>

      {status === 'idle' && <PrimaryButton title="Engager le combat" variant="danger" onPress={onFight} />}
      {status === 'inProgress' && <ActivityIndicator size="large" color={colors.danger} />}

      {status !== 'idle' && result && currentFoughtPageId === pageId && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
          {status === 'won' && <Text style={styles.victory}>Victoire — la voie est libre.</Text>}
          {status === 'lost' && <Text style={styles.defeat}>Défaite — votre aventure s’arrête ici.</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.parchment,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    color: colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  rule: {
    width: '40%',
    height: 1,
    backgroundColor: colors.danger,
    marginVertical: spacing.xs,
  },
  name: {
    fontFamily: fonts.heading,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: 1,
  },
  modifier: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.inkSoft,
    fontStyle: 'italic',
  },
  resultBox: {
    padding: spacing.md,
    backgroundColor: colors.parchmentDark,
    borderTopWidth: 1,
    borderTopColor: colors.parchmentDeep,
    borderRadius: radius.sm,
    gap: spacing.sm,
  },
  resultText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.ink,
    lineHeight: 20,
  },
  victory: {
    fontFamily: fonts.heading,
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.success,
    textAlign: 'center',
    letterSpacing: 1,
  },
  defeat: {
    fontFamily: fonts.heading,
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.danger,
    textAlign: 'center',
    letterSpacing: 1,
  },
});

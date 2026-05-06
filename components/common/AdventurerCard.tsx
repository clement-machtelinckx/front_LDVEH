import { View, Text, Image, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

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
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.bookTitle} numberOfLines={1}>{bookTitle}</Text>
        <Text style={styles.pageInfo}>Page {currentPage}</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat icon={require('@/assets/images/swords.png')} value={ability} />
        <View style={styles.divider} />
        <Stat icon={require('@/assets/images/heart.png')} value={endurance} />
        <View style={styles.divider} />
        <Stat icon={require('@/assets/images/coin.png')} value={gold} />
      </View>

      <View style={styles.actions}>
        {onResume && <PrimaryButton title="Reprendre" onPress={onResume} style={styles.btn} />}
        {onDelete && <PrimaryButton title="Abandonner" variant="danger" onPress={onDelete} style={styles.btn} />}
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
  card: {
    backgroundColor: colors.parchment,
    borderColor: colors.ink,
    borderWidth: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldDeep,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.ink,
    letterSpacing: 1,
  },
  bookTitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.inkSoft,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  pageInfo: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    color: colors.inkMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.parchmentDark,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.ink,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.inkMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  btn: {
    flex: 1,
  },
});

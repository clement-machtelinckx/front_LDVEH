import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { AdventurerSheet, BackpackItem } from '@/store/useAdventurerStore';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

const MAX_WEAPONS = 2;

type Props = {
  sheet: AdventurerSheet;
  onConsume: (slug: string) => void;
  onDrop: (slug: string) => void;
};

export default function InventorySheet({ sheet, onConsume, onDrop }: Props) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.subtitle}>Feuille d’Aventure</Text>
        <View style={styles.titleRule} />
        <Text style={styles.adventurerName}>{sheet.name}</Text>
        <View style={styles.titleRule} />
      </View>

      <View style={styles.statsBlock}>
        <StatCell icon={require('@/assets/images/swords.png')} value={String(sheet.ability)} />
        <StatCell icon={require('@/assets/images/heart.png')} value={`${sheet.endurance} / ${sheet.maxEndurance}`} />
        <StatCell icon={require('@/assets/images/coin.png')} value={String(sheet.gold)} />
      </View>

      <Section title="Armes" counter={`${sheet.weapons.length} / ${MAX_WEAPONS}`}>
        {sheet.weapons.length === 0
          ? <Empty />
          : sheet.weapons.map((w) => (
            <Line key={w.slug} label={w.name} onDrop={() => onDrop(w.slug)} />
          ))}
      </Section>

      <Section title="Objets spéciaux">
        {sheet.specialObjects.length === 0
          ? <Empty />
          : sheet.specialObjects.map((o) => (
            <Line key={o.slug} label={o.name} detail={o.enduranceBonus ? `+${o.enduranceBonus} END` : undefined} />
          ))}
      </Section>

      <Section title="Sac à dos" counter={`${sheet.backpack.count} / ${sheet.backpack.max}`}>
        {sheet.backpack.items.length === 0
          ? <Empty label="Vide" />
          : sheet.backpack.items.map((item) => (
            <BackpackLine
              key={item.slug}
              item={item}
              onConsume={onConsume}
              onDrop={onDrop}
            />
          ))}
      </Section>

      <Section title="Disciplines Kaï">
        {sheet.skills.length === 0
          ? <Empty />
          : sheet.skills.map((s) => <Line key={s.slug} label={s.name} />)}
      </Section>

      <Text style={styles.footerOrnament}>❦</Text>
    </ScrollView>
  );
}

function StatCell({ icon, value }: { icon: ImageSourcePropType; value: string }) {
  return (
    <View style={styles.statCell}>
      <Image source={icon} style={styles.statIcon} />
      <View style={styles.statValueBox}>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

function Section({ title, counter, children }: { title: string; counter?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {counter && <Text style={styles.sectionCounter}>{counter}</Text>}
      </View>
      <View style={styles.sectionRule} />
      {children}
    </View>
  );
}

function Line({ label, detail, onDrop }: { label: string; detail?: string; onDrop?: () => void }) {
  return (
    <View style={styles.line}>
      <Text style={styles.bullet}>—</Text>
      <Text style={styles.lineLabel}>{label}</Text>
      {detail && <Text style={styles.lineDetail}>{detail}</Text>}
      {onDrop && (
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionDrop]}
          onPress={onDrop}
          activeOpacity={0.85}
        >
          <Text style={styles.actionText}>Jeter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function BackpackLine({ item, onConsume, onDrop }: {
  item: BackpackItem;
  onConsume: (slug: string) => void;
  onDrop: (slug: string) => void;
}) {
  const isConsumable = item.type === 'potion';
  return (
    <View style={styles.line}>
      <Text style={styles.bullet}>—</Text>
      <View style={styles.lineMain}>
        <Text style={styles.lineLabel}>
          {item.name}{item.quantity > 1 ? `  ×${item.quantity}` : ''}
        </Text>
        {item.healAmount ? <Text style={styles.lineDetail}>+{item.healAmount} END</Text> : null}
      </View>
      <View style={styles.actions}>
        {isConsumable && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionConsume]}
            onPress={() => onConsume(item.slug)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>{item.type === 'meal' ? 'Manger' : 'Boire'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionDrop]}
          onPress={() => onDrop(item.slug)}
          activeOpacity={0.85}
        >
          <Text style={styles.actionText}>Jeter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Empty({ label = 'Néant' }: { label?: string }) {
  return <Text style={styles.empty}>· {label} ·</Text>;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    color: colors.inkMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  titleRule: {
    width: '60%',
    height: 1,
    backgroundColor: colors.goldDeep,
    marginVertical: spacing.sm,
  },
  adventurerName: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    color: colors.ink,
    letterSpacing: 1,
  },

  statsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginBottom: spacing.xs,
  },
  statValueBox: {
    width: '100%',
    paddingVertical: spacing.sm,
    backgroundColor: colors.parchmentDark,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.ink,
  },

  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionCounter: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.inkSoft,
    fontStyle: 'italic',
  },
  sectionRule: {
    height: 1,
    backgroundColor: colors.ink,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },

  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.parchmentDeep,
    gap: spacing.sm,
  },
  bullet: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.goldDeep,
  },
  lineMain: { flex: 1 },
  lineLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.ink,
    flex: 1,
  },
  lineDetail: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.inkSoft,
    fontStyle: 'italic',
    marginLeft: spacing.sm,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.inkMuted,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  actionConsume: {
    backgroundColor: colors.parchment,
    borderColor: colors.success,
  },
  actionDrop: {
    backgroundColor: colors.parchment,
    borderColor: colors.danger,
  },
  actionText: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  footerOrnament: {
    textAlign: 'center',
    color: colors.goldDeep,
    fontSize: fontSize.lg,
    marginTop: spacing.lg,
  },
});

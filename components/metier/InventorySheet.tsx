import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { AdventurerSheet } from '@/store/useAdventurerStore';

type Props = { sheet: AdventurerSheet };

export default function InventorySheet({ sheet }: Props) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.statsRow}>
        <Image source={require('@/assets/images/swords.png')} style={styles.icon} />
        <Text style={styles.statText}>{sheet.ability}</Text>
        <Image source={require('@/assets/images/heart.png')} style={styles.icon} />
        <Text style={styles.statText}>{sheet.endurance} / {sheet.maxEndurance}</Text>
        <Image source={require('@/assets/images/coin.png')} style={styles.icon} />
        <Text style={styles.statText}>{sheet.gold}</Text>
      </View>

      <Section title="⚔️ Armes">
        {sheet.weapons.length === 0
          ? <Empty />
          : sheet.weapons.map((w) => <Row key={w.slug} label={w.name} />)}
      </Section>

      <Section title="🛡️ Objets spéciaux">
        {sheet.specialObjects.length === 0
          ? <Empty />
          : sheet.specialObjects.map((o) => (
            <Row key={o.slug} label={o.name} detail={o.enduranceBonus ? `+${o.enduranceBonus} END` : undefined} />
          ))}
      </Section>

      <Section title={`🎒 Sac à dos (${sheet.backpack.count}/${sheet.backpack.max})`}>
        {sheet.backpack.items.length === 0
          ? <Empty label="Vide" />
          : sheet.backpack.items.map((item) => (
            <Row
              key={item.slug}
              label={item.name}
              quantity={item.quantity}
              detail={item.healAmount ? `+${item.healAmount} END` : undefined}
            />
          ))}
      </Section>

      <Section title="📖 Disciplines Kaï">
        {sheet.skills.length === 0
          ? <Empty />
          : sheet.skills.map((s) => <Row key={s.slug} label={s.name} />)}
      </Section>

    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, quantity, detail }: { label: string; quantity?: number; detail?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}{quantity && quantity > 1 ? ` ×${quantity}` : ''}</Text>
      {detail && <Text style={styles.rowDetail}>{detail}</Text>}
    </View>
  );
}

function Empty({ label = 'Aucun' }: { label?: string }) {
  return <Text style={styles.empty}>{label}</Text>;
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  icon: { width: 20, height: 20, resizeMode: 'contain' },
  statText: { fontSize: 14, fontWeight: '600', marginRight: 8 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 6 },
  empty: { color: '#aaa', fontStyle: 'italic', fontSize: 13 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowLabel: { fontSize: 14, color: '#333' },
  rowDetail: { fontSize: 12, color: '#888' },
});

import { Text, View, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

type Props = {
  content: string;
};

export default function TextCard({ content }: Props) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map(p => p.replace(/\n/g, ' ').trim())
    .filter(p => p.length > 0);

  return (
    <View style={styles.card}>
      <View style={styles.innerBorder}>
        {paragraphs.map((p, i) => (
          <Text key={i} style={[styles.text, i > 0 && styles.paragraph]}>
            {i === 0 && p.length > 0 ? (
              <>
                <Text style={styles.dropCap}>{p.charAt(0)}</Text>
                {p.slice(1)}
              </>
            ) : (
              p
            )}
          </Text>
        ))}
        <Text style={styles.ornament}>✦</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.parchment,
    borderColor: colors.ink,
    borderWidth: 2,
    borderRadius: radius.sm,
    padding: spacing.xs,
  },
  innerBorder: {
    borderColor: colors.inkMuted,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.lg,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    lineHeight: 26,
    textAlign: 'justify',
    color: colors.ink,
  },
  dropCap: {
    fontFamily: fonts.body,
    fontSize: 32,
    fontWeight: '700',
    color: colors.goldDeep,
    lineHeight: 32,
  },
  paragraph: { marginTop: spacing.md },
  ornament: {
    textAlign: 'center',
    color: colors.goldDeep,
    fontSize: fontSize.lg,
    marginTop: spacing.md,
  },
});

import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'ghost';
};

export default function PrimaryButton({ title, onPress, style, disabled, variant = 'primary' }: Props) {
  const v = variants[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.base, v.bg, disabled && styles.disabled, style]}
    >
      <Text style={[styles.text, v.text]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.heading,
    fontSize: fontSize.base,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  disabled: { opacity: 0.4 },
});

const variants = {
  primary: {
    bg: { backgroundColor: colors.leather, borderColor: colors.gold },
    text: { color: colors.gold },
  },
  danger: {
    bg: { backgroundColor: colors.danger, borderColor: colors.danger },
    text: { color: colors.parchment },
  },
  ghost: {
    bg: { backgroundColor: 'transparent', borderColor: colors.ink },
    text: { color: colors.ink },
  },
};

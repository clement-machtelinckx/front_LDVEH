// components/common/NavButton.tsx
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
  compact?: boolean;
};

export default function NavButton({ icon, label, onPress, danger = false, compact = false }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, danger && styles.danger]}>
        {icon}
        {!compact && ` ${label}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  danger: {
    color: '#ff4d4d',
  },
  pressed: {
    opacity: 0.6,
  },
});

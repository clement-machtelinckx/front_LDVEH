// components/common/PrimaryButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  iconLeft?: React.ComponentProps<typeof Icon>['name'];   // ⬅️ NEW
  iconRight?: React.ComponentProps<typeof Icon>['name'];  // ⬅️ NEW
};

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  style,
  iconLeft,
  iconRight,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled && styles.btnDisabled, style]}
    >
      {iconLeft ? <Icon name={iconLeft} size={18} style={styles.iconLeft} /> : null}
      <Text style={styles.text}>{title}</Text>
      {iconRight ? <Icon name={iconRight} size={18} style={styles.iconRight} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#212837',
  },
  btnDisabled: { opacity: 0.6 },
  text: { color: 'white', fontWeight: '600', fontSize: 16 },
  iconLeft: { marginRight: 8, color: 'white' },
  iconRight: { marginLeft: 8, color: 'white' },
});

// components/common/NavButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  icon?: string; // emoji legacy
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap; // MDI
  label: string;
  onPress: () => void;
  danger?: boolean;
  compact?: boolean;
};

export default function NavButton({ icon, iconName, label, onPress, danger, compact }: Props) {
  return (
    <TouchableOpacity style={[styles.btn, compact && styles.compact]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.inner}>
        {iconName ? (
          <MaterialCommunityIcons
            name={iconName}
            size={22}
            color={danger ? '#b42318' : '#111827'}
            style={{ marginBottom: 4 }}
          />
        ) : (
          <Text style={[styles.emoji, danger && { color: '#b42318' }]}>{icon}</Text>
        )}
        <Text style={[styles.label, danger && { color: '#b42318' }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 8, paddingVertical: 6, alignItems: 'center' },
  compact: { paddingHorizontal: 4 },
  inner: { alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 18, marginBottom: 4 },
  label: { fontSize: 12, color: '#111827' },
});

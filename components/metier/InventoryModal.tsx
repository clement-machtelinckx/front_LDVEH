import { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import InventorySheet from './InventorySheet';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

type Props = {
  visible: boolean;
  adventurerId: number | null;
  onClose: () => void;
};

export default function InventoryModal({ visible, adventurerId, onClose }: Props) {
  const { sheet, fetchSheet, consumeItem, dropItem } = useAdventurerStore();

  useEffect(() => {
    if (visible && adventurerId) {
      fetchSheet(adventurerId);
    }
  }, [visible, adventurerId]);

  const handleConsume = async (slug: string) => {
    if (!adventurerId) return;
    await consumeItem(adventurerId, slug);
  };

  const handleDrop = async (slug: string) => {
    if (!adventurerId) return;
    await dropItem(adventurerId, slug);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.innerBorder}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {!sheet ? (
              <ActivityIndicator size="large" color={colors.goldDeep} style={{ marginTop: 64 }} />
            ) : (
              <InventorySheet
                sheet={sheet}
                onConsume={handleConsume}
                onDrop={handleDrop}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 20, 16, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 560,
    height: '92%',
    backgroundColor: colors.parchment,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radius.sm,
    padding: spacing.xs,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.goldDeep,
    borderRadius: radius.sm,
    padding: spacing.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    fontFamily: fonts.body,
    fontSize: fontSize.lg,
    color: colors.inkSoft,
  },
});

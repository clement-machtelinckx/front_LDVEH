import { useEffect } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import InventorySheet from './InventorySheet';

type Props = {
  visible: boolean;
  adventurerId: number | null;
  onClose: () => void;
};

export default function InventoryModal({ visible, adventurerId, onClose }: Props) {
  const { sheet, fetchSheet } = useAdventurerStore();

  useEffect(() => {
    if (visible && adventurerId) fetchSheet(adventurerId);
  }, [visible, adventurerId]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.box}>

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Image source={require('@/assets/images/backpack.png')} style={styles.titleIcon} />
              <Text style={styles.title}>Sac à dos</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {!sheet
            ? <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            : <InventorySheet sheet={sheet} />}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  box: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleIcon: { width: 24, height: 24, resizeMode: 'contain' },
  title: { fontSize: 18, fontWeight: 'bold' },
  close: { fontSize: 20, color: '#888', paddingHorizontal: 8 },
});

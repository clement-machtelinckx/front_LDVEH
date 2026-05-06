// components/EndingModal.tsx
import { View, Text, Modal, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  visible: boolean;
  type: 'death' | 'victory' | null;
};

export default function EndingModal({ visible, type }: Props) {
  const router = useRouter();

  if (!type) return null;

  const isVictory = type === 'victory';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={[styles.title, { color: isVictory ? 'green' : 'red' }]}>
            {isVictory ? 'Bravo !' : 'Vous êtes mort'}
          </Text>
          <Text style={styles.message}>
            {isVictory
              ? 'Félicitations, vous avez terminé cette aventure avec succès !'
              : 'Votre mission s’achève ici... mais vous pouvez toujours retenter votre chance !'}
          </Text>
          <Button title="Retour aux livres" onPress={() => router.replace('/book')} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    gap: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});

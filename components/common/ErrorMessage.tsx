import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useErrorStore } from '@/store/useErrorStore';

type Props = {
  message: string | null;
};

export default function ErrorMessage({ message }: Props) {
  const { clearError } = useErrorStore();

  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>❌ {message}</Text>
      <TouchableOpacity onPress={clearError}>
        <Text style={styles.close}>✖</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffe5e5',
    borderColor: '#ff4d4d',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#b00000',
    fontWeight: '600',
    flex: 1,
  },
  close: {
    marginLeft: 12,
    fontWeight: 'bold',
    color: '#b00000',
  },
});

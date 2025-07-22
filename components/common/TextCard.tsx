import { Text, View, StyleSheet } from 'react-native';

type Props = {
  content: string;
};

export default function TextCard({ content }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

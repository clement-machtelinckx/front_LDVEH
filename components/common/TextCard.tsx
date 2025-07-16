import { Text, View, StyleSheet } from 'react-native';

type Props = {
  content: string;
};

export default function TextCard({ content }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
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

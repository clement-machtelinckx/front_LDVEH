import { Text, View, StyleSheet } from 'react-native';

type Props = {
  content: string;
};

export default function TextCard({ content }: Props) {
  // Remplace les \n simples  par un espace,
  // et les \n\n par de vrais sauts de paragraphe
  const paragraphs = content
    .split(/\n{2,}/)
    .map(p => p.replace(/\n/g, ' ').trim())
    .filter(p => p.length > 0);

  return (
    <View style={styles.card}>
      {paragraphs.map((p, i) => (
        <Text key={i} style={[styles.text, i > 0 && styles.paragraph]}>{p}</Text>
      ))}
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
    lineHeight: 24,
    textAlign: 'justify',
  },
  paragraph: {
    marginTop: 12,
  },
});

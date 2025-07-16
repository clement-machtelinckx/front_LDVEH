// components/common/BookCard.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  description: string;
  pagesCount?: number;
  author?: string;
  onPress: () => void;
};

export default function BookCard({ title, description, pagesCount = 0, author = 'Auteur inconnu', onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.bookTitle}>{title}</Text>
      <Text style={styles.bookDesc}>{description}</Text>

      <View style={styles.metaInfo}>
        <Text style={styles.meta}>📄 {pagesCount} pages</Text>
        <Text style={styles.meta}>✍️ {author}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    elevation: 2,
  },
  bookTitle: { fontSize: 18, fontWeight: '600' },
  bookDesc: { fontSize: 14, color: '#555', marginTop: 6 },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  meta: {
    fontSize: 12,
    color: '#777',
  },
});

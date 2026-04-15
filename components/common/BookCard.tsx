// components/common/BookCard.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { globalStyles } from '@/styles/global';

type Props = {
  title: string;
  description: string;
  pagesCount?: number;
  author?: string;
  onPress: () => void;
};

export default function BookCard({
  title,
  description,
  pagesCount = 0,
  author = 'Auteur inconnu',
  onPress,
}: Props) {
  return (
    <Pressable style={globalStyles.card} onPress={onPress}>
      <Text style={styles.bookTitle}>{title}</Text>
      <Text style={styles.bookDesc}>{description}</Text>

      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Icon name="file-document-outline" size={16} style={styles.metaIcon} />
          <Text style={styles.metaText}>{pagesCount} pages</Text>
        </View>

        <View style={styles.metaItem}>
          <Icon name="account-edit-outline" size={16} style={styles.metaIcon} />
          <Text style={styles.metaText}>{author}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bookTitle: { fontSize: 18, fontWeight: '600' },
  bookDesc: { fontSize: 14, color: '#555', marginTop: 6 },

  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 6,
    color: '#777',
  },
  metaText: {
    fontSize: 12,
    color: '#777',
  },
});

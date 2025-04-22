import { useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAdventureStore } from '@/store/useAdventureStore';

export default function PageScreen() {
  const { pageId } = useLocalSearchParams();
  const router = useRouter();
  const { currentPage, goToPage } = useAdventureStore();

  useEffect(() => {
    if (pageId) {
      goToPage(Number(pageId));
    }
  }, [pageId]);

  if (!currentPage) return <Text>Chargement de la page...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageNumber}>Page {currentPage.pageNumber}</Text>
      <Text style={styles.content}>{currentPage.content}</Text>

      <View style={styles.choices}>
        {currentPage.choices.map((choice, index) => (
          <Button
            key={index}
            title={choice.text}
            onPress={() => {
              goToPage(choice.nextPage, currentPage.pageId);
            //   router.push(`/page/${choice.nextPage}`);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  pageNumber: { fontSize: 20, fontWeight: 'bold' },
  content: { fontSize: 16 },
  choices: { gap: 12 },
});

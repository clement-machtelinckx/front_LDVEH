import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useCombatStore } from '@/store/useCombatStore';
import EndingModal from '@/components/EndingModal';
import TextCard from '@/components/common/TextCard';
import PrimaryButton from '@/components/common/PrimaryButton';
import MonsterFightBlock from '@/components/metier/MonsterFightBlock';



export default function PageScreen() {
  const { pageId } = useLocalSearchParams();
  const router = useRouter();
  const { currentPage, goToPage } = useAdventureStore();

  const {
    status,
    result,
    currentFoughtPageId,
    fight,
    reset,
  } = useCombatStore();
  

  useEffect(() => {
    if (pageId) {
      goToPage(Number(pageId));
    }
  }, [pageId]);

  useEffect(() => {
    reset();
  }, [currentPage?.pageId]);
  

  const handleStartFight = () => {
    if (currentPage?.monsterId) {
      fight(currentPage.monsterId);
    }
  };

  if (!currentPage) return <Text>Chargement de la page...</Text>;

  return (
    <>
      <EndingModal visible={!!currentPage?.endingType} type={currentPage?.endingType || null} />
  
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.pageNumber}>Page {currentPage.pageNumber}</Text>

          <TextCard content={currentPage.content} />

          {currentPage.monsterId && (
            <MonsterFightBlock
              monsterName={currentPage.monster}
              isBlocking={currentPage.isBlocking}
              pageId={currentPage.pageId}
              status={status}
              result={result?.log || null}
              currentFoughtPageId={currentFoughtPageId}
              onFight={handleStartFight}
            />
          )}

    <View style={styles.choices}>
      {currentPage.choices.map((choice, index) => (
        <PrimaryButton
          key={index}
          title={choice.text}
          onPress={() => {
            if (currentPage.isBlocking && status !== 'won') return;
            goToPage(choice.nextPage, currentPage.pageId);
          }}
        />
      ))}
    </View>
  </ScrollView>

    </>
  );
  
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  pageNumber: { fontSize: 20, fontWeight: 'bold' },
content: {
  fontSize: 16,
  textAlign: 'center',
  backgroundColor: '#f9f9f9', // blanc cassé
  borderColor: '#ddd',        // bordure douce
  borderWidth: 1,
  borderRadius: 8,
  padding: 16,
},
  choices: { 
    gap: 12,
    borderRadius: 8,
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,  
    backgroundColor: '#f9f9f9',
  },
  combatBlock: {
    marginTop: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fef5f5',
    borderColor: '#ff9999',
    borderWidth: 1,
  },
  blocking: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
  },
});

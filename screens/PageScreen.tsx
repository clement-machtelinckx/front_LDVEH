import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import { useCombatStore } from '@/store/useCombatStore';
import { useErrorStore } from '@/store/useErrorStore';
import TextCard from '@/components/common/TextCard';
import PrimaryButton from '@/components/common/PrimaryButton';
import MonsterFightBlock from '@/components/metier/MonsterFightBlock';
import AdventurerStats from '@/components/common/AdventurerStats';
import { globalStyles } from '@/styles/global';

export default function PageScreen() {
  const { pageId } = useLocalSearchParams();
  const router = useRouter();
const { currentPage, goToPage } = useAdventureStore();
const { activeAdventurer } = useAdventurerStore();
  const { setError } = useErrorStore();


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

        <AdventurerStats
          name={activeAdventurer?.AdventurerName || 'Inconnu'}
          ability={activeAdventurer?.Ability || 0}
          endurance={activeAdventurer?.Endurance || 0}
          bookTitle={currentPage.bookTitle}
          currentPage={currentPage.pageNumber}
        />
        <ScrollView contentContainerStyle={styles.wrapper}>

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
      {currentPage.endingType ? (
        <PrimaryButton
          title={
            currentPage.endingType === 'victory'
              ? '🎉 Terminer l’aventure'
              : '💀 Recommencer'
          }
          onPress={async () => {
            const {
              adventureId,
              clearAdventure,
              finishAdventure,
              deleteAdventure,
            } = useAdventureStore.getState();

            if (!adventureId) return;

            const success =
              currentPage.endingType === 'victory'
                ? await finishAdventure(adventureId)
                : await deleteAdventure(adventureId);

            if (success) {
              clearAdventure();
              router.replace('/book');
            }
          }}
        />
      ) : (
        currentPage.choices.map((choice, index) => (
          <PrimaryButton
            key={index}
            title={choice.text}
            onPress={() => {
              if (currentPage.isBlocking && status !== 'won') {
                setError("Tu dois d'abord vaincre le monstre pour continuer !");
                return;
              }
              goToPage(choice.nextPage, currentPage.pageId);
            }}
          />
        ))
      )}
    </View>

  </ScrollView>

    </>
  );
  
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  pageNumber: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  content: {
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',        
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  wrapper: {
    padding: 24,
    gap: 16,
    backgroundColor: '#eee',
  },
  choices: { 
    gap: 12,
    borderRadius: 8,
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,  
    backgroundColor: '#fff',
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

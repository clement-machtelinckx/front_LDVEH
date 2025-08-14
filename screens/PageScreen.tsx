// PageScreen.tsx
import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { useAdventureStore } from '@/store/useAdventureStore';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import { useCombatStore } from '@/store/useCombatStore';
import { useErrorStore } from '@/store/useErrorStore';

import TextCard from '@/components/common/TextCard';
import PrimaryButton from '@/components/common/PrimaryButton';
import MonsterFightBlock from '@/components/metier/MonsterFightBlock';
import AdventurerStats from '@/components/common/AdventurerStats';

export default function PageScreen() {
  const { pageId } = useLocalSearchParams();
  const router = useRouter();

  const { currentPage, goToPage, adventureId } = useAdventureStore();
  const { activeAdventurer, ensureActiveForAdventure, refreshActiveAdventurer } = useAdventurerStore();
  const { setError } = useErrorStore();

  const {
    status,
    result,
    currentFoughtPageId,
    fight,
    reset,
  } = useCombatStore();

  // Charger la page
  useEffect(() => {
    if (pageId) goToPage(Number(pageId));
  }, [pageId]);

  // Reset état combat quand on change de page
  useEffect(() => {
    reset();
  }, [currentPage?.pageId]);

  // Assurer un aventurier actif lié à l’aventure
  useEffect(() => {
    if (adventureId) {
      ensureActiveForAdventure(adventureId);
    }
  }, [adventureId]);

  // Rafraîchir au focus (utile quand on revient d’ailleurs)
  useFocusEffect(
    useCallback(() => {
      refreshActiveAdventurer();
    }, [refreshActiveAdventurer])
  );

  // Après un combat terminé, resynchroniser l’ENDURANCE
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      refreshActiveAdventurer();
    }
  }, [status]);

  const handleStartFight = () => {
    if (currentPage?.monsterId) {
      fight(currentPage.monsterId);
    }
    refreshActiveAdventurer()
  };

  if (!currentPage) return <Text>Chargement de la page...</Text>;

  return (
    <>
      <AdventurerStats
        name={activeAdventurer?.AdventurerName || 'Inconnu'}
        ability={activeAdventurer?.Ability ?? 0}
        endurance={activeAdventurer?.Endurance ?? 0}
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
  pageNumber: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  wrapper: { padding: 24, gap: 16, backgroundColor: '#eee' },
  choices: {
    gap: 12, borderRadius: 8, padding: 12,
    borderColor: '#ddd', borderWidth: 1, backgroundColor: '#fff',
  },
});

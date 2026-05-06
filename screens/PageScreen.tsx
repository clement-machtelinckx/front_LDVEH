// PageScreen.tsx
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { useAdventureStore, AvailableItem } from '@/store/useAdventureStore';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import { useCombatStore } from '@/store/useCombatStore';
import { useErrorStore } from '@/store/useErrorStore';

import TextCard from '@/components/common/TextCard';
import PrimaryButton from '@/components/common/PrimaryButton';
import MonsterFightBlock from '@/components/metier/MonsterFightBlock';
import AdventurerStats from '@/components/common/AdventurerStats';
import { colors, fonts, fontSize, spacing, radius } from '@/styles/theme';

export default function PageScreen() {
  const { pageId } = useLocalSearchParams();
  const router = useRouter();

  const { currentPage, goToPage, adventureId, adventurerId, rollDice, diceResult, clearDiceResult } = useAdventureStore();
  const { activeAdventurer, ensureActiveForAdventure, refreshActiveAdventurer, takeItem, takeGold, sheet, fetchSheet } = useAdventurerStore();
  const { setError } = useErrorStore();

  const { status, result, currentFoughtPageId, fight, reset } = useCombatStore();

  useEffect(() => {
    if (!activeAdventurer && adventureId) {
      ensureActiveForAdventure(adventureId);
    }
  }, [activeAdventurer, adventureId]);

  useEffect(() => {
    if (pageId) goToPage(Number(pageId));
  }, [pageId]);

  useEffect(() => {
    reset();
  }, [currentPage?.pageId]);

  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      // refreshActiveAdventurer();
    }
  }, [status]);

  const [isRolling, setIsRolling] = useState(false);
  const [takenSlugs, setTakenSlugs] = useState<Set<string>>(new Set());
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    clearDiceResult();
    setTakenSlugs(new Set());
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    if (adventurerId) fetchSheet(adventurerId);
  }, [currentPage?.pageId]);

  const handleTake = async (item: AvailableItem) => {
    if (!adventurerId || takenSlugs.has(item.slug)) return;

    // Validations client
    if (item.type === 'weapon' && (sheet?.weapons.length ?? 0) >= 2) {
      setError("Séparez-vous d'une arme avant d'en prendre une nouvelle.");
      return;
    }
    if (
      item.type !== 'gold' &&
      item.type !== 'weapon' &&
      sheet &&
      sheet.backpack.count >= sheet.backpack.max
    ) {
      setError('Votre inventaire est plein.');
      return;
    }

    setTakenSlugs(prev => new Set(prev).add(item.slug));
    if (item.type === 'gold') {
      await takeGold(adventurerId, item.quantity);
    } else {
      await takeItem(adventurerId, item.slug);
    }
  };

  const isDead = currentPage?.adventurerEndurance !== undefined && currentPage.adventurerEndurance <= 0;

  const handleRollDice = async () => {
    setIsRolling(true);
    const result = await rollDice();
    setIsRolling(false);

    if (result?.nextPage) {
      setTimeout(() => {
        goToPage(result.nextPage!, currentPage?.pageId);
      }, 2000);
    }
  };

  const handleStartFight = () => {
    if (currentPage?.monsterId) {
      fight(currentPage.monsterId);
    }
  };

  if (!currentPage) return <Text style={styles.loading}>Chargement de la page…</Text>;

  return (
    <>
      <AdventurerStats
        name={activeAdventurer?.AdventurerName || 'Inconnu'}
        ability={currentPage.adventurerAbility}
        endurance={currentPage.adventurerEndurance}
        gold={currentPage.adventurerGold}
        adventurerId={adventurerId}
        bookTitle={currentPage.bookTitle}
        currentPage={currentPage.pageNumber}
        onRollDice={handleRollDice}
        diceValue={diceResult?.roll ?? null}
        isRolling={isRolling}
      />

      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.wrapper}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageOrnament}>❦</Text>
          <Text style={styles.pageNumber}>Chapitre {currentPage.pageNumber}</Text>
          <Text style={styles.pageOrnament}>❦</Text>
        </View>

        <TextCard content={currentPage.content} />

        {(currentPage.itemsAvailable ?? []).length > 0 && (
          <View style={styles.itemsBox}>
            <Text style={styles.itemsTitle}>Trésors à portée</Text>
            {currentPage.itemsAvailable.map((item: AvailableItem) => {
              const taken = takenSlugs.has(item.slug);
              return (
                <View key={item.slug} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.slug}{item.quantity > 1 ? `  ×${item.quantity}` : ''}
                  </Text>
                  <TouchableOpacity
                    style={[styles.itemBtn, taken && styles.itemBtnDisabled]}
                    activeOpacity={0.85}
                    disabled={taken}
                    onPress={() => handleTake(item)}
                  >
                    <Text style={styles.itemBtnText}>{taken ? 'Pris' : 'Prendre'}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

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
          <Text style={styles.choicesTitle}>
            {isDead || status === 'lost' ? 'Vous avez péri…' : 'Que faites-vous ?'}
          </Text>
          {isDead || status === 'lost' ? (
            <PrimaryButton
              title="Recommencer l’aventure"
              variant="danger"
              onPress={async () => {
                const { adventureId, clearAdventure, deleteAdventure } = useAdventureStore.getState();
                if (!adventureId) return;
                const success = await deleteAdventure(adventureId);
                if (success) {
                  clearAdventure();
                  router.replace('/book');
                }
              }}
            />
          ) : currentPage.endingType ? (
            <PrimaryButton
              title={currentPage.endingType === 'victory' ? 'Achever l’aventure' : 'Recommencer'}
              variant={currentPage.endingType === 'victory' ? 'primary' : 'danger'}
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
            (currentPage.choices ?? []).filter(c => !c.requiresDiceRoll).map((choice, index) => (
              <PrimaryButton
                key={index}
                title={choice.text}
                disabled={choice.available === false}
                onPress={() => {
                  if (choice.available === false) {
                    setError('Vous ne remplissez pas les conditions pour ce choix.');
                    return;
                  }
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
  scroll: {
    backgroundColor: colors.parchmentDark,
  },
  wrapper: {
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.parchmentDark,
  },
  loading: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.inkSoft,
    textAlign: 'center',
    padding: spacing.xl,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  pageOrnament: {
    fontSize: fontSize.lg,
    color: colors.goldDeep,
  },
  pageNumber: {
    fontFamily: fonts.body,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  itemsBox: {
    backgroundColor: colors.parchment,
    borderRadius: radius.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    gap: spacing.sm,
  },
  itemsTitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.goldDeep,
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.parchmentDeep,
  },
  itemName: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.ink,
    flex: 1,
  },
  itemBtn: {
    backgroundColor: colors.leather,
    borderWidth: 1,
    borderColor: colors.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  itemBtnText: {
    color: colors.gold,
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  choices: {
    gap: spacing.md,
    borderRadius: radius.sm,
    padding: spacing.lg,
    borderColor: colors.ink,
    borderWidth: 2,
    backgroundColor: colors.parchment,
  },
  choicesTitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.inkSoft,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
});

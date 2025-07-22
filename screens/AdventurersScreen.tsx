import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdventureStore } from '@/store/useAdventureStore';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import AdventurerList from '@/components/metier/AdventurerList';
import { globalStyles } from '@/styles/global';

export default function AdventurersScreen() {
  const {
    adventurers,
    fetchAdventurers,
    setActiveAdventurer,
    loading,
  } = useAdventurerStore();

  const router = useRouter();

  useEffect(() => {
    fetchAdventurers();
  }, []);

  const handleResume = (a) => {
    setActiveAdventurer(a);
    useAdventureStore.setState({
      adventureId: a.adventure!.id,
      adventurerId: a.id,
    });
    router.replace(`/page/${a.adventure!.currentPage.id}`);
  };

  const handleDelete = async (a) => {
    const success = await useAdventureStore.getState().deleteAdventure(a.adventure.id);
    if (success) {
      fetchAdventurers();
    }
  };



  return (
    <View style={globalStyles.pageContainer}>
      <Text style={globalStyles.titleCenter}>Tes Aventuriers</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <AdventurerList
          adventurers={adventurers}
          loading={loading}
          onResume={handleResume}
          onDelete={handleDelete}
        />
      )}
    </View>
  );
}


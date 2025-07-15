import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAdventureStore } from '@/store/useAdventureStore';

export default function StartAdventureScreen() {
  const { bookId } = useLocalSearchParams(); 
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!name || !bookId) {
      Alert.alert('Erreur', 'Nom ou livre manquant');
      return;
    }

    try {
      setLoading(true);
      await useAdventureStore.getState().startAdventure(Number(bookId), name);
      const page = useAdventureStore.getState().currentPage;
      if (page) {
        router.replace(`/page/${page.pageId}`);
      } else {
        Alert.alert('Erreur', 'Page de départ introuvable');
      }
    } catch (error) {
      console.error('Start adventure error:', error);
      Alert.alert('Erreur', 'Impossible de démarrer l’aventure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nom de ton aventurier 🧙</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex : Thorvald"
        value={name}
        onChangeText={setName}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Commencer l’aventure" onPress={handleStart} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
});

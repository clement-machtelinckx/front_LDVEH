import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useProfile } from '@/store/useProfile';
import { useAdventurerStore } from '@/store/useAdventurerStore';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/common/PrimaryButton';
import AdventurerCard from '@/components/common/AdventurerCard';

export default function ProfileScreen() {
  const { profile, fetchProfile, updateProfile, loading, error } = useProfile();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setActiveAdventurer } = useAdventurerStore();
  const router = useRouter();

  const {
    adventurers,
    fetchAdventurers,
    loading: loadingAdventurers,
  } = useAdventurerStore();

  useEffect(() => {
    fetchProfile();
    fetchAdventurers();
  }, []);

  useEffect(() => {
    if (profile) setEmail(profile.email);
  }, [profile]);

  const handleUpdate = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('❌ Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    const success = await updateProfile({ email, newPassword: newPassword || undefined });
    if (success) {
      Alert.alert('✅ Succès', 'Profil mis à jour');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      Alert.alert('❌ Erreur', error || 'Une erreur est survenue');
    }
  };

  if (loading && !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Nouveau mot de passe</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
        placeholder="Laisse vide si inchangé"
      />

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
        placeholder="Re-saisir le mot de passe"
      />

      <PrimaryButton title="Mettre à jour" onPress={handleUpdate} />

      <Text style={[styles.title, { marginTop: 32 }]}>👤 Mes aventuriers</Text>

        {loadingAdventurers ? (
        <ActivityIndicator size="small" />
        ) : (
        adventurers.map((a) => (
            <AdventurerCard
            key={a.id}
            name={a.AdventurerName}
            ability={a.Ability}
            endurance={a.Endurance}
            bookTitle={a.adventure?.book.title}
            currentPage={a.adventure?.currentPage.pageNumber}
            onResume={
                a.adventure
                ? () => {
                    setActiveAdventurer(a);
                    useAdventureStore.setState({
                        adventureId: a.adventure!.id,
                        adventurerId: a.id,
                    });
                    router.replace(`/page/${a.adventure!.currentPage.id}`);
                    }
                : undefined
            }
            />
        ))
        )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

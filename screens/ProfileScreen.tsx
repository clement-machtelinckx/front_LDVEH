import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Picker
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import { useProfile } from '@/store/useProfile';
// import { useAdventurerStore } from '@/store/useAdventurerStore';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/common/PrimaryButton';
import AdventureHistoryList from '@/components/metier/AdventureHistoryList';

export default function ProfileScreen() {
  const { profile, fetchProfile, updateProfile, loading, error } = useProfile();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [age, setAge] = useState('');
  const { userHistories, fetchUserHistories } = useAdventureStore();
  const router = useRouter();
  // const { fetchAdventurers } = useAdventurerStore();

  useEffect(() => {
    fetchProfile();
    // fetchAdventurers();
  }, []);

  // profile loaded → update states
  useEffect(() => {
    if (profile) {
      setEmail(profile.email || '');
      setFirstname(profile.firstname || '');
      setLastname(profile.lastname || '');
      setNickname(profile.nickname || '');
      setGender(profile.gender || '');
      setAge(profile.age?.toString() || '');
    }
  }, [profile]);

  // once profile.id is ready → fetch user histories
  useEffect(() => {
    if (profile?.id) {
      fetchUserHistories(profile.id); 
    }
  }, [profile?.id]);


  const handleUpdate = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('❌ Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    const success = await updateProfile({
      email,
      firstname,
      lastname,
      nickname,
      gender: gender || null,
      age: age ? parseInt(age, 10) : null,
      newPassword: newPassword || undefined,
    });

    if (success) {
      Alert.alert('✅ Succès', 'Profil mis à jour');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      Alert.alert('❌ Erreur', error || 'Une erreur est survenue');
    }
  };

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

      <Text style={styles.label}>Prénom</Text>
      <TextInput value={firstname} onChangeText={setFirstname} style={styles.input} />

      <Text style={styles.label}>Nom</Text>
      <TextInput value={lastname} onChangeText={setLastname} style={styles.input} />

      <Text style={styles.label}>Pseudo</Text>
      <TextInput value={nickname} onChangeText={setNickname} style={styles.input} />

      <Text style={styles.label}>Genre</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Sélectionner..." value="" />
          <Picker.Item label="Homme" value="male" />
          <Picker.Item label="Femme" value="female" />
          <Picker.Item label="Autre" value="other" />
        </Picker>
      </View>


      <Text style={styles.label}>Âge</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
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

      <Text style={[styles.title, { marginTop: 32 }]}>🏁 Aventures terminées</Text>
      <AdventureHistoryList histories={userHistories} />
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
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  overflow: 'hidden',
},

});

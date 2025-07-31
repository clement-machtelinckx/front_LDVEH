import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useProfile } from '@/store/useProfile';
// import { useAdventurerStore } from '@/store/useAdventurerStore';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/common/PrimaryButton';
import AdventureHistoryList from '@/components/metier/AdventureHistoryList';
import { globalStyles } from '@/styles/global';

export default function ProfileScreen() {
  const { profile, fetchProfile, updateProfile, loading, error } = useProfile();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
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
      setDateOfBirth(profile.dateOfBirth || null);
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
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
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
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={globalStyles.title}>Mon Profil</Text>
    <View style={styles.formContainer}>
      <Text style={globalStyles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={globalStyles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={globalStyles.label}>Prénom</Text>
      <TextInput value={firstname} onChangeText={setFirstname} style={globalStyles.input} />

      <Text style={globalStyles.label}>Nom</Text>
      <TextInput value={lastname} onChangeText={setLastname} style={globalStyles.input} />

      <Text style={globalStyles.label}>Pseudo</Text>
      <TextInput value={nickname} onChangeText={setNickname} style={globalStyles.input} />

      <Text style={globalStyles.label}>Genre</Text>
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


      <Text style={globalStyles.label}>Date de naissance</Text>
      <TextInput
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={globalStyles.input}
        placeholder="YYYY-MM-DD"
        keyboardType="numeric"
      />

      <Text style={globalStyles.label}>Nouveau mot de passe</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        style={globalStyles.input}
        secureTextEntry
        placeholder="Laisse vide si inchangé"
      />

      <Text style={globalStyles.label}>Confirmer le mot de passe</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={globalStyles.input}
        secureTextEntry
        placeholder="Re-saisir le mot de passe"
      />

      <PrimaryButton title="Mettre à jour" onPress={handleUpdate} />
    </View>
      <Text style={[globalStyles.title, { marginTop: 32 }]}>🏁 Aventures terminées</Text>
      <AdventureHistoryList histories={userHistories} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
},
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
},
scrollContent: {
  flexGrow: 1,
  padding: 24,
  backgroundColor: '#eee',
  gap: 24,
},

});

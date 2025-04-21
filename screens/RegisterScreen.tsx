// screens/RegisterScreen.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveToken } from '@/services/auth';
import { useAuth } from '@/store/useAuth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setToken } = useAuth();

  const handleRegister = async () => {
    try {
      const res = await fetch('https://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+jsojson' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        Alert.alert('Erreur', 'Impossible de créer le compte.');
        return;
      }

      const data = await res.json();
      //doublon ici a check
      saveToken(data.token);
      setToken(data.token);
      router.replace('/login'); // ou '/login' si tu préfères une étape en plus
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Créer un compte" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
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

// app/login.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../store/useAuth';
import { saveToken } from '@/services/auth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('https://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', // force
          },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        Alert.alert('Erreur', 'Identifiants invalides');
        return;
      }

      const data = await res.json();
      setToken(data.token); // ← stocke le JWT dans Zustand
      saveToken(data.token);
      router.replace('/book'); // redirige vers la suite
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

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

      <Button title="Se connecter" onPress={handleLogin} />
        <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={{ color: '#007AFF', textAlign: 'center', marginTop: 12 }}>
                Pas encore de compte ? Inscris-toi
            </Text>
        </TouchableOpacity>
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

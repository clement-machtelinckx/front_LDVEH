import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      router.replace('/book'); // ✅ à jour avec la bonne route
    } else {
      Alert.alert('Erreur', error || 'Échec de la connexion');
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

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Se connecter" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>
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
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 12,
  },
});

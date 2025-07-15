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
import NavLink from '@/components/common/NavLink';
import PrimaryButton from '@/components/common/PrimaryButton';
import { useErrorStore } from '@/store/useErrorStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error: authError } = useAuth();
  const isLoading = useAuth((s) => s.isLoading);
  const { setError, clearError } = useErrorStore();
  const router = useRouter();

  const handleLogin = async () => {
    clearError();
    const success = await login(email, password);
    if (success) {
      router.replace('/book'); 
    } else {
      setError(authError || 'Échec de la connexion');
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
        <PrimaryButton title="Se connecter" onPress={handleLogin} />
      )}
    <NavLink title="Pas encore de compte ? Inscris-toi" href="/register" />
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

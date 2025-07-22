import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';
import NavLink from '@/components/common/NavLink';
import PrimaryButton from '@/components/common/PrimaryButton';
import { useErrorStore } from '@/store/useErrorStore';
import { globalStyles } from '@/styles/global';

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
    <View style={styles.centeredContainer}>
      <Text style={globalStyles.titleCenter}>Connexion</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={globalStyles.input}
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
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#eee', // même fond que pageContainer
  },
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
    width: '100%',
    maxWidth: 400,
  },
});

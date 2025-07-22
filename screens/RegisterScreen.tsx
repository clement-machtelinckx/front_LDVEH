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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { register, error: authError } = useAuth();
  const isLoading = useAuth((s) => s.isLoading);
  const { setError, clearError } = useErrorStore();

  const handleRegister = async () => {
    clearError();
    const success = await register(email, password);
    if (success) {
      router.replace('/login');
    } else {
      setError(authError || "Échec de l'inscription");
    }
  };

  return (
    <View style={styles.centeredContainer}>
      <Text style={globalStyles.titleCenter}>Créer un compte</Text>

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
          <PrimaryButton title="Créer un compte" onPress={handleRegister} />
        )}
        <NavLink title="Déjà un compte ? Connecte-toi" href="/login" />
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
    backgroundColor: '#eee',
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

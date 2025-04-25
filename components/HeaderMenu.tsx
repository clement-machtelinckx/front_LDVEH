// components/HeaderMenu.tsx
import { View, Button, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/store/useAuth';

export default function HeaderMenu() {
  const router = useRouter();
  const { logout } = useAuth();
  const segments = useSegments();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Button title="🏠 Accueil" onPress={() => router.push('/')} />
      <Button title="📚 Livres" onPress={() => router.push('/book')} />
      <Button title="🧙 Aventuriers" onPress={() => router.push('/adventurers')} />
      <Button title="🚪 Déconnexion" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

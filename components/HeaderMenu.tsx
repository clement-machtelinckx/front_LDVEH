// components/HeaderMenu.tsx
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';

export default function HeaderMenu() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo_serpent.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <MenuButton label="🏠 Accueil" onPress={() => router.push('/')} />
      <MenuButton label="📚 Livres" onPress={() => router.push('/book')} />
      <MenuButton label="🧙 Aventuriers" onPress={() => router.push('/adventurers')} />
      <MenuButton label="🚪 Déconnexion" onPress={handleLogout} danger />
    </View>
  );
}

function MenuButton({ label, onPress, danger = false }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        danger && styles.danger,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  danger: {
    borderColor: '#ff4d4d',
    backgroundColor: '#fff5f5',
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
});

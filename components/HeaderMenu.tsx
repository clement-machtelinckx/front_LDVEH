// components/BottomNavBar.tsx
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';

export default function BottomNavBar() {
  const router = useRouter();
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const isCompact = width < 500;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <NavButton icon="🏠" label="Accueil" onPress={() => router.push('/')} compact={isCompact} />
      <NavButton icon="📚" label="Livres" onPress={() => router.push('/book')} compact={isCompact} />
      <NavButton icon="🧙" label="Aventuriers" onPress={() => router.push('/adventurers')} compact={isCompact} />
      <NavButton icon="🚪" label="Logout" onPress={handleLogout} danger compact={isCompact} />
    </View>
  );
}

function NavButton({
  icon,
  label,
  onPress,
  danger = false,
  compact = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        danger && styles.danger,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.label}>
        {icon}
        {!compact && ` ${label}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  button: {
    padding: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  danger: {
    color: '#ff4d4d',
  },
  pressed: {
    opacity: 0.6,
  },
});

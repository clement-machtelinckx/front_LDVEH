// components/BottomNavBar.tsx
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';
import NavButton from '@/components/common/NavButton';

export default function BottomNavBar() {
  const router = useRouter();
  const { logout, token } = useAuth();
  const { width } = useWindowDimensions();
  const isCompact = width < 500;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const buttons = [
    { icon: '🏠', label: 'Accueil', onPress: () => router.push('/') },
    token && { icon: '📚', label: 'Livres', onPress: () => router.push('/book') },
    token && { icon: '🧙', label: 'Aventuriers', onPress: () => router.push('/adventurers') },
    token && { icon: '🚪', label: 'Logout', onPress: handleLogout, danger: true },
  ].filter(Boolean);


  return (
    <View style={styles.container}>
      {buttons.map((btn, i) => (
        <NavButton key={i} {...btn} compact={isCompact} />
      ))}
    </View>
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
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
});

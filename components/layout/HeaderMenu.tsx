// components/BottomNavBar.tsx
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/useAuth';
import NavButton from '@/components/common/NavButton';
import BurgerMenu from '@/components/layout/BurgerMenu';

export default function BottomNavBar() {
  const router = useRouter();
  const { logout, token } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isCompact = width < 500;

  const [barHeight, setBarHeight] = useState(56);
  const onLayout = (e: LayoutChangeEvent) => setBarHeight(e.nativeEvent.layout.height);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const buttons = useMemo(
    () =>
      [
        { iconName: 'home-outline', label: 'Accueil', onPress: () => router.push('/') },
        !token && { iconName: 'login', label: 'Connexion', onPress: () => router.push('/login') },
        !token && { iconName: 'account-plus-outline', label: 'Inscription', onPress: () => router.push('/register') },
        token && { iconName: 'book-open-variant', label: 'Livres', onPress: () => router.push('/book') },
        token && { iconName: 'sword-cross', label: 'Aventuriers', onPress: () => router.push('/adventurers') },
      ].filter(Boolean) as Array<any>,
    [token]
  );

  // éléments “moins prioritaires” dans le burger
  const menuItems = useMemo(
    () =>
      [
        { label: 'Hall of Fame', icon: 'trophy-outline', onPress: () => router.push('/ranking') },
        { label: 'Profile', icon: 'account-circle-outline', onPress: () => router.push('/profile') },
        { label: 'About', icon: 'information-outline', onPress: () => router.push('/about') },
        { label: 'Feedback', icon: 'message-draw', onPress: () => router.push('/feedback') },
        { label: 'Buy me a coffee', icon: 'coffee-outline', href: 'https://buymeacoffee.com/yazii' },
        { label: 'Mentions légales', icon: 'scale-balance', onPress: () => router.push('/legal') },
        token
          ? { label: 'Déconnexion', icon: 'logout', destructive: true, onPress: handleLogout }
          : { label: 'Connexion', icon: 'login', onPress: () => router.push('/login') },
      ].filter(Boolean) as Array<any>,
    [token]
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]} onLayout={onLayout}>
      {buttons.map((btn, i) => (
        <NavButton key={i} {...btn} compact={isCompact} />
      ))}

      {/* Bouton burger à droite dans la barre */}
      <BurgerMenu
        items={menuItems}
        placement="bottom-right"
        bottomOffset={barHeight + insets.bottom + 8} // pop au-dessus de la barre
        rightOffset={8}
      />
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

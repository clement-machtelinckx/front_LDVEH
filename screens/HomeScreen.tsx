import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/common/PrimaryButton';
import { useAuth } from '@/store/useAuth';


const HomeScreen = () => {
  const router = useRouter();
  const { token } = useAuth(); // 🔍 check l'état du user
  const isLoggedIn = !!token;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-transparent-png.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      {!isLoggedIn && (
        <>
          <PrimaryButton title="Connexion" onPress={() => router.push('/login')} />
          <PrimaryButton title="Inscription" onPress={() => router.push('/register')} />
        </>
      )}
      {isLoggedIn && (
        <PrimaryButton title="Commencer l'aventure" onPress={() => router.push('/book')} />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#eee',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },
});

export default HomeScreen;

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/common/PrimaryButton';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-transparent-png.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <PrimaryButton title="Connexion" onPress={() => router.push('/login')} />
      <PrimaryButton title="Inscription" onPress={() => router.push('/register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },
});

export default HomeScreen;

// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Bienvenue dans le Livre Dont Vous Êtes Le Héros 📖</Text>
      <Text>Commencez votre aventure en vous connectant !</Text>

      <Button title="Connexion" onPress={() => router.push('/login')} />
      <Button title="Inscription" onPress={() => router.push('/register')} />
    </View>
  );
};

export default HomeScreen;

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans le Livre Dont Vous Êtes Le Héros 📖</Text>
      <Text style={styles.subtitle}>Commencez votre aventure en vous connectant !</Text>

      <View style={styles.buttonContainer}>
        <Button title="Connexion" onPress={() => navigation.navigate('Login')} />
        <Button title="Inscription" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
});

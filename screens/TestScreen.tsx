// app/test-bg.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import BookCard from '@/components/common/BookCard';

export default function TestBgScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* BG image */}
      <Image
        source={require('../assets/images/knight_full.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        pointerEvents="none"
      />

      {/* Overlay (baisse l’opacité du BG) */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.0)' }]} />

      {/* Contenu au dessus */}
      <SafeAreaView style={styles.content}>
        <Text style={styles.title}>Titre lisible ✨</Text>
        <Text style={styles.text}>Ton contenu passe nickel par-dessus l’image.</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  text: { fontSize: 16, color: '#fff' },
});

import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

const ABOUT_URL = 'https://ldveh1.osc-fr1.scalingo.io/about';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const openAbout = async () => {
    try {
      const supported = await Linking.canOpenURL(ABOUT_URL);
      if (supported) return Linking.openURL(ABOUT_URL);
      Alert.alert("Impossible d'ouvrir l'URL", ABOUT_URL);
    } catch {
      Alert.alert('Erreur', "Une erreur est survenue lors de l'ouverture du lien.");
    }
  };

  const version = Constants.expoConfig?.version ?? 'dev';

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top + 16 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <Text style={styles.title}>À propos</Text>
      <Text style={styles.subtitle}>Livre Dont Vous Êtes le Héros (LDVEH)</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>L’application</Text>
        <Text style={styles.p}>
          Une expérience mobile pour vivre les aventures du Loup Solitaire : lecture, combats,
          feuille d’aventure et règles fidèles à l’œuvre originale.
        </Text>

        <Text style={styles.sectionTitle}>Le dev</Text>
        <Text style={styles.p}>
          Hey, moi c’est Yazii 👋 — projet passion LDVEH. Une idée, un bug, une envie de contribuer ?
          Passe par Feedback ou contacte-moi !
        </Text>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="information-outline" size={18} color="#374151" />
          <Text style={styles.meta}>Version : {version}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={openAbout}>
          <MaterialCommunityIcons name="open-in-new" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Ouvrir la page complète</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 6, color: '#475569' },
  card: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 8, marginBottom: 6 },
  p: { color: '#374151', lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  meta: { color: '#374151' },
  btn: {
    marginTop: 14,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
});

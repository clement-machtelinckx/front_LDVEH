// app/feedback.tsx
import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFeedback } from '@/store/useFeedbackStore';
import { useAuth } from '@/store/useAuth';

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token } = useAuth();
  const { message, loading, success, error, setMessage, reset, submit } = useFeedback();

  useEffect(() => {
    if (success) {
      Alert.alert('Merci 🙏', 'Ton feedback a bien été envoyé.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
      // Optionnel: reset state après succès
      reset();
    }
  }, [success]);

  if (!token) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.title}>Feedback</Text>
        <Text style={{ marginTop: 8, color: '#374151' }}>
          Tu dois être connecté pour envoyer un feedback.
        </Text>
        <TouchableOpacity style={[styles.btn, { marginTop: 16 }]} onPress={() => router.push('/login')}>
          <MaterialCommunityIcons name="login" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Aller à la connexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <View style={[styles.screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.title}>Feedback</Text>
        <Text style={styles.subtitle}>
          Une idée, un bug, une suggestion ? Dis-m’en plus ci-dessous 👇
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Écris ton message…"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={styles.input}
            maxLength={2000}
          />
          <Text style={styles.counter}>{message.length} / 2000</Text>

          {error ? <Text style={styles.error}>⚠️ {error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, { opacity: loading || message.trim().length === 0 ? 0.6 : 1 }]}
            onPress={() => submit()}
            disabled={loading || message.trim().length === 0}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="send" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.btnText}>Envoyer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    color: '#475569',
  },
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
  label: { fontSize: 14, color: '#334155', marginBottom: 6 },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  counter: { marginTop: 6, color: '#64748b', fontSize: 12, textAlign: 'right' },
  error: { marginTop: 8, color: '#b42318' },
  btn: {
    marginTop: 12,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
});

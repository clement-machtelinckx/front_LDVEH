import { DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useAuth } from '@/store/useAuth';
import HeaderMenu from '@/components/layout/HeaderMenu';
import { useErrorStore } from '@/store/useErrorStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import ErrorMessage from '@/components/common/ErrorMessage';
import { View, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initAuth = useAuth((state) => state.init);
  const authReady = useAuth((state) => state.authReady);
  const { error } = useErrorStore();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (loaded && authReady) SplashScreen.hideAsync();
  }, [loaded, authReady]);

  if (!loaded || !authReady) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={styles.wrapper}>
        {error && <ErrorMessage message={error} />}

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>

        <HeaderMenu />
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 60,
  },
});

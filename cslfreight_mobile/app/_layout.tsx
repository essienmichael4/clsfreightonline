import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from 'app/_context/authContext';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor={colors.dark} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.dark,
            },
          }}
        >
          <Stack.Screen 
            name="onboarding" 
            options={{ 
              contentStyle: {
                backgroundColor: colors.dark,
              },
            }} 
          />
          <Stack.Screen 
            name="app" 
            options={{ 
              contentStyle: {
                backgroundColor: colors.dark,
              },
            }} 
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

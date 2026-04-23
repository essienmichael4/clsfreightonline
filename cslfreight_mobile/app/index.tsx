import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Use setTimeout to ensure navigation happens after mount
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/welcome');
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  return <View />;
}

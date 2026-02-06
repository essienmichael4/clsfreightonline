import { Redirect } from "expo-router";
import useAuth from "app/_hooks/useAuth";

export default function Index() {
  const { auth, loading } = useAuth();

  if (loading) return null; // or a splash screen

  if (auth) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(onboarding)/intro" />;
}

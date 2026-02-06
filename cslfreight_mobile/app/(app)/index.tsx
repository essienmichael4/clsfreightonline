import { Tabs } from 'expo-router';
import CustomTabBar from './CustomTabBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'app/_context/authContext';
import RequireAuth from 'app/_component/RequireAuth';

const queryClient = new QueryClient();

/**
 * Root Tabs Layout
 * Renders the main dashboard and more tabs with custom tab bar
 * This provides the bottom navigation interface
 */
export default function TabsIndex() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RequireAuth>
                    <Tabs
                        tabBar={(props) => <CustomTabBar {...props} />}
                        screenOptions={{
                            headerShown: false,
                            animationEnabled: true,
                        }}
                    >
                        <Tabs.Screen
                            name="dashboard"
                            options={{
                                title: 'Dashboard',
                            }}
                        />
                        <Tabs.Screen
                            name="more"
                            options={{
                                title: 'More',
                            }}
                        />
                    </Tabs>
                </RequireAuth>
            </AuthProvider>
        </QueryClientProvider>
    );
}

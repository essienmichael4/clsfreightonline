import { Tabs } from 'expo-router';
import CustomTabBar from './CustomTabBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    AuthProvider

} from 'app/_context/authContext';
import RequireAuth from 'app/_component/RequireAuth';

const queryClient = new QueryClient();

export default function AppLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RequireAuth>
                    <Tabs
                        tabBar={(props) => <CustomTabBar {...props} />}
                        screenOptions={{
                            headerShown: false,
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
                        {/* Hidden from tab bar but accessible via navigation */}
                        <Tabs.Screen
                            name="packages"
                            options={{
                                href: null,
                            }}
                        />
                        <Tabs.Screen
                            name="schedule"
                            options={{
                                href: null,
                            }}
                        />
                        <Tabs.Screen
                            name="policies"
                            options={{
                                href: null,
                            }}
                        />
                        <Tabs.Screen
                            name="shipping-address"
                            options={{
                                href: null,
                            }}
                        />
                        <Tabs.Screen
                            name="payments"
                            options={{
                                href: null,
                            }}
                        />
                        <Tabs.Screen
                            name="videos"
                            options={{
                                href: null,
                            }}
                        />
                        <Tabs.Screen
                            name="deliveries"
                            options={{
                                href: null,
                            }}
                        />
                        <Tabs.Screen
                            name="password"
                            options={{
                                href: null,
                            }}
                        />
                    </Tabs>
                </RequireAuth>
            </AuthProvider>
        </QueryClientProvider>
    );
}

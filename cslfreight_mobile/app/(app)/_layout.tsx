import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/theme';
import CustomTabBar from './CustomTabBar';

export default function AppLayout() {
    return (
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
                name="buy-rmb"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}

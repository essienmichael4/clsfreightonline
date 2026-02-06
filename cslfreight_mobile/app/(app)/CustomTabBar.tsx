import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/theme';

// ... imports

export default function CustomTabBar(_props: BottomTabBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [menuVisible, setMenuVisible] = useState(false);

    const menuItems = [
        { icon: 'inventory-2', title: 'Packages', route: '/(app)/packages' },
        { icon: 'description', title: 'Our Policies', route: '/(app)/policies' },
        { icon: 'location-on', title: 'Shipping Addresses', route: '/(app)/shipping-address' },
        { icon: 'payment', title: 'Payments', route: '/(app)/payments' },
        { icon: 'event', title: 'Schedule', route: '/(app)/schedule' },
        { icon: 'play-circle-outline', title: 'Videos', route: '/(app)/videos' },
        { icon: 'local-shipping', title: 'Deliveries', route: '/(app)/deliveries' },
        { icon: 'calculate', title: 'Shipping Calculator', route: '/(app)/shipping-calculator' },
        { icon: 'attach-file', title: 'My Attachments', route: '/(app)/attachments' },
    ];

    const handleNavigate = (route: string) => {
        setMenuVisible(false);
        router.push(route as any);
    };

    return (
        <>
            <View style={styles.tabBar}>
                <View style={styles.tabBarContent}>
                    {/* Home Tab */}
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => router.push('/(app)/dashboard')}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name="home"
                                size={26}
                                color={pathname === '/(app)/dashboard' ? colors.primary : colors.textSecondary}
                            />
                        </View>
                        <Text style={[styles.tabLabel, pathname === '/(app)/dashboard' && styles.tabLabelActive]}>
                            Home
                        </Text>
                    </TouchableOpacity>

                    {/* Center Floating Button */}
                    <TouchableOpacity
                        style={styles.centerButton}
                        onPress={() => setMenuVisible(true)}
                    >
                        <MaterialIcons name="menu" size={28} color={colors.white} />
                    </TouchableOpacity>

                    {/* Profile Tab */}
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => router.push('/(app)/more')}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name="person"
                                size={26}
                                color={pathname === '/(app)/more' ? colors.primary : colors.textSecondary}
                            />
                        </View>
                        <Text style={[styles.tabLabel, pathname === '/(app)/more' && styles.tabLabelActive]}>
                            Profile
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Active Indicator */}
                <View style={styles.activeIndicator} />
            </View>

            {/* Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>All Pages</Text>
                            <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                <MaterialIcons name="close" size={28} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.menuList}>
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.menuItem}
                                    onPress={() => handleNavigate(item.route)}
                                >
                                    <View style={styles.menuIconContainer}>
                                        <MaterialIcons name={item.icon as any} size={24} color={colors.primary} />
                                    </View>
                                    <Text style={styles.menuItemText}>{item.title}</Text>
                                    <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        elevation: 10,
        paddingBottom: 40,
    },
    tabBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: spacing.lg,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    iconContainer: {
        marginBottom: 4,
    },
    tabLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    centerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -28,
        boxShadow: `0 4px 8px ${colors.primary}4D`,
        elevation: 8,
    },
    centerButtonIcon: {
        fontSize: 32,
        color: colors.white,
        fontWeight: '300',
    },
    activeIndicator: {
        width: 60,
        height: 4,
        backgroundColor: colors.textPrimary,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        width: '85%',
        maxHeight: '70%',
        overflow: 'hidden',
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    menuList: {
        padding: spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xs,
        backgroundColor: colors.darkGray,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    menuItemText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors, spacing, borderRadius } from '@/theme';

export default function CustomTabBar() {
    const router = useRouter();
    const pathname = usePathname();
    const [menuVisible, setMenuVisible] = useState(false);

    const menuItems = [
        { icon: '📦', title: 'Packages', route: '/(app)/packages' },
        { icon: '📄', title: 'Our Policies', route: '/(app)/policies' },
        { icon: '📍', title: 'Shipping Addresses', route: '/(app)/shipping-address' },
        { icon: '💳', title: 'Payments', route: '/(app)/payments' },
        { icon: '📅', title: 'Schedule', route: '/(app)/schedule' },
        { icon: '🎥', title: 'Videos', route: '/(app)/videos' },
        { icon: '💱', title: 'Buy RMB', route: '/(app)/buy-rmb' },
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
                            <Text style={styles.tabIcon}>🏠</Text>
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
                        <Text style={styles.centerButtonIcon}>+</Text>
                    </TouchableOpacity>

                    {/* Profile Tab */}
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => router.push('/(app)/more')}
                    >
                        <View style={styles.iconContainer}>
                            <Text style={styles.tabIcon}>👤</Text>
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
                                <Text style={styles.closeButton}>✕</Text>
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
                                        <Text style={styles.menuIcon}>{item.icon}</Text>
                                    </View>
                                    <Text style={styles.menuItemText}>{item.title}</Text>
                                    <Text style={styles.menuArrow}>›</Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        paddingBottom: 8,
    },
    tabBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 12,
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
    tabIcon: {
        fontSize: 24,
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
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
    closeButton: {
        fontSize: 24,
        color: colors.textSecondary,
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
    menuIcon: {
        fontSize: 20,
    },
    menuItemText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    menuArrow: {
        fontSize: 24,
        color: colors.textSecondary,
    },
});

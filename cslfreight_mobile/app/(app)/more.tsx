import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function MoreScreen() {
    const router = useRouter();

    const menuItems = [
        { icon: '📄', title: 'Our Policies', description: 'Terms and company policies', route: '/(app)/policies' },
        { icon: '📍', title: 'Shipping Addresses', description: 'Manage your addresses', route: '/(app)/shipping-address' },
        { icon: '💳', title: 'Payments', description: 'Payment methods & history', route: '/(app)/payments' },
        { icon: '🎥', title: 'Videos', description: 'Tutorials and guides', route: '/(app)/videos' },
        { icon: '💱', title: 'Buy RMB', description: 'Currency exchange', route: '/(app)/buy-rmb' },
        { icon: '⚙️', title: 'Settings', description: 'App settings', route: '/(app)/settings' },
        { icon: '❓', title: 'Help & Support', description: 'Get help', route: '/(app)/support' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.white, colors.darkGray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>More</Text>
                    </View>

                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>User Name</Text>
                            <Text style={styles.profileEmail}>user@example.com</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuSection}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={styles.menuIconContainer}>
                                    <Text style={styles.menuIcon}>{item.icon}</Text>
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Text style={styles.menuDescription}>{item.description}</Text>
                                </View>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity style={styles.logoutButton}>
                        <Text style={styles.logoutText}>🚪 Logout</Text>
                    </TouchableOpacity>

                    {/* App Version */}
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginHorizontal: spacing.lg,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.full,
        backgroundColor: colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: 32,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    editButton: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    menuSection: {
        paddingHorizontal: spacing.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    menuIcon: {
        fontSize: 24,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    menuDescription: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    menuArrow: {
        fontSize: 24,
        color: colors.textSecondary,
    },
    logoutButton: {
        backgroundColor: colors.error + '15',
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.error,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.error,
    },
    versionText: {
        textAlign: 'center',
        marginTop: spacing.lg,
        fontSize: 12,
        color: colors.textSecondary,
    },
});

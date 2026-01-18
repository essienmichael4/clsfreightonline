import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function PackagesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');

    const packages = [
        { id: '1', trackingNumber: 'CSL001234', status: 'In Transit', origin: 'China', destination: 'Ghana', date: '2024-01-10' },
        { id: '2', trackingNumber: 'CSL005678', status: 'Delivered', origin: 'China', destination: 'Ghana', date: '2024-01-09' },
        { id: '3', trackingNumber: 'CSL009012', status: 'Pending', origin: 'China', destination: 'Ghana', date: '2024-01-08' },
        { id: '4', trackingNumber: 'CSL003456', status: 'In Transit', origin: 'China', destination: 'Ghana', date: '2024-01-07' },
    ];

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'delivered', label: 'Delivered' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.white, colors.darkGray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>My Packages</Text>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by tracking number..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[
                                    styles.tab,
                                    selectedTab === tab.key && styles.tabActive,
                                ]}
                                onPress={() => setSelectedTab(tab.key)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        selectedTab === tab.key && styles.tabTextActive,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Packages List */}
                    <ScrollView
                        style={styles.packagesList}
                        showsVerticalScrollIndicator={false}
                    >
                        {packages.map((pkg) => (
                            <TouchableOpacity key={pkg.id} style={styles.packageCard}>
                                <View style={styles.packageHeader}>
                                    <View style={styles.packageIcon}>
                                        <Text style={styles.packageIconText}>📦</Text>
                                    </View>
                                    <View style={styles.packageInfo}>
                                        <Text style={styles.trackingNumber}>{pkg.trackingNumber}</Text>
                                        <Text style={styles.route}>{pkg.origin} → {pkg.destination}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, getStatusStyle(pkg.status)]}>
                                        <Text style={styles.statusText}>{pkg.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.packageFooter}>
                                    <Text style={styles.dateText}>📅 {pkg.date}</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.detailsLink}>View Details →</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Add Package Button */}
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Track New Package</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'Delivered':
            return { backgroundColor: colors.success };
        case 'In Transit':
            return { backgroundColor: colors.warning };
        case 'Pending':
            return { backgroundColor: colors.textSecondary };
        default:
            return { backgroundColor: colors.textSecondary };
    }
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
        flex: 1,
        paddingTop: spacing.lg,
    },
    header: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkGray,
        marginHorizontal: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: colors.darkGray,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.white,
    },
    packagesList: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    packageCard: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    packageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    packageIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    packageIconText: {
        fontSize: 24,
    },
    packageInfo: {
        flex: 1,
    },
    trackingNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    route: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.white,
    },
    packageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    dateText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    detailsLink: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: colors.primary,
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

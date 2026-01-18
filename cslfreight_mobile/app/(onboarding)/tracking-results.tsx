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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function TrackingResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get tracking numbers from params (comma-separated string)
    const trackingNumbersParam = params.numbers as string || '';
    const trackingNumbers = trackingNumbersParam.split(',').filter(n => n.trim());

    // TODO: Fetch actual package data from API
    const packages: any[] = []; // Empty for now - will show "no packages found"

    const renderNoPackagesFound = () => (
        <View style={styles.noPackagesContainer}>
            <Text style={styles.noPackagesIcon}>📦</Text>
            <Text style={styles.noPackagesTitle}>No Packages Found</Text>
            <Text style={styles.noPackagesMessage}>
                No Packages found for the given tracking number(s).{'\n\n'}
                Check the tracking number(s) for mistakes or contact your service provider for more details as it might not exist currently on the system.
            </Text>

            <View style={styles.trackingNumbersList}>
                <Text style={styles.trackingNumbersLabel}>Tracking Numbers Searched:</Text>
                {trackingNumbers.map((num, index) => (
                    <Text key={index} style={styles.trackingNumberItem}>• {num}</Text>
                ))}
            </View>
        </View>
    );

    const renderPackageDetails = (pkg: any, index: number) => (
        <View key={index} style={styles.packageCard}>
            <View style={styles.packageHeader}>
                <Text style={styles.packageTrackingNumber}>{pkg.trackingNumber}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pkg.status) }]}>
                    <Text style={styles.statusText}>{pkg.status}</Text>
                </View>
            </View>

            <View style={styles.packageDetail}>
                <Text style={styles.detailLabel}>From:</Text>
                <Text style={styles.detailValue}>{pkg.origin}</Text>
            </View>

            <View style={styles.packageDetail}>
                <Text style={styles.detailLabel}>To:</Text>
                <Text style={styles.detailValue}>{pkg.destination}</Text>
            </View>

            <View style={styles.packageDetail}>
                <Text style={styles.detailLabel}>Estimated Delivery:</Text>
                <Text style={styles.detailValue}>{pkg.estimatedDelivery}</Text>
            </View>

            <View style={styles.packageDetail}>
                <Text style={styles.detailLabel}>Current Location:</Text>
                <Text style={styles.detailValue}>{pkg.currentLocation}</Text>
            </View>
        </View>
    );

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return colors.primary;
            case 'in transit': return '#FFA500';
            case 'pending': return '#808080';
            default: return colors.textSecondary;
        }
    };

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
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.greeting}>Hello,</Text>
                        <Text style={styles.title}>
                            Find provisional details of your packages below
                        </Text>
                    </View>

                    {/* Results */}
                    {packages.length === 0 ? (
                        renderNoPackagesFound()
                    ) : (
                        <View style={styles.packagesContainer}>
                            {packages.map((pkg, index) => renderPackageDetails(pkg, index))}
                        </View>
                    )}

                    {/* Try Again Button */}
                    <TouchableOpacity
                        style={styles.tryAgainButton}
                        activeOpacity={0.8}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.tryAgainButtonText}>Track Another Package</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxl,
    },
    backButton: {
        marginBottom: spacing.lg,
    },
    backButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        marginBottom: spacing.xl,
    },
    greeting: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: typography.body.fontSize,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    noPackagesContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.md,
    },
    noPackagesIcon: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    noPackagesTitle: {
        fontSize: typography.h2.fontSize,
        fontWeight: typography.h2.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    noPackagesMessage: {
        fontSize: typography.body.fontSize,
        color: colors.textSecondary,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    trackingNumbersList: {
        width: '100%',
        backgroundColor: colors.darkGray,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    trackingNumbersLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    trackingNumberItem: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    packagesContainer: {
        gap: spacing.md,
    },
    packageCard: {
        backgroundColor: colors.darkGray,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    packageTrackingNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.white,
    },
    packageDetail: {
        marginBottom: spacing.sm,
    },
    detailLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    tryAgainButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    tryAgainButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

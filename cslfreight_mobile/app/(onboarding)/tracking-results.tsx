import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { axios_instance } from 'app/_API/axios';
import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';
import { Package } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackingResultsScreen() {

    const router = useRouter();
    useAndroidBackButton();
    const params = useLocalSearchParams();

    // Get tracking numbers from params (comma-separated string)
    const trackingNumbersParam = params.numbers as string || '';
    const trackingNumbers = trackingNumbersParam.split(',').filter(n => n.trim());

    const { data: packages, isLoading, isError, refetch } = useQuery<Package[] | []>({
        queryKey: ["packages", trackingNumbersParam],
        queryFn: async () => {
            try {
                const res = await axios_instance.get(`/packages/search?filter=${trackingNumbersParam}`);
                console.log('API Response:', res.data);

                // Ensure we always return an array
                if (Array.isArray(res.data)) {
                    return res.data;
                } else if (res.data?.packages && Array.isArray(res.data.packages)) {
                    return res.data.packages;
                } else {
                    return [];
                }
            } catch (err: any) {
                console.error('Error fetching packages:', err);
                // Return empty array instead of throwing to prevent crash
                return [];
            }
        },
        retry: false, // Don't retry on error to prevent infinite loops
        enabled: trackingNumbers.length > 0, // Only run query if we have tracking numbers
    })


    const renderLoading = () => (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Tracking your packages...</Text>
        </View>
    );

    const renderError = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>
                We couldn't fetch your package information. This could be due to a network issue or a temporary server problem.
            </Text>
            <TouchableOpacity
                style={styles.retryButton}
                activeOpacity={0.8}
                onPress={() => refetch()}
            >
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

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

    const renderPackageDetails = (pkg: any, index: number) => {
        // Safely access package properties with fallbacks
        const trackingNumber = pkg?.trackingNumber || pkg?.tracking_number || 'N/A';
        const rawStatus = pkg?.status || 'Unknown';
        const customerName = pkg?.customer || pkg?.customerName || 'N/A';
        const packageName = pkg?.package || pkg?.description || 'N/A';
        const cbm = pkg?.cbm || 'N/A';
        const quantity = pkg?.quantity || 'N/A';
        const received = pkg?.received ? new Date(pkg.received).toDateString() : 'N/A';
        const departure = pkg?.departure ? new Date(pkg.departure).toDateString() : '-';
        const notes = pkg?.notes || '-'; // Assuming notes field exists, or use default

        return (
            <View key={index} style={styles.packageCard}>
                {/* Tracking Number Section */}
                <View style={styles.trackingNumberContainer}>
                    <Text style={styles.trackingLabel}>Tracking Number:</Text>
                    <Text style={styles.trackingValue}>{trackingNumber}</Text>
                </View>

                {/* Customer & Status Row */}
                <View style={styles.customerStatusRow}>
                    <View style={styles.customerInfo}>
                        <Text style={styles.label}>Customer name</Text>
                        <Text style={styles.valueLarge}>{customerName}</Text>
                    </View>
                    <View style={styles.statusInfo}>
                        <Text style={styles.label}>Status</Text>
                        <View style={[styles.statusPill, { backgroundColor: getStatusColor(rawStatus, true) }]}>
                            <Text style={styles.statusTextPill}>{rawStatus}</Text>
                        </View>
                    </View>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Package</Text>
                        <Text style={styles.value}>{packageName}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>CBM</Text>
                        <Text style={styles.value}>{cbm}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Quantity</Text>
                        <Text style={styles.value}>{quantity}</Text>
                    </View>
                    <View style={styles.gridItemWrapper}>
                        <Text style={styles.label}>Received</Text>
                        <Text style={styles.value}>{received}</Text>
                    </View>
                    <View style={styles.gridItemWrapper}>
                        <Text style={styles.label}>Departure</Text>
                        <Text style={styles.value}>{departure}</Text>
                    </View>
                </View>

                {/* Notes Section */}
                <View style={styles.notesSection}>
                    <Text style={styles.label}>Notes</Text>
                    <Text style={styles.value}>{notes}</Text>
                </View>
            </View>
        );
    };

    const getStatusColor = (status: string, isBackground: boolean = false) => {
        const normalized = status?.toLowerCase();
        if (normalized === 'delivered') return isBackground ? '#DCFCE7' : '#166534'; // Green bg / Dark Green text
        if (normalized === 'in transit') return isBackground ? '#DBEAFE' : '#1E40AF'; // Blue
        if (normalized === 'pending') return isBackground ? '#F3F4F6' : '#374151'; // Gray
        if (normalized === 'yet_to_load') return isBackground ? '#E5E7EB' : '#374151'; // Gray pill
        return isBackground ? '#F3F4F6' : '#374151';
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
                        <Text style={styles.greeting}>
                            Hello {(packages?.[0] as any)?.customer || (packages?.[0] as any)?.customerName || ''},
                        </Text>
                        <Text style={styles.title}>
                            Find provisional details of your packages below
                        </Text>
                    </View>

                    {/* Results */}
                    {isLoading ? (
                        renderLoading()
                    ) : isError ? (
                        renderError()
                    ) : packages?.length === 0 ? (
                        renderNoPackagesFound()
                    ) : (
                        <View style={styles.packagesContainer}>
                            {packages?.map((pkg, index) => renderPackageDetails(pkg, index))}
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
        backgroundColor: '#F9FAFB', // Very light gray background
    },
    gradient: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    backButton: {
        marginBottom: spacing.lg,
        alignSelf: 'flex-start',
        padding: spacing.xs,
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
        fontSize: 18,
        fontWeight: '400',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        textAlign: 'left',
    },
    title: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
        lineHeight: 24,
    },

    // New Card Styles
    packageCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: spacing.lg,
    },
    trackingNumberContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    trackingLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    trackingValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    customerStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
        gap: spacing.md,
    },
    customerInfo: {
        flex: 1,
    },
    statusInfo: {
        alignItems: 'flex-end',
    },
    label: {
        fontSize: 12,
        color: '#9CA3AF', // Lighter gray for labels
        marginBottom: 4,
        fontWeight: '500',
    },
    valueLarge: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    value: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    statusPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusTextPill: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.xl,
        rowGap: spacing.lg,
    },
    gridItem: {
        width: '33%', // 3 columns
        marginBottom: spacing.sm,
    },
    gridItemWrapper: {
        width: '50%', // 2 columns for dates
        marginBottom: spacing.sm,
    },
    notesSection: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: spacing.md,
    },

    // UI States
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl * 2,
        paddingHorizontal: spacing.md,
    },
    loadingText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: spacing.md,
        fontWeight: '500',
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.md,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    errorTitle: {
        fontSize: typography.h2.fontSize,
        fontWeight: typography.h2.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: typography.body.fontSize,
        color: colors.textSecondary,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },

    // No results (kept for fallback)
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
        backgroundColor: colors.white,
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

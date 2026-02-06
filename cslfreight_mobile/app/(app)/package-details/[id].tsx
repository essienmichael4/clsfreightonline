import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import useAxiosToken from 'app/_hooks/useAxiosToken';
import { Package } from 'app/_lib/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function PackageDetailsScreen() {
    const router = useRouter();
    const axios_instance_token = useAxiosToken()
    const [state, setState] = useState<"USD" | "GHS">("USD")
    const { id } = useLocalSearchParams();

    const packageDetail = useQuery<Package>({
        queryKey: ["package", id],
        queryFn: async () => await axios_instance_token.get(`/packages/${id}`).then(res => {
            return res.data
        })
    })

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.white, colors.darkGray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/(app)/packages')} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Package Details</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {/* Status Card */}
                    <View style={styles.card}>
                        <View style={styles.statusHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="inventory-2" size={32} color={colors.primary} />
                            </View>
                            <View style={styles.trackingInfo}>
                                <Text style={styles.label}>Tracking Number</Text>
                                <Text style={styles.trackingNumber}>{packageDetail.data?.trackingNumber || 'CSL000000'}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(packageDetail.data?.status as string) }]}>
                                <Text style={styles.statusText}>{packageDetail.data?.status || 'Unknown'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* <View style={styles.routeContainer}>
                            <View style={styles.routeItem}>
                                <Text style={styles.routeLabel}>Origin</Text>
                                <Text style={styles.routeValue}>{packageDetail.data?.origin || 'China'}</Text>
                            </View>
                            <MaterialIcons name="arrow-forward" size={24} color={colors.textSecondary} />
                            <View style={styles.routeItem}>
                                <Text style={styles.routeLabel}>Destination</Text>
                                <Text style={styles.routeValue}>{packageDetail.data?.location || 'Ghana'}</Text>
                            </View>
                        </View> */}
                    </View>

                    {/* Other Details */}
                    <Text style={styles.sectionTitle}>Other Details</Text>
                    <View style={styles.card}>
                        <DetailRow label="Description" value={packageDetail.data?.description} />
                        <DetailRow label="Customer" value={packageDetail.data?.customer} />
                        <DetailRow label="Email" value={packageDetail.data?.email} />
                        <DetailRow label="Phone" value={packageDetail.data?.phone} />

                        <View style={styles.divider} />

                        <DetailRow label="Tracking Number" value={packageDetail.data?.trackingNumber} />
                        <DetailRow label="Status" value={packageDetail.data?.status} />
                        <DetailRow label="Package Type" value={packageDetail.data?.packageType?.description} />
                        <DetailRow label="Quantity" value={packageDetail.data?.quantity?.toString()} />
                        <DetailRow label="Weight" value={packageDetail.data?.weight} />
                        <DetailRow label="CBM" value={packageDetail.data?.cbm} />

                        {(packageDetail.data?.dollarEstimate || packageDetail.data?.cedisEstimate) && (
                            <>
                                <View style={styles.divider} />
                                <DetailRow label="Est. (USD)" value={packageDetail.data?.dollarEstimate ? `$${packageDetail.data.dollarEstimate}` : undefined} />
                                <DetailRow label="Est. (GHS)" value={packageDetail.data?.cedisEstimate ? `₵${packageDetail.data.cedisEstimate}` : undefined} />
                            </>
                        )}

                        {(packageDetail.data?.loaded || packageDetail.data?.received || packageDetail.data?.vessel || packageDetail.data?.eta || packageDetail.data?.departure) && (
                            <>
                                <View style={styles.divider} />
                                <DetailRow label="Received" value={packageDetail.data?.received?.split('T')[0]} />
                                <DetailRow label="Loaded" value={packageDetail.data?.loaded?.split('T')[0]} />
                                <DetailRow label="Vessel" value={packageDetail.data?.vessel} />
                                <DetailRow label="Departure" value={packageDetail.data?.departure?.split('T')[0]} />
                                <DetailRow label="ETA" value={packageDetail.data?.eta?.split('T')[0]} />
                            </>
                        )}

                        <View style={styles.divider} />
                        <DetailRow label="Created At" value={new Date(packageDetail.data?.createdAt || '').toDateString()} />
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Delivered': return colors.success;
        case 'In Transit': return colors.warning;
        case 'Pending': return colors.textSecondary;
        default: return colors.primary;
    }
}

const DetailRow = ({ label, value }: { label: string, value?: string | number }) => {
    if (!value) return null;
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginTop: Platform.OS === 'android' ? spacing.sm : 0,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        elevation: 2,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    trackingInfo: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    trackingNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.lg,
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    routeItem: {
        alignItems: 'center',
        flex: 1,
    },
    routeLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    routeValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: spacing.md,
        width: 20,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 1,
    },
    line: {
        width: 2,
        flex: 1,
        marginTop: -4,
        marginBottom: -4,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: 4,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    eventLocation: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    eventDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    detailLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
        textAlign: 'right',
    },
});

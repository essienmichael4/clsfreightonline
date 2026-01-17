import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import useAxiosToken from 'app/_hooks/useAxiosToken';
import { Delivery } from 'app/_lib/types';
import { useQuery } from '@tanstack/react-query';

export default function DeliveryDetailsScreen() {
    const router = useRouter();
    const axios_instance_token = useAxiosToken()
    const { id } = useLocalSearchParams();

    const deliveryDetail = useQuery<Delivery>({
        queryKey: ["delivery", id],
        queryFn: async () => await axios_instance_token.get(`/deliveries/${id}`).then(res => {
            return res.data
        })
    })
    console.log(deliveryDetail.data)
    if (deliveryDetail.isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        )
    }

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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Delivery Details</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {/* Status Card */}
                    <View style={styles.card}>
                        <View style={styles.statusHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="local-shipping" size={32} color={colors.primary} />
                            </View>
                            <View style={styles.trackingInfo}>
                                <Text style={styles.label}>Shipping Mark</Text>
                                <Text style={styles.trackingNumber}>{deliveryDetail.data?.client.shippingMark}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <DetailRow label="ID" value={deliveryDetail.data?.id?.toString()} />
                        <DetailRow label="Delivery Type" value={deliveryDetail.data?.deliveryType} />
                        <DetailRow label="Pickup By" value={deliveryDetail.data?.pickupBy} />
                    </View>

                    {/* Other Details */}
                    <Text style={styles.sectionTitle}>Contact & Location</Text>
                    <View style={styles.card}>
                        <DetailRow label="Location" value={deliveryDetail.data?.location} />
                        <DetailRow label="Phone" value={deliveryDetail.data?.phone} />
                        <DetailRow label="Loaded Date" value={deliveryDetail.data?.loaded} />

                        {(deliveryDetail.data?.thirdPartyName || deliveryDetail.data?.thirdPartyPhone) && (
                            <>
                                <View style={styles.divider} />
                                <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: spacing.md }]}>Third Party Details</Text>
                                <DetailRow label="Name" value={deliveryDetail.data?.thirdPartyName} />
                                <DetailRow label="Phone" value={deliveryDetail.data?.thirdPartyPhone} />
                            </>
                        )}
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
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
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.md,
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

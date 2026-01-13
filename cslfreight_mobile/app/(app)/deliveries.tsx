import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { useDeliveries } from 'app/_hooks/useDeliveries';
import { Delivery } from 'app/_lib/types';
import { useRouter } from 'expo-router';

export default function DeliveriesScreen() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data: deliveryData, isLoading } = useDeliveries(page, limit);
    const deliveries = (deliveryData?.data as Delivery[]) || [];
    const meta = deliveryData?.meta;
    const router = useRouter();

    const handleNextPage = () => {
        if (meta?.hasNextPage) {
            setPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (meta?.hasPreviousPage) {
            setPage(prev => prev - 1);
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
                <View style={styles.header}>
                    <Text style={styles.title}>Deliveries</Text>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.scrollContent}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.headerCell, { width: 60 }]}>ID</Text>
                                <Text style={[styles.headerCell, { width: 120 }]}>Shipping Mark</Text>
                                <Text style={[styles.headerCell, { width: 100 }]}>Delivery Type</Text>
                                <Text style={[styles.headerCell, { width: 100 }]}>Pickup By</Text>
                                <Text style={[styles.headerCell, { width: 150 }]}>Third Party</Text>
                                <Text style={[styles.headerCell, { width: 120 }]}>Phone</Text>
                                <Text style={[styles.headerCell, { width: 100 }]}>Loaded</Text>
                                <Text style={[styles.headerCell, { width: 150 }]}>Location</Text>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {deliveries.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.tableRow,
                                            index % 2 === 0 ? styles.evenRow : styles.oddRow
                                        ]}
                                        onPress={() => router.push(`/(app)/delivery-details/${item.id}`)}
                                    >
                                        <Text style={[styles.cell, { width: 60 }]}>{item.id}</Text>
                                        <Text style={[styles.cell, { width: 120 }]}>{item.client.shippingMark}</Text>
                                        <Text style={[styles.cell, { width: 100 }]}>{item.deliveryType}</Text>
                                        <Text style={[styles.cell, { width: 100 }]}>{item.pickupBy}</Text>
                                        <Text style={[styles.cell, { width: 150 }]}>{item.thirdPartyName || '-'}</Text>
                                        <Text style={[styles.cell, { width: 120 }]}>{item.thirdPartyPhone || item.phone || '-'}</Text>
                                        <Text style={[styles.cell, { width: 100 }]}>{item.loaded}</Text>
                                        <Text style={[styles.cell, { width: 150 }]}>{item.location}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </ScrollView>
                )}

                {/* Pagination Controls */}
                <View style={styles.pagination}>
                    <TouchableOpacity
                        style={[styles.pageButton, !meta?.hasPreviousPage && styles.disabledButton]}
                        onPress={handlePrevPage}
                        disabled={!meta?.hasPreviousPage}
                    >
                        <Text style={styles.pageButtonText}>Previous</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageText}>
                        Page {meta?.page || 1} of {meta?.pageCount || 1}
                    </Text>
                    <TouchableOpacity
                        style={[styles.pageButton, !meta?.hasNextPage && styles.disabledButton]}
                        onPress={handleNextPage}
                        disabled={!meta?.hasNextPage}
                    >
                        <Text style={styles.pageButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
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
    header: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    tableContainer: {
        padding: spacing.sm,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.xs,
    },
    headerCell: {
        color: colors.white,
        fontWeight: 'bold',
        paddingHorizontal: spacing.sm,
        fontSize: 14,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
    },
    evenRow: {
        backgroundColor: colors.white,
    },
    oddRow: {
        backgroundColor: '#F9FAFB',
    },
    cell: {
        color: colors.textPrimary,
        paddingHorizontal: spacing.sm,
        fontSize: 14,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    pageButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.sm,
    },
    disabledButton: {
        backgroundColor: colors.textSecondary,
        opacity: 0.5,
    },
    pageButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
    pageText: {
        color: colors.textPrimary,
        fontWeight: '500',
    },
});

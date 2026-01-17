import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '@/theme';
import { Payment } from 'app/_lib/types';
import { usePayments } from 'app/_hooks/usePayment';



import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function PaymentsScreen() {
    const [page, setPage] = React.useState(1)
    const { data: paymentData } = usePayments(page, 50)
    const payments = (paymentData?.data as Payment[]) || [];

    const handleExportCSV = async () => {
        try {
            const FS = FileSystem as any;
            const header = 'ID,Name,Paid Shipping,Payment Method,Payment Reference\n';
            const rows = payments.map(payment =>
                `${payment.id},"${payment.client?.shippingMark || '-'}",${payment.paidShippingRate},"${payment.paymentMethod}","${payment.reference}"`
            ).join('\n');

            const csvContent = header + rows;
            const fileUri = (FS.cacheDirectory || FS.documentDirectory) + 'payments.csv';

            await FS.writeAsStringAsync(fileUri, csvContent, {
                encoding: FS.EncodingType.UTF8,
            });

            if (!(await Sharing.isAvailableAsync())) {
                alert('Sharing is not available on your platform');
                return;
            }

            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Failed to export CSV');
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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Payment Info</Text>
                        <Text style={styles.subtitle}>
                            Please confirm your payments with CSL accounts officer on Call/WhatsApp via (+233) 244 939 112 only. You can also send payment slips to the front desk at CSL Freight at Tabora Junction.
                        </Text>
                    </View>

                    {/* Payment Summary Section */}
                    <View style={styles.summarySection}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.summaryTitle}>My Payment Summary</Text>
                            <TouchableOpacity style={styles.exportButton} onPress={handleExportCSV}>
                                <Text style={styles.exportIcon}>⬇</Text>
                                <Text style={styles.exportText}>Export CSV</Text>
                            </TouchableOpacity>
                        </View>

                        {payments.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No payments made yet...</Text>
                                <Text style={styles.emptyStateSubtext}>Make payments to view your summary.</Text>
                            </View>
                        ) : (
                            <View style={styles.tableContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={{ minWidth: 800 }}>
                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.tableHeaderText, { width: 50 }]}>ID</Text>
                                            <Text style={[styles.tableHeaderText, { width: 150 }]}>NAME</Text>
                                            <Text style={[styles.tableHeaderText, { width: 150, textAlign: 'right' }]}>PAID SHIPPING</Text>
                                            <Text style={[styles.tableHeaderText, { width: 150, textAlign: 'right' }]}>METHOD</Text>
                                            <Text style={[styles.tableHeaderText, { width: 200, textAlign: 'right' }]}>REFERENCE</Text>
                                        </View>
                                        {payments.map((payment) => (
                                            <View key={payment.id} style={styles.tableRow}>
                                                <Text style={[styles.tableCell, { width: 50 }]}>{payment.id}</Text>
                                                <Text style={[styles.tableCell, { width: 150 }]}>{payment.client?.shippingMark || '-'}</Text>
                                                <Text style={[styles.tableCell, { width: 150, textAlign: 'right', color: colors.primary, fontWeight: '600' }]}>
                                                    {payment.paidShippingRate}
                                                </Text>
                                                <Text style={[styles.tableCell, { width: 150, textAlign: 'right' }]}>{payment.paymentMethod}</Text>
                                                <Text style={[styles.tableCell, { width: 200, textAlign: 'right' }]}>{payment.reference}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Bank Details - GCB Bank */}
                    <View style={styles.bankCard}>
                        <Text style={styles.bankTitle}>Bank: GCB Bank</Text>
                        <View style={styles.bankDetail}>
                            <Text style={styles.bankLabel}>Branch Name: </Text>
                            <Text style={styles.bankValue}>Accra North</Text>
                        </View>
                        <View style={styles.bankDetail}>
                            <Text style={styles.bankLabel}>Account Number: </Text>
                            <Text style={styles.bankValue}>1391180001895</Text>
                        </View>
                        <View style={styles.bankDetail}>
                            <Text style={styles.bankLabel}>Account Name: </Text>
                            <Text style={styles.bankValue}>CLIXMA TRADING</Text>
                        </View>
                    </View>

                    {/* Bank Details - Ecobank Ghana */}
                    <View style={styles.bankCard}>
                        <Text style={styles.bankTitle}>Bank: Ecobank Ghana</Text>
                        <View style={styles.bankDetail}>
                            <Text style={styles.bankLabel}>Branch Name: </Text>
                            <Text style={styles.bankValue}>Ring Road</Text>
                        </View>
                        <View style={styles.bankDetail}>
                            <Text style={styles.bankLabel}>Account Number: </Text>
                            <Text style={styles.bankValue}>1441004848212</Text>
                        </View>
                        <View style={styles.bankDetail}>
                            <Text style={styles.bankLabel}>Account Name: </Text>
                            <Text style={styles.bankValue}>CLIXMA TRADING</Text>
                        </View>
                    </View>

                    {/* BLU Pay Details */}
                    <View style={styles.bluPayCard}>
                        <Text style={styles.bluPayTitle}>BLU PAY DETAILS</Text>
                        <Text style={styles.bluPaySubtitle}>FOR ALL GHANAIAN MOBILE MONEY ACCOUNTS</Text>

                        <View style={styles.bluPayDetail}>
                            <Text style={styles.bluPayLabel}>USSD Code: </Text>
                            <Text style={styles.bluPayValue}>Dail *789*3*411#</Text>
                        </View>
                        <View style={styles.bluPayDetail}>
                            <Text style={styles.bluPayLabel}>Account Name: </Text>
                            <Text style={styles.bluPayValue}>CLIXMA TRADING</Text>
                        </View>
                    </View>

                    {/* USD Physical Payments */}
                    <View style={styles.usdCard}>
                        <Text style={styles.usdTitle}>USD DOLLAR PHYSICAL PAYMENTS</Text>
                        <Text style={styles.usdSubtitle}>FOR THOSE PAYING WITH USD, PLEASE TAKE NOTE OF THE FOLLOWING.</Text>

                        <View style={styles.usdRule}>
                            <Text style={styles.usdBullet}>-</Text>
                            <Text style={styles.usdText}>We only accept USD50 or USD100 notes</Text>
                        </View>
                        <View style={styles.usdRule}>
                            <Text style={styles.usdBullet}>-</Text>
                            <Text style={styles.usdText}>We only accept from series 2013 and above</Text>
                        </View>
                        <View style={styles.usdRule}>
                            <Text style={styles.usdBullet}>-</Text>
                            <Text style={styles.usdText}>USD notes must not have oil, dust and any form of dents.</Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
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
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    header: {
        marginBottom: spacing.xl,
        backgroundColor: '#FFFFFF',
        padding: spacing.lg,
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevation: 3,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: spacing.sm,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
        fontWeight: '500',
    },
    summarySection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        elevation: 6,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 2,
        borderBottomColor: '#F3F4F6',
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.3,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        elevation: 1,
    },
    exportIcon: {
        fontSize: 16,
        marginRight: 6,
        color: '#059669',
    },
    exportText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    emptyState: {
        paddingVertical: spacing.xxl,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 6,
        fontWeight: '600',
    },
    emptyStateSubtext: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    bankCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
        elevation: 5,
    },
    bankTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: spacing.md,
        letterSpacing: -0.3,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    bankDetail: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
        backgroundColor: '#F9FAFB',
        padding: spacing.sm,
        borderRadius: 8,
    },
    bankLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    bankValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        letterSpacing: 0.3,
    },
    bluPayCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderLeftWidth: 4,
        borderLeftColor: '#8B5CF6',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
        elevation: 5,
    },
    bluPayTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: spacing.xs,
        letterSpacing: -0.3,
    },
    bluPaySubtitle: {
        fontSize: 11,
        color: '#8B5CF6',
        marginBottom: spacing.lg,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    bluPayDetail: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
        backgroundColor: '#F9FAFB',
        padding: spacing.sm,
        borderRadius: 8,
    },
    bluPayLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    bluPayValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        letterSpacing: 0.3,
    },
    usdCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
        elevation: 5,
    },
    usdTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: spacing.xs,
        letterSpacing: -0.3,
    },
    usdSubtitle: {
        fontSize: 11,
        color: '#10B981',
        marginBottom: spacing.lg,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    usdRule: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
        backgroundColor: '#F9FAFB',
        padding: spacing.sm,
        borderRadius: 8,
        alignItems: 'flex-start',
    },
    usdBullet: {
        fontSize: 16,
        color: '#10B981',
        marginRight: spacing.sm,
        fontWeight: '700',
        marginTop: 2,
    },
    usdText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        fontWeight: '500',
    },
    tableContainer: {
        marginTop: spacing.sm,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: spacing.xs,
    },
    tableHeaderText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tableCell: {
        fontSize: 14,
        color: '#374151',
    },
});

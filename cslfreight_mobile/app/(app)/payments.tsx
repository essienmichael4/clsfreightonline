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
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function PaymentsScreen() {
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
                            <TouchableOpacity style={styles.exportButton}>
                                <Text style={styles.exportIcon}>⬇</Text>
                                <Text style={styles.exportText}>Export CSV</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No payments made yet...</Text>
                            <Text style={styles.emptyStateSubtext}>Make payments to view your summary.</Text>
                        </View>
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
        backgroundColor: colors.dark,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    summarySection: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
    },
    exportIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    exportText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    emptyState: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
        backgroundColor: colors.darkGray,
        borderRadius: borderRadius.sm,
    },
    emptyStateText: {
        fontSize: 14,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    emptyStateSubtext: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    bankCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    bankTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    bankDetail: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    bankLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    bankValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    bluPayCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    bluPayTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    bluPaySubtitle: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    bluPayDetail: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    bluPayLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    bluPayValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    usdCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    usdTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    usdSubtitle: {
        fontSize: 11,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    usdRule: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    usdBullet: {
        fontSize: 14,
        color: colors.textPrimary,
        marginRight: spacing.xs,
    },
    usdText: {
        flex: 1,
        fontSize: 14,
        color: colors.textPrimary,
        lineHeight: 20,
    },
});

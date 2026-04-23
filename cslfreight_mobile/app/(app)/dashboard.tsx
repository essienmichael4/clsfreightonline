import React, { useState } from 'react';
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

export default function DashboardScreen() {
    const router = useRouter();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const packageData: any[] = [
        // Empty for now - will show "No results"
    ];

    // Pagination logic
    const totalPages = Math.ceil(packageData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = packageData.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
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
                    {/* Welcome Christmas Card */}
                    <View style={styles.welcomeCard}>
                        <Text style={styles.welcomeTitle}>Welcome, essienmichael4@gmail.com</Text>
                        <Text style={styles.christmasMessage}>
                            🎄 Wishing you a joyful Christmas filled with peace, good vibes, and blessings! ✨
                        </Text>
                        <Text style={styles.fromTeam}>- from CSL Team.</Text>
                    </View>

                    {/* Dashboard Title */}
                    <Text style={styles.dashboardTitle}>Dashboard</Text>

                    {/* Shipping Rates Disclaimer */}
                    <View style={styles.disclaimerCard}>
                        <Text style={styles.disclaimerText}>
                            Shipping rates show the highest rates per category for CHINA to ACCRA. Rates for other areas like Sunyani, Techiman & Kumasi will be edited on your invoices. Also, discounted shipping rates will reflect on your invoices as not all persons have 1CBM or more. Please note that actual fees may be higher or lower at the time of payment due to changes in USD-GHC rates. Kindly use these estimated shipping fees on your dashboard as a guide.
                        </Text>
                    </View>

                    {/* Shipping Rate Card */}
                    <View style={styles.shippingRateCard}>
                        <View style={styles.rateHeader}>
                            <Text style={styles.rateTitle}>Shipping Rate</Text>
                            <View style={styles.currencyBadge}>
                                <Text style={styles.currencyText}>To GHS</Text>
                            </View>
                        </View>

                        <View style={styles.rateRow}>
                            <View style={styles.rateItem}>
                                <Text style={styles.ratePrice}>$ 240</Text>
                                <Text style={styles.rateDescription}>Normal Goods per CBM</Text>
                            </View>
                            <View style={styles.rateItem}>
                                <Text style={styles.ratePrice}>$ 260</Text>
                                <Text style={styles.rateDescription}>Special / Sensitive Goods per CBM</Text>
                            </View>
                        </View>

                        <View style={styles.heavyDutySection}>
                            <Text style={styles.heavyDutyPrice}>$ 350</Text>
                            <Text style={styles.heavyDutyDescription}>
                                Heavy Duty {'>'}/= 400kg / Tiles / Equipment / Machinery, Forklift related goods / Electric Bikes, ETC.
                            </Text>
                        </View>
                    </View>

                    {/* Date Pickers */}
                    <View style={styles.datePickerSection}>
                        <View style={styles.datePickerWrapper}>
                            <Text style={styles.dateLabel}>From</Text>
                            <TouchableOpacity style={styles.datePicker}>
                                <Text style={styles.datePickerIcon}>📅</Text>
                                <Text style={styles.datePickerText}>Select date</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.datePickerWrapper}>
                            <Text style={styles.dateLabel}>To</Text>
                            <TouchableOpacity style={styles.datePicker}>
                                <Text style={styles.datePickerIcon}>📅</Text>
                                <Text style={styles.datePickerText}>Select date</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Cards */}
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, styles.statCardOrange]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Total Est. Shipping Fees</Text>
                                <View style={styles.statIconContainer}>
                                    <Text style={styles.statIcon}>↗</Text>
                                </View>
                            </View>
                            <Text style={styles.statValue}>$ 0.00</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardGray]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Total Packages</Text>
                                <View style={styles.statIconContainer}>
                                    <Text style={styles.statIcon}>↗</Text>
                                </View>
                            </View>
                            <Text style={styles.statValue}>0</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardGray]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Undelivered Packages</Text>
                                <View style={styles.statIconContainer}>
                                    <Text style={styles.statIcon}>↗</Text>
                                </View>
                            </View>
                            <Text style={styles.statValue}>0</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardGray]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Delivered Packages</Text>
                                <View style={styles.statIconContainer}>
                                    <Text style={styles.statIcon}>↗</Text>
                                </View>
                            </View>
                            <Text style={styles.statValue}>0</Text>
                        </View>
                    </View>

                    {/* Package Report */}
                    <View style={styles.packageReportSection}>
                        <Text style={styles.packageReportTitle}>Package Report</Text>

                        {/* Table Header */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderCell, styles.cellNo]}>No.</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellTracking]}>Tracking ID</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellCustomer]}>Customer</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellDate]}>Received</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellDate]}>Loaded</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellDate]}>Estimated Arrival</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellPackage]}>Package</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellQty]}>Quantity</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellVessel]}>Vessel</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellStatus]}>Status</Text>
                                    <Text style={[styles.tableHeaderCell, styles.cellCBM]}>CBM</Text>
                                </View>

                                {/* Table Body */}
                                {packageData.length === 0 ? (
                                    <View style={styles.noResults}>
                                        <Text style={styles.noResultsText}>No results.</Text>
                                    </View>
                                ) : (
                                    currentPageData.map((pkg, index) => (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, styles.cellNo]}>{startIndex + index + 1}</Text>
                                            <Text style={[styles.tableCell, styles.cellTracking]}>{pkg.tracking}</Text>
                                            <Text style={[styles.tableCell, styles.cellCustomer]}>{pkg.customer}</Text>
                                            <Text style={[styles.tableCell, styles.cellDate]}>{pkg.received}</Text>
                                            <Text style={[styles.tableCell, styles.cellDate]}>{pkg.loaded}</Text>
                                            <Text style={[styles.tableCell, styles.cellDate]}>{pkg.arrival}</Text>
                                            <Text style={[styles.tableCell, styles.cellPackage]}>{pkg.package}</Text>
                                            <Text style={[styles.tableCell, styles.cellQty]}>{pkg.quantity}</Text>
                                            <Text style={[styles.tableCell, styles.cellVessel]}>{pkg.vessel}</Text>
                                            <Text style={[styles.tableCell, styles.cellStatus]}>{pkg.status}</Text>
                                            <Text style={[styles.tableCell, styles.cellCBM]}>{pkg.cbm}</Text>
                                        </View>
                                    ))
                                )}
                            </View>
                        </ScrollView>

                        {/* Pagination Controls */}
                        {packageData.length > 0 && (
                            <View style={styles.paginationContainer}>
                                <TouchableOpacity
                                    style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                                    onPress={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>
                                        ← Previous
                                    </Text>
                                </TouchableOpacity>

                                <Text style={styles.paginationInfo}>
                                    Page {currentPage} of {totalPages}
                                </Text>

                                <TouchableOpacity
                                    style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                                    onPress={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>
                                        Next →
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
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
    welcomeCard: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    welcomeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        marginBottom: spacing.sm,
    },
    christmasMessage: {
        fontSize: 14,
        color: colors.white,
        lineHeight: 20,
        marginBottom: spacing.xs,
    },
    fromTeam: {
        fontSize: 12,
        color: colors.white,
        fontStyle: 'italic',
        opacity: 0.9,
    },
    dashboardTitle: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    disclaimerCard: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    disclaimerText: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    shippingRateCard: {
        backgroundColor: '#FF9966',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    rateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    rateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    currencyBadge: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
    },
    currencyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    rateRow: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginBottom: spacing.md,
    },
    rateItem: {
        flex: 1,
    },
    ratePrice: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    rateDescription: {
        fontSize: 13,
        color: '#000',
        lineHeight: 18,
    },
    heavyDutySection: {
        marginTop: spacing.sm,
    },
    heavyDutyPrice: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    heavyDutyDescription: {
        fontSize: 13,
        color: '#000',
        lineHeight: 18,
    },
    datePickerSection: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    datePickerWrapper: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    datePickerIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    datePickerText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    statCardOrange: {
        backgroundColor: '#FF9966',
    },
    statCardGray: {
        backgroundColor: '#D1D5DB',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    statTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
        flex: 1,
    },
    statIconContainer: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.sm,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statIcon: {
        fontSize: 16,
        color: '#000',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    packageReportSection: {
        marginTop: spacing.md,
    },
    packageReportTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    table: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        minWidth: 1200,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.darkGray,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    tableHeaderCell: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
        paddingHorizontal: spacing.xs,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    tableCell: {
        fontSize: 12,
        color: colors.textSecondary,
        paddingHorizontal: spacing.xs,
    },
    cellNo: { width: 40 },
    cellTracking: { width: 120 },
    cellCustomer: { width: 120 },
    cellDate: { width: 100 },
    cellPackage: { width: 100 },
    cellQty: { width: 80 },
    cellVessel: { width: 100 },
    cellStatus: { width: 100 },
    cellCBM: { width: 80 },
    noResults: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        marginTop: spacing.sm,
    },
    paginationButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        minWidth: 100,
        alignItems: 'center',
    },
    paginationButtonDisabled: {
        backgroundColor: colors.darkGray,
    },
    paginationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
    paginationButtonTextDisabled: {
        color: colors.textSecondary,
    },
    paginationInfo: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
});

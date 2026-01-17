import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, borderRadius } from '@/theme';
import useAuth from 'app/_hooks/useAuth';
import useAxiosToken from 'app/_hooks/useAxiosToken';
import { useQuery } from '@tanstack/react-query';
import { Package, PackageTypeAndRate, Stats } from 'app/_lib/types';
import { startOfMonth, subMonths } from 'date-fns';

export default function DashboardScreen() {
    const axios_instance_token = useAxiosToken()
    const { auth } = useAuth()
    const router = useRouter();
    const [fromDate, setFromDate] = useState<Date | null>(startOfMonth(subMonths(new Date(), 5)));
    const [toDate, setToDate] = useState<Date | null>(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [state, setState] = useState<"USD" | "GHS">("USD")

    const handleCurrencyChange = (value: "USD" | "GHS") => {
        setState(value)
    }

    const rates = useQuery<PackageTypeAndRate[]>({
        queryKey: ["package-rates"],
        queryFn: async () => await axios_instance_token.get("/packages/shipping-rates").then(res => {
            return res.data
        })
    })

    const stats = useQuery<Stats>({
        queryKey: ["summary", fromDate, toDate, state],
        queryFn: async () => await axios_instance_token.get(`/statistics/client-dashboard?state=${state}&to=${toDate?.toISOString()}&from=${fromDate?.toISOString()}`).then(res => {
            console.log(res.data)
            return res.data
        })
    })

    const orders = useQuery<Package[]>({
        queryKey: ["summary", "packages"],
        queryFn: async () => await axios_instance_token.get("/packages/summary/client").then(res => res.data)
    })

    // Pagination logic
    const packageData = orders.data || [];
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

    const handleFromDateChange = (_: any, selectedDate?: Date) => {
        setShowFromPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFromDate(selectedDate);
        }
    };

    const handleToDateChange = (_: any, selectedDate?: Date) => {
        setShowToPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setToDate(selectedDate);
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Select date';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
                            <TouchableOpacity
                                style={styles.currencyBadge}
                                onPress={() => handleCurrencyChange(state === "USD" ? "GHS" : "USD")}
                            >
                                <Text style={styles.currencyText}>
                                    {state === "USD" ? "To GHS" : "To USD"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.rateRow}>
                            {rates.data?.map((rate, index) => {
                                const currentRate = state === "USD" ? rate.rate : rate.cedisRate;
                                const parts = currentRate.toFixed(2).split('.');
                                return (
                                    <View key={index} style={[styles.rateItem, index === 2 && styles.rateItemFull]}>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.currencySymbol}>{state === "USD" ? "$" : "₵"}</Text>
                                            <Text style={styles.ratePrice}>{currentRate.toFixed(2)}</Text>
                                        </View>
                                        <Text style={styles.rateDescription}>{rate.description}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Date Pickers */}
                    <View style={styles.datePickerSection}>
                        <View style={styles.datePickerWrapper}>
                            <Text style={styles.dateLabel}>From</Text>
                            <TouchableOpacity
                                style={styles.datePicker}
                                onPress={() => {
                                    if (showFromPicker) {
                                        setShowFromPicker(false);
                                    } else {
                                        setShowFromPicker(true);
                                        setShowToPicker(false);
                                    }
                                }}
                            >
                                <MaterialIcons name="event" size={20} color={colors.textSecondary} style={styles.datePickerIcon} />
                                <Text style={[styles.datePickerText, fromDate && styles.datePickerTextSelected]}>
                                    {formatDate(fromDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.datePickerWrapper}>
                            <Text style={styles.dateLabel}>To</Text>
                            <TouchableOpacity
                                style={styles.datePicker}
                                onPress={() => {
                                    if (showToPicker) {
                                        setShowToPicker(false);
                                    } else {
                                        setShowToPicker(true);
                                        setShowFromPicker(false);
                                    }
                                }}
                            >
                                <MaterialIcons name="event" size={20} color={colors.textSecondary} style={styles.datePickerIcon} />
                                <Text style={[styles.datePickerText, toDate && styles.datePickerTextSelected]}>
                                    {formatDate(toDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {/* DateTimePicker - Platform Specific */}
                    {Platform.OS === 'web' ? (
                        <>
                            {showFromPicker && (
                                <input
                                    type="date"
                                    value={fromDate?.toISOString().split('T')[0] || ''}
                                    onChange={(e) => {
                                        const newDate = new Date(e.target.value);
                                        handleFromDateChange(null, newDate);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        opacity: 0,
                                        pointerEvents: 'auto',
                                        width: 1,
                                        height: 1
                                    }}
                                    autoFocus
                                    onBlur={() => setShowFromPicker(false)}
                                />
                            )}
                            {showToPicker && (
                                <input
                                    type="date"
                                    value={toDate?.toISOString().split('T')[0] || ''}
                                    onChange={(e) => {
                                        const newDate = new Date(e.target.value);
                                        handleToDateChange(null, newDate);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        opacity: 0,
                                        pointerEvents: 'auto',
                                        width: 1,
                                        height: 1
                                    }}
                                    autoFocus
                                    onBlur={() => setShowToPicker(false)}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {showFromPicker && (
                                <DateTimePicker
                                    value={fromDate || new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleFromDateChange}
                                    textColor="#000000"
                                    themeVariant="light"
                                />
                            )}
                            {showToPicker && (
                                <DateTimePicker
                                    value={toDate || new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleToDateChange}
                                    textColor="#000000"
                                    themeVariant="light"
                                />
                            )}
                        </>
                    )}


                    {/* Stats Cards */}
                    <View style={styles.statsGrid}>

                        <View style={[styles.statCard, styles.statCardOrange]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Total Est. Shipping Fees</Text>
                                <View style={styles.statIconContainer}>
                                    <MaterialIcons name="trending-up" size={18} color="#059669" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>$ {Number(stats.data?.estimated.stat || 0).toFixed(2)}</Text>
                        </View>



                        <View style={[styles.statCard, styles.statCardGray]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Total Packages</Text>
                                <View style={styles.statIconContainer}>
                                    <MaterialIcons name="trending-up" size={18} color="#059669" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>{stats.data?.packages.stat}</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardGray]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Undelivered Packages</Text>
                                <View style={styles.statIconContainer}>
                                    <MaterialIcons name="trending-up" size={18} color="#059669" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>{stats.data?.undelivered.stat}</Text>
                        </View>

                        <View style={[styles.statCard, styles.statCardGray]}>
                            <View style={styles.statHeader}>
                                <Text style={styles.statTitle}>Delivered Packages</Text>
                                <View style={styles.statIconContainer}>
                                    <MaterialIcons name="trending-up" size={18} color="#059669" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>{stats.data?.delivered.stat}</Text>
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
                                            <Text style={[styles.tableCell, styles.cellTracking]}>{pkg.trackingNumber}</Text>
                                            <Text style={[styles.tableCell, styles.cellCustomer]}>{pkg.customer}</Text>
                                            <Text style={[styles.tableCell, styles.cellDate]}>{pkg.received}</Text>
                                            <Text style={[styles.tableCell, styles.cellDate]}>{pkg.loaded}</Text>
                                            <Text style={[styles.tableCell, styles.cellDate]}>{pkg.eta}</Text>
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
    welcomeCard: {
        backgroundColor: '#1E3A8A',
        padding: spacing.lg,
        borderRadius: 16,
        marginBottom: spacing.xl,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        elevation: 8,
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        marginBottom: spacing.sm,
        letterSpacing: 0.3,
    },
    christmasMessage: {
        fontSize: 15,
        color: colors.white,
        lineHeight: 22,
        marginBottom: spacing.sm,
        opacity: 0.95,
    },
    fromTeam: {
        fontSize: 13,
        color: colors.white,
        fontStyle: 'italic',
        opacity: 0.85,
    },
    dashboardTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: spacing.lg,
        letterSpacing: -0.5,
    },
    disclaimerCard: {
        backgroundColor: '#FEF3C7',
        padding: spacing.lg,
        borderRadius: 12,
        marginBottom: spacing.xl,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevation: 3,
    },
    disclaimerText: {
        fontSize: 13,
        color: '#78350F',
        lineHeight: 20,
        fontWeight: '500',
    },
    shippingRateCard: {
        backgroundColor: '#FFFFFF',
        padding: spacing.lg,
        borderRadius: 16,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        elevation: 6,
    },
    rateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 2,
        borderBottomColor: '#F3F4F6',
    },
    rateTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.3,
    },
    currencyBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    currencyText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E40AF',
        letterSpacing: 0.5,
    },
    rateRow: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    rateItem: {
        width: '48%',
        backgroundColor: '#F9FAFB',
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.md,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateItemFull: {
        width: '100%',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        gap: 4,
    },
    currencySymbol: {
        fontSize: 20,
        fontWeight: '700',
        color: '#059669',
        marginBottom: 4,
    },
    ratePrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#059669',
        includeFontPadding: false,
        textAlign: 'center',
    },
    rateDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    heavyDutySection: {
        marginTop: spacing.sm,
        backgroundColor: '#FEF2F2',
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    heavyDutyPrice: {
        fontSize: 36,
        fontWeight: '800',
        color: '#DC2626',
        marginBottom: 6,
        letterSpacing: -1,
    },
    heavyDutyDescription: {
        fontSize: 13,
        color: '#991B1B',
        lineHeight: 18,
        fontWeight: '500',
    },
    datePickerSection: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    datePickerWrapper: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: spacing.sm,
        letterSpacing: 0.2,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        elevation: 2,
    },
    datePickerIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    datePickerText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    datePickerTextSelected: {
        color: '#1F2937',
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        minWidth: '47%',
        padding: spacing.lg,
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        elevation: 6,
        borderWidth: 1,
    },
    statCardOrange: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FED7AA',
    },
    statCardGray: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    statTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        flex: 1,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    statIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statIcon: {
        fontSize: 18,
        color: '#059669',
        fontWeight: '700',
    },
    statValue: {
        fontSize: 23,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.5,
    },
    packageReportSection: {
        marginTop: spacing.md,
    },
    packageReportTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: spacing.lg,
        letterSpacing: -0.3,
    },
    table: {
        backgroundColor: colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minWidth: 1200,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevation: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
    },
    tableHeaderCell: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        paddingHorizontal: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
        backgroundColor: '#FFFFFF',
    },
    tableCell: {
        fontSize: 13,
        color: '#4B5563',
        paddingHorizontal: spacing.xs,
        fontWeight: '500',
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
        paddingVertical: spacing.xxl,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 15,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        marginTop: spacing.md,
    },
    paginationButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#1E3A8A',
        minWidth: 110,
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        elevation: 3,
    },
    paginationButtonDisabled: {
        backgroundColor: '#E5E7EB',
        shadowOpacity: 0,
        elevation: 0,
    },
    paginationButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.3,
    },
    paginationButtonTextDisabled: {
        color: '#9CA3AF',
    },
    paginationInfo: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
});

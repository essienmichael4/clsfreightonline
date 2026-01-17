import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'app/_lib/types';
import useAxiosToken from 'app/_hooks/useAxiosToken';

export default function PackagesScreen() {



    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const axios_instance_token = useAxiosToken()
    const status = selectedTab === 'all' ? '' : selectedTab;

    const packages = useQuery<Package[]>({
        queryKey: ["packages", status],
        queryFn: async () => await axios_instance_token.get(`/packages/client?status=${status}`).then(res => res.data)
    })

    // Filter packages based on search query
    const filteredPackages = packages.data?.filter(pkg => {
        if (!searchQuery) return true;
        return pkg.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

    // Calculate pagination
    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
    const paginatedPackages = filteredPackages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedTab]);

    const tabs = [
        { key: '', label: 'All' },
        { key: 'YET_TO_LOAD', label: 'Yet To Load' },
        { key: 'IN_TRANSIT', label: 'In Transit' },
        { key: 'ARRIVED', label: 'Arrived' },
        { key: 'DELIVERED', label: 'Delivered' },
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
                        <MaterialIcons name="search" size={20} color={colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by tracking number..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Tabs */}
                    <View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.tabsContainer}
                        >
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
                        </ScrollView>
                    </View>

                    {/* Packages List */}
                    <ScrollView
                        style={styles.packagesList}
                        showsVerticalScrollIndicator={false}
                    >
                        {paginatedPackages.map((pkg) => (
                            <TouchableOpacity key={pkg.id} style={styles.packageCard}>
                                <View style={styles.packageHeader}>
                                    <View style={styles.packageIcon}>
                                        <MaterialIcons name="inventory-2" size={28} color={colors.primary} />
                                    </View>
                                    <View style={styles.packageInfo}>
                                        <Text style={styles.trackingNumber}>{pkg.trackingNumber}</Text>
                                        {/* <Text style={styles.route}>{pkg.origin} → {pkg.destination}</Text> */}
                                    </View>
                                    <View style={[styles.statusBadge, getStatusStyle(pkg.status)]}>
                                        <Text style={styles.statusText}>{pkg.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.packageFooter}>
                                    <View style={styles.dateContainer}>
                                        <MaterialIcons name="event" size={16} color={colors.textSecondary} />
                                        <Text style={styles.dateText}>{pkg.loaded}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.detailsButton}
                                        onPress={() => router.push({
                                            pathname: `/(app)/package-details/${pkg.id}`,
                                            params: {
                                                id: pkg.id,
                                                trackingNumber: pkg.trackingNumber,
                                                status: pkg.status,
                                                // origin: pkg.origin,
                                                // destination: pkg.destination
                                            }
                                        })}
                                    >
                                        <Text style={styles.detailsLink}>View Details</Text>
                                        <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <View style={styles.paginationContainer}>
                                <TouchableOpacity
                                    style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                                    onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <MaterialIcons name="chevron-left" size={24} color={currentPage === 1 ? colors.textSecondary : colors.primary} />
                                    <Text style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}>Prev</Text>
                                </TouchableOpacity>

                                <Text style={styles.pageInfo}>
                                    Page {currentPage} of {totalPages}
                                </Text>

                                <TouchableOpacity
                                    style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                                    onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <Text style={[styles.pageButtonText, currentPage === totalPages && styles.pageButtonTextDisabled]}>Next</Text>
                                    <MaterialIcons name="chevron-right" size={24} color={currentPage === totalPages ? colors.textSecondary : colors.primary} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
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
        paddingHorizontal: spacing.md,
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
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        marginTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    pageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
    },
    pageButtonDisabled: {
        opacity: 0.5,
    },
    pageButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    pageButtonTextDisabled: {
        color: colors.textSecondary,
    },
    pageInfo: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});

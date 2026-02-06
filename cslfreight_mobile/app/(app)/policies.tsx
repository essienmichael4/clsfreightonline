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
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';

export default function PoliciesScreen() {
    const router = useRouter();
    useAndroidBackButton();

    const terms = [
        'We are a freight forwarding company and are responsible for your package collection, inspection, consolidation, container booking & ongoing customs clearance from the country of origin to the country of destination.',
        'The client (you) are responsible for packaging of your product, correct indication of your packages & timely payment of all customs & freight charges.',
        'We (CSL) reserve the right to reject hazardous, prohibited or improperly packaged cargo at our warehouse.',
        'Clients are responsible for insurance of their packages from port of origin to the country of destination but CSL is responsible only for packages within our warehouses.',
        'Provisional invoices are issued after loading in China, we will re-issue new invoices once packages arrive and are rechecked in Ghana for confirmation.',
        'Our minimum CBM is pegged at 0.01cbm and you are billed per consolidated LCL invoice. For FCL, please reach out to our admin for arrangements.',
        'Please note that your shipping fees do not include delivery to your destination - office or home but is offered on optional basis subjected to our terms and conditions.',
        'You are liable to pay GH¢ 100.00 per day/package as warehousing fees after 7 days of cargo arrival for pickup or delivery or pay at a declared flat rate as a consideration to customers.',
        'You shall pay at least 50% deposit of your total invoice 7 days after loading and full payment on container/vessel arrival at Tema port before customs clearance is completed.',
        'All fragile items must be covered and protected in styrofoam, wooden pallets and frame or get damaged at your own risk.',
        'Small packages have higher risks of getting lost. We cannot replace or refund for all such packages below 0.05cbm.',
        'For packages above 0.05cbm, we will refund the full cost of item but not exceeding 2 times the shipping costs.',
        'Our departure timelines are subject to cargo /ship or airplane availability.',
        'Vessel lines or Ship transit times may change without prior notice.',
        'Cargo may require inspection by customs and other regulatory bodies at their instance and time.',
        'We are committed to ensuring that your packages get to you safely and timely.',
        'Measurements will be re-taken at the warehouse in Ghana to confirm CBM before payments are made.',
        'Full payment of actual shipping fees with corresponding CBM is done in Ghana before pickup.',
        'Shipping rates for contraband or dangerous cargo and packages without MSDS are different from normal goods and are shipped in separate container loadings.',
        'Your goods will be security checked and if narcotics, ammunition, or banned substances are detected, persons will both be reported to relevant authorities without prior notice.',
        'You can only make payment into the assigned accounts attached to your invoice.',
        'Please note that all payments are in US Dollar rate with Ghana Cedi equivalent at the time of payment.',
        'We shall only keep your packages for a maximum of 30 days and after all means are exhausted, we will re-sell them at a fair price to retrieve our customs clearance and freight charges.',
        'Due to storage and security costs, we shall totally auction all unpaid packages in our warehouse by proper legal proceedings after 60 days.',
        'We do not do business with third parties apart from the registered persons and/or designated next of kin assigned from the day of registration as our client.',
        'Higher customs duty packages, all forklift related packages and/or packages over 400kg will be charged or billed at a different rate to cover for all such fees irrespective of whether they fall under NORMAL or SENSITIVE goods.',
    ];

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
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                           
                        </TouchableOpacity>
                        <Text style={styles.title}>Our Terms & Conditions</Text>
                        <Text style={styles.subtitle}>Last updated: 15 September 2025</Text>
                    </View>

                    {/* Company Info */}
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>CSL Freight Forwarding Ltd.</Text>
                    </View>

                    {/* Terms List */}
                    {terms.map((term, index) => (
                        <View key={index} style={styles.termCard}>
                            <View style={styles.termNumber}>
                                <Text style={styles.termNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.termText}>{term}</Text>
                        </View>
                    ))}

                    {/* Footer Spacing */}
                    <View style={styles.footerSpacing} />
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
        marginBottom: spacing.xl,
    },
    backButton: {
        marginBottom: spacing.md,
    },
    backText: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.body.fontSize,
        color: colors.textSecondary,
    },
    companyInfo: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    termCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    termNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        flexShrink: 0,
    },
    termNumberText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 14,
    },
    termText: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    footerSpacing: {
        height: spacing.xl,
    },
});

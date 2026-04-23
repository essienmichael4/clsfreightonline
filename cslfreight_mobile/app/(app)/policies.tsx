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
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function PoliciesScreen() {
    const router = useRouter();

    const policies = [
        {
            title: 'Shipping Policy',
            icon: '📦',
            items: ['Standard delivery: 15-30 business days', 'Express delivery: 7-15 business days', 'Free shipping on orders over $500', 'Tracking available for all shipments'],
        },
        {
            title: 'Return Policy',
            icon: '↩️',
            items: ['30-day return window', 'Items must be unused and in original packaging', 'Return shipping costs covered for defective items', 'Refunds processed within 7-10 business days'],
        },
        {
            title: 'Privacy Policy',
            icon: '🔒',
            items: ['Your data is encrypted and secure', 'We never share personal information', 'You control your data preferences', 'Regular security audits conducted'],
        },
        {
            title: 'Payment Terms',
            icon: '💳',
            items: ['All major payment methods accepted', 'Secure payment processing', 'No hidden fees', 'Invoices provided for all transactions'],
        },
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
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Our Policies</Text>
                        <Text style={styles.subtitle}>Terms and conditions</Text>
                    </View>

                    {/* Policies List */}
                    {policies.map((policy, index) => (
                        <View key={index} style={styles.policyCard}>
                            <View style={styles.policyHeader}>
                                <View style={styles.policyIconContainer}>
                                    <Text style={styles.policyIcon}>{policy.icon}</Text>
                                </View>
                                <Text style={styles.policyTitle}>{policy.title}</Text>
                            </View>
                            <View style={styles.policyContent}>
                                {policy.items.map((item, idx) => (
                                    <View key={idx} style={styles.policyItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.policyText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Contact Support */}
                    <View style={styles.supportSection}>
                        <Text style={styles.supportTitle}>Need Help?</Text>
                        <Text style={styles.supportText}>
                            If you have questions about our policies, please contact our support team.
                        </Text>
                        <TouchableOpacity style={styles.supportButton}>
                            <Text style={styles.supportButtonText}>Contact Support</Text>
                        </TouchableOpacity>
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
    policyCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    policyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    policyIconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    policyIcon: {
        fontSize: 20,
    },
    policyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    policyContent: {
        gap: spacing.xs,
    },
    policyItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: colors.primary,
        marginRight: spacing.sm,
        marginTop: 2,
    },
    policyText: {
        flex: 1,
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    supportSection: {
        backgroundColor: colors.primary + '15',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginTop: spacing.md,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    supportTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    supportText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    supportButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
    },
    supportButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
});

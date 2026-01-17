import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function BuyRMBScreen() {
    const handleOpenRMBDeals = async () => {
        const url = 'https://rmbdeals.com/';
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("Don't know how to open URI: " + url);
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
                        <Text style={styles.title}>Buy RMB</Text>
                        <Text style={styles.subtitle}>Currency Exchange Service</Text>
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <MaterialIcons name="currency-exchange" size={56} color={colors.primary} />
                        <Text style={styles.infoTitle}>Exchange Currency Online</Text>
                        <Text style={styles.infoText}>
                            Get the best rates for Chinese Yuan (RMB) exchange. Click the button below to visit our partner site and complete your currency exchange.
                        </Text>
                    </View>

                    {/* Main CTA Button */}
                    <TouchableOpacity style={styles.ctaButton} onPress={handleOpenRMBDeals}>
                        <Text style={styles.ctaButtonText}>Visit RMB Deals</Text>
                        <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
                    </TouchableOpacity>

                    {/* Features */}
                    <View style={styles.featuresSection}>
                        <Text style={styles.featuresTitle}>Why Use RMB Deals?</Text>

                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={24} color={colors.primary} style={styles.featureIcon} />
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Competitive Rates</Text>
                                <Text style={styles.featureDescription}>Get the best exchange rates in the market</Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={24} color={colors.primary} style={styles.featureIcon} />
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Fast Processing</Text>
                                <Text style={styles.featureDescription}>Quick and secure transactions</Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <MaterialIcons name="check-circle" size={24} color={colors.primary} style={styles.featureIcon} />
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Trusted Service</Text>
                                <Text style={styles.featureDescription}>Reliable currency exchange partner</Text>
                            </View>
                        </View>
                    </View>

                    {/* Secondary Link */}
                    <TouchableOpacity style={styles.linkButton} onPress={handleOpenRMBDeals}>
                        <Text style={styles.linkText}>rmbdeals.com</Text>
                        <MaterialIcons name="link" size={18} color={colors.primary} />
                    </TouchableOpacity>
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
    infoCard: {
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    infoIcon: {
        fontSize: 48,
        marginBottom: spacing.sm,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    ctaButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        boxShadow: `0 4px 8px ${colors.primary}4D`,
        elevation: 8,
    },
    ctaButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginRight: spacing.sm,
    },
    ctaButtonIcon: {
        color: colors.white,
        fontSize: 20,
    },
    featuresSection: {
        marginBottom: spacing.lg,
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    featureIcon: {
        fontSize: 20,
        color: colors.primary,
        marginRight: spacing.sm,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    featureDescription: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
    },
    linkText: {
        fontSize: 14,
        color: colors.primary,
        textDecorationLine: 'underline',
        marginRight: spacing.xs,
    },
    linkIcon: {
        fontSize: 16,
    },
});

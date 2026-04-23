import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function ScheduleScreen() {
    const [shippingMark, setShippingMark] = useState('');
    const [requestType, setRequestType] = useState('pickup');
    const [partyType, setPartyType] = useState('self');
    const [loadingDate, setLoadingDate] = useState('');
    const [location, setLocation] = useState('');
    const [callNumber, setCallNumber] = useState('');

    const handleSubmit = () => {
        // TODO: Implement submission logic
        console.log({
            shippingMark,
            requestType,
            partyType,
            loadingDate,
            location,
            callNumber,
        });
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
                        <Text style={styles.title}>Schedule Service</Text>
                        <Text style={styles.subtitle}>Book a pickup or delivery</Text>
                    </View>

                    {/* Shipping Mark */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Shipping Mark</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter shipping mark"
                                placeholderTextColor={colors.textSecondary}
                                value={shippingMark}
                                onChangeText={setShippingMark}
                            />
                        </View>
                    </View>

                    {/* Request Type */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Request Type</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    requestType === 'pickup' && styles.optionButtonActive,
                                ]}
                                onPress={() => setRequestType('pickup')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        requestType === 'pickup' && styles.optionButtonTextActive,
                                    ]}
                                >
                                    Pickup
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    requestType === 'delivery' && styles.optionButtonActive,
                                ]}
                                onPress={() => setRequestType('delivery')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        requestType === 'delivery' && styles.optionButtonTextActive,
                                    ]}
                                >
                                    Delivery
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Party Type */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Party Type</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    partyType === 'self' && styles.optionButtonActive,
                                ]}
                                onPress={() => setPartyType('self')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        partyType === 'self' && styles.optionButtonTextActive,
                                    ]}
                                >
                                    Self
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    partyType === 'third-party' && styles.optionButtonActive,
                                ]}
                                onPress={() => setPartyType('third-party')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        partyType === 'third-party' && styles.optionButtonTextActive,
                                    ]}
                                >
                                    Third Party
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Loading Date */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Loading Date</Text>
                        <TouchableOpacity style={styles.inputWrapper}>
                            <Text style={styles.inputIcon}>📅</Text>
                            <Text style={styles.inputPlaceholder}>Select loading date</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputIcon}>📍</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter location"
                                placeholderTextColor={colors.textSecondary}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </View>

                    {/* Call Number */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Call Number</Text>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputIcon}>📞</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter phone number"
                                placeholderTextColor={colors.textSecondary}
                                value={callNumber}
                                onChangeText={setCallNumber}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit Request</Text>
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
    section: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
    },
    inputPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: colors.textSecondary,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    optionButton: {
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
    },
    optionButtonActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    optionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    optionButtonTextActive: {
        color: colors.primary,
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

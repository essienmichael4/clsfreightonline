import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/theme';

export default function ShippingCalculator() {
    const router = useRouter();
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [rate, setRate] = useState('');
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);

    const calculateShippingFee = () => {
        // Validate inputs
        if (!length || !width || !height || !rate) {
            alert('Please fill in all fields');
            return;
        }

        const lengthNum = parseFloat(length);
        const widthNum = parseFloat(width);
        const heightNum = parseFloat(height);
        const rateNum = parseFloat(rate);

        // Validate numbers
        if (isNaN(lengthNum) || isNaN(widthNum) || isNaN(heightNum) || isNaN(rateNum)) {
            alert('Please enter valid numbers');
            return;
        }

        if (lengthNum <= 0 || widthNum <= 0 || heightNum <= 0 || rateNum <= 0) {
            alert('All values must be greater than 0');
            return;
        }

        // Step 1: Calculate weight (W * L * H)
        const calculatedWeight = widthNum * lengthNum * heightNum;

        // Step 2: Calculate shipping fee (Weight * Rate)
        const calculatedFee = calculatedWeight * rateNum;

        setWeight(calculatedWeight);
        setShippingFee(calculatedFee);
    };

    const resetForm = () => {
        setLength('');
        setWidth('');
        setHeight('');
        setRate('');
        setShippingFee(null);
        setWeight(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerBar}>
                <Text style={styles.headerBarTitle}>Calculate shipping fee</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="close" size={28} color={colors.white} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Main Card */}
                <View style={styles.card}>
                    {/* Fee Display */}
                    <View style={styles.feeDisplay}>
                        <Text style={styles.feeLabel}>Est. shipping fee (USD)</Text>
                        <Text style={styles.feeAmount}>
                            ${shippingFee !== null ? shippingFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        </Text>
                    </View>

                    {/* Weight Display */}
                    {weight !== null && (
                        <View style={styles.weightDisplay}>
                            <Text style={styles.weightLabel}>Calculated Weight (CBM)</Text>
                            <Text style={styles.weightAmount}>{weight.toFixed(2)}</Text>
                        </View>
                    )}

                    {/* Input Fields */}
                    <View style={styles.inputSection}>
                        <View style={styles.rowInputs}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Length (m)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="decimal-pad"
                                    value={length}
                                    onChangeText={setLength}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Width (m)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="decimal-pad"
                                    value={width}
                                    onChangeText={setWidth}
                                />
                            </View>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Height (m)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="decimal-pad"
                                    value={height}
                                    onChangeText={setHeight}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>CBM Rate</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="decimal-pad"
                                    value={rate}
                                    onChangeText={setRate}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonSection}>
                        <TouchableOpacity
                            style={styles.calculateButton}
                            onPress={calculateShippingFee}
                        >
                            <Text style={styles.calculateButtonText}>Calculate</Text>
                        </TouchableOpacity>

                        {shippingFee !== null && (
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetForm}
                            >
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <Text style={styles.infoTitle}>How it works:</Text>
                        <Text style={styles.infoText}>
                            1. <Text style={styles.infoBold}>Weight Calculation:</Text> Length × Width × Height = CBM Weight
                        </Text>
                        <Text style={styles.infoText}>
                            2. <Text style={styles.infoBold}>Shipping Fee:</Text> Weight × CBM Rate = Total Shipping Fee
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightGray,
    },
    headerBar: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        paddingTop: spacing.md,
    },
    headerBarTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        elevation: 4,
        marginBottom: spacing.xl,
    },
    feeDisplay: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    feeLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    feeAmount: {
        fontSize: 42,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    weightDisplay: {
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    weightLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    weightAmount: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    inputSection: {
        marginBottom: spacing.lg,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: spacing.xs,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        fontSize: 14,
        color: colors.textPrimary,
        backgroundColor: colors.white,
    },
    buttonSection: {
        gap: spacing.sm,
    },
    calculateButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calculateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
    resetButton: {
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    resetButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    infoSection: {
        marginTop: spacing.lg,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    infoText: {
        fontSize: 12,
        color: colors.textSecondary,
        lineHeight: 18,
        marginBottom: spacing.xs,
    },
    infoBold: {
        fontWeight: '600',
        color: colors.textPrimary,
    },
});

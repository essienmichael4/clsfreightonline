import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';
import axios from 'axios';
import { axios_instance } from 'app/_API/axios';
import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';


export default function ForgotPasswordScreen() {

    const router = useRouter();
    useAndroidBackButton();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleEmailSubmit = async () => {

        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        // Clear any previous success message
        setSuccessMessage('');

        try {
            setLoading(true);

            const response = await axios_instance.post(
                "/auth/clients/forgot-password",
                { email }
            );
            console.log(response.data);

            // Set success message to display on page
            setSuccessMessage(
                response?.data?.message || "A reset code has been sent to your email"
            );

        } catch (err: any) {

            if (axios.isAxiosError(err)) {
                const msg =
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    "Something went wrong. Please try again";

                Alert.alert("Error", msg);

            } else {
                Alert.alert("Error", "Unexpected error occurred");
            }

        } finally {
            setLoading(false);
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
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="lock-reset" size={48} color={colors.primary} />
                        </View>
                        <Text style={styles.title}>Reset Password</Text>
                    </View>

                    <View style={styles.form}>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>

                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputIcon}>✉️</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor={colors.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleEmailSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </Text>
                        </TouchableOpacity>

                        {successMessage ? (
                            <View style={styles.successContainer}>
                                <MaterialIcons name="check-circle" size={24} color={colors.success} />
                                <Text style={styles.successText}>{successMessage}</Text>
                            </View>
                        ) : null}

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
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    backButton: {
        marginBottom: spacing.lg,
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
    },
    backButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    inputGroup: {
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
        backgroundColor: colors.darkGray,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    inputIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    successContainer: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        borderWidth: 1,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginTop: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    successText: {
        color: '#155724',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
        flexWrap: 'wrap',
    },
});

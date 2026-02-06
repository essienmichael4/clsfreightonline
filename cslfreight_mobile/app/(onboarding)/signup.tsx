import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { axios_instance } from 'app/_API/axios';
import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';

export default function SignupScreen() {
    const router = useRouter();
    useAndroidBackButton();
    const [shippingMark, setShippingMark] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    // const { dispatch } = useAuth();

    const validateEmail = (emailValue: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    };

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleSignup = async () => {
        // Reset error state
        setError('');

        // Validate inputs
        if (!shippingMark.trim()) {
            setError('Full name is required');
            return;
        }

        if (shippingMark.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password.trim()) {
            setError('Password is required');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (!confirmPassword.trim()) {
            setError('Please confirm your password');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios_instance.post('/auth/signup/client', {
                shippingMark,
                email,
                phone,
                location,
                password,
                confirmPassword,
            });

            setSuccess(data.message);

            // Navigate to main app login
            //router.replace('/(app)/login');
        } catch (err: any) {
            let errorMessage = 'Sign up failed. Please try again.';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message === 'Network Error') {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
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
                        {/* Back Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                Sign up to start tracking your shipments
                            </Text>
                        </View>

                        {/* Signup Form */}
                        <View style={styles.form}>
                            {/* Error Alert */}
                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorIcon}>⚠️</Text>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {/* Success Alert */}
                            {success ? (
                                <View style={styles.successContainer}>
                                    <Text style={styles.successIcon}>⚠️</Text>
                                    <Text style={styles.successText}>{success}</Text>
                                </View>
                            ) : null}

                            {/* Name Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Shipping Mark</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="GH123457"
                                        placeholderTextColor={colors.textSecondary}
                                        value={shippingMark}
                                        onChangeText={setShippingMark}
                                        autoCapitalize="words"
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}></Text>
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

                            {/* Phone */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+2335454000"
                                        placeholderTextColor={colors.textSecondary}
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!loading}
                                    />
                                </View>
                            </View>


                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Create a password"
                                        placeholderTextColor={colors.textSecondary}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        editable={!loading}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.passwordToggle}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            size={24}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.passwordHint}>
                                    Min 6 chars, 1 uppercase letter & 1 number
                                </Text>
                            </View>

                            {/* Confirm Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm your password"
                                        placeholderTextColor={colors.textSecondary}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        editable={!loading}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.passwordToggle}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? 'eye-off' : 'eye'}
                                            size={24}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Location */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Location</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputIcon}></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Location"
                                        placeholderTextColor={colors.textSecondary}
                                        value={location}
                                        onChangeText={setLocation}
                                        keyboardType="default"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                style={[styles.signupButton, loading && styles.disabledButton]}
                                activeOpacity={0.8}
                                onPress={handleSignup}
                                disabled={loading}
                            >
                                <Text style={styles.signupButtonText}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Text>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Already have an account? </Text>
                                <TouchableOpacity
                                    onPress={() => router.push('/(onboarding)/login')}
                                    disabled={loading}
                                >
                                    <Text style={styles.loginLink}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </KeyboardAvoidingView>
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
    form: {
        flex: 1,
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        borderRadius: borderRadius.md,
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        marginBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    errorIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
        marginTop: 2,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    successContainer: {
        backgroundColor: '#DCFCE7',
        borderRadius: borderRadius.md,
        borderLeftWidth: 4,
        borderLeftColor: '#22C55E',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        marginBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    successIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
        marginTop: 2,
    },
    successText: {
        color: '#15803D',
        fontSize: 14,
        fontWeight: '500',
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
    passwordHint: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    signupButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.md,
    },
    disabledButton: {
        opacity: 0.6,
    },
    signupButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    passwordToggle: {
        padding: spacing.sm,
    },
});

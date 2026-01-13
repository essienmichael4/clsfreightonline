import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';
import useAxiosToken from '../_hooks/useAxiosToken';
import useAuth from 'app/_hooks/useAuth';

export default function PasswordResetScreen() {
    const router = useRouter();
    const axios_instance_token = useAxiosToken();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const { auth } = useAuth();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleResetPassword = async () => {
        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirmed password do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }

        if (oldPassword === newPassword) {
            Alert.alert('Error', 'New password must be different from old password');
            return;
        }

        setLoading(true);
        try {
            const response = await axios_instance_token.patch(`/users/clients/password/${auth?.id}`, {
                oldPassword,
                newPassword,
                confirmPassword,
            });

            // Set success message to display on page
            setSuccessMessage(
                response?.data?.message || "Password has been successfully updated"
            );
            
            // Clear form fields
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Password reset error:', error);
            const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
            Alert.alert('Error', message);
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            contentContainerStyle={styles.content}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                    <MaterialIcons name="arrow-back" size={24} color={colors.textSecondary} />
                                    <Text style={styles.backText}>Back</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>Password Reset</Text>
                                <Text style={styles.subtitle}>
                                    Enter your old password, new password and confirmed password to reset your password.
                                </Text>
                            </View>

                            {/* Password Reset Form */}
                            <View style={styles.formContainer}>
                                {/* Success Message */}
                                {successMessage && (
                                    <View style={styles.successSection}>
                                        <MaterialIcons name="check-circle" size={20} color={colors.success || colors.primary} />
                                        <Text style={styles.successText}>{successMessage}</Text>
                                    </View>
                                )}

                                {/* Old Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Old Password</Text>
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            value={oldPassword}
                                            onChangeText={setOldPassword}
                                            placeholder="Enter your current password"
                                            secureTextEntry={!showOldPassword}
                                            placeholderTextColor={colors.textSecondary}
                                            editable={!loading}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowOldPassword(!showOldPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <MaterialIcons
                                                name={showOldPassword ? 'visibility' : 'visibility-off'}
                                                size={24}
                                                color={colors.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* New Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>New Password</Text>
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            placeholder="Enter your new password"
                                            secureTextEntry={!showNewPassword}
                                            placeholderTextColor={colors.textSecondary}
                                            editable={!loading}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowNewPassword(!showNewPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <MaterialIcons
                                                name={showNewPassword ? 'visibility' : 'visibility-off'}
                                                size={24}
                                                color={colors.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.helperText}>Must be at least 6 characters</Text>
                                </View>

                                {/* Confirm Password */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                                    <View style={styles.passwordInputContainer}>
                                        <TextInput
                                            style={styles.passwordInput}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            placeholder="Re-enter your new password"
                                            secureTextEntry={!showConfirmPassword}
                                            placeholderTextColor={colors.textSecondary}
                                            editable={!loading}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={styles.eyeIcon}
                                        >
                                            <MaterialIcons
                                                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                                                size={24}
                                                color={colors.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                                    onPress={handleResetPassword}
                                    disabled={loading}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {loading ? 'Updating Password...' : 'Update Password'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Info Section */}
                                <View style={styles.infoSection}>
                                    <MaterialIcons name="info-outline" size={20} color={colors.primary} />
                                    <Text style={styles.infoText}>
                                        Your password will be updated immediately after successful reset.
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
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
    keyboardView: {
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.xs,
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
        lineHeight: 22,
    },
    formContainer: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        elevation: 4,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        backgroundColor: colors.white,
    },
    passwordInput: {
        flex: 1,
        padding: spacing.md,
        fontSize: 16,
        color: colors.textPrimary,
    },
    eyeIcon: {
        padding: spacing.md,
    },
    helperText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginTop: spacing.md,
        boxShadow: `0 4px 8px ${colors.primary}4D`,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    successSection: {
        flexDirection: 'row',
        backgroundColor: colors.success ? `${colors.success}15` : `${colors.primary}15`,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.success ? `${colors.success}40` : `${colors.primary}40`,
    },
    successText: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
        fontWeight: '500',
    },
    infoSection: {
        flexDirection: 'row',
        backgroundColor: colors.primary + '15',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.primary + '40',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },
});
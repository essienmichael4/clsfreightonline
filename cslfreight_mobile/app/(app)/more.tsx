import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';
import useAuth from '../_hooks/useAuth';
import useAxiosToken from '../_hooks/useAxiosToken';
import { useEffect } from 'react';

export default function MoreScreen() {
    const router = useRouter();
    useAndroidBackButton();
    const { auth, dispatch } = useAuth();
    const axios_instance_token = useAxiosToken();

    // Profile State
    const [userName, setUserName] = useState(auth?.name || auth?.shippingMark || 'User Name');
    const [, setUserEmail] = useState(auth?.email || 'user@example.com');
    const [userPhone, setUserPhone] = useState(auth?.phone || '');
    const [modalVisible, setModalVisible] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    const [loading, setLoading] = useState(false);

    // Sync state with auth when it changes
    useEffect(() => {
        if (auth) {
            setUserName(auth.name || auth.shippingMark);
            setUserEmail(auth.email);
            setUserPhone(auth.phone || '');
        }
    }, [auth]);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const openProfileModal = () => {
        setTempName(userName);
        setTempPhone(userPhone);
        setModalVisible(true);
    };

    const handleSaveProfile = async () => {
        if (tempName.trim().length === 0) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            // 1. Update Profile Info
            const profileData = {
                shippingMark: tempName,
                phone: tempPhone,

            };

            await axios_instance_token.patch(`/users/clients/${auth?.id}`, profileData);

            // Update local auth context
            dispatch({
                type: 'UPDATE_AUTH',
                payload: profileData
            });

            // 2. Handle Password Change if fields are entered
            if (currentPassword || newPassword || confirmPassword) {
                if (!currentPassword || !newPassword || !confirmPassword) {
                    Alert.alert('Error', 'Please fill in all password fields to change it');
                    setLoading(false);
                    return;
                }
                if (newPassword !== confirmPassword) {
                    Alert.alert('Error', 'New passwords do not match');
                    setLoading(false);
                    return;
                }
                if (newPassword.length < 6) {
                    Alert.alert('Error', 'Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                await axios_instance_token.post(`/users/password/${auth?.id}`, {
                    currentPassword,
                    newPassword,
                });

                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                Alert.alert('Success', 'Profile and Password updated successfully');
            } else {
                Alert.alert('Success', 'Profile updated successfully');
            }

            setModalVisible(false);
        } catch (error: any) {
            console.error('Update profile error:', error);
            const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { icon: 'description', title: 'Our Policies', description: 'Terms and company policies', route: '/(app)/policies' },
        { icon: 'lock-reset', title: 'Change Password', description: 'Reset your password', route: '/(app)/password' },
        { icon: 'location-on', title: 'Shipping Addresses', description: 'Manage your addresses', route: '/(app)/shipping-address' },
        { icon: 'payment', title: 'Payments', description: 'Payment methods & history', route: '/(app)/payments' },
        { icon: 'play-circle-outline', title: 'Videos', description: 'Tutorials and guides', route: '/(app)/videos' },

        // { icon: 'help-outline', title: 'Help & Support', description: 'Get help', route: '/(app)/support' },
        { icon: 'local-shipping', title: 'Deliveries', description: 'Track your deliveries', route: '/(app)/deliveries' },
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
                        <Text style={styles.title}>More</Text>
                    </View>

                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatar}>
                            <MaterialIcons name="person" size={36} color={colors.textSecondary} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{userName}</Text>
                        </View>
                        <TouchableOpacity onPress={openProfileModal}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuSection}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={styles.menuIconContainer}>
                                    <MaterialIcons name={item.icon as any} size={26} color={colors.primary} />
                                </View>
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Text style={styles.menuDescription}>{item.description}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity onPress={() => {
                        dispatch({ type: 'REMOVE_AUTH' });
                        // router.replace('/(onboarding)/welcome');
                        console.log('auth after remove', auth);
                    }}
                        style={styles.logoutButton}>
                        <MaterialIcons name="logout" size={20} color={colors.error} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    {/* Delete Account Button */}
                    <TouchableOpacity onPress={() => router.push('/(app)/delete-account')} style={styles.deleteButton}>
                        <MaterialIcons name="delete-forever" size={20} color={colors.error} />
                        <Text style={styles.deleteText}>Delete Account & Data</Text>
                    </TouchableOpacity>

                    {/* App Version */}
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                </ScrollView>
            </LinearGradient>

            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.centeredView}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.sectionHeader}>Personal Information</Text>
                                <Text style={styles.inputLabel}>Shipping Mark</Text>
                                <TextInput
                                    style={styles.input}
                                    value={tempName}
                                    onChangeText={setTempName}
                                    placeholder="Enter your shipping mark"
                                    editable={!loading}
                                />

                                <Text style={styles.inputLabel}>Phone</Text>
                                <TextInput
                                    style={styles.input}
                                    value={tempPhone}
                                    onChangeText={setTempPhone}
                                    placeholder="Enter your phone number"
                                    keyboardType="phone-pad"
                                    editable={!loading}
                                />


                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonCancel]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.textCancel}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSave, loading && styles.buttonDisabled]}
                                        onPress={handleSaveProfile}
                                        disabled={loading}
                                    >
                                        <Text style={styles.textSave}>{loading ? 'Saving...' : 'Save'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView >
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
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    header: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.5,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: spacing.lg,
        padding: spacing.lg,
        borderRadius: 16,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        elevation: 6,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    profileEmail: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    editButton: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    menuSection: {
        paddingHorizontal: spacing.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevation: 3,
    },
    menuIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 3,
        letterSpacing: -0.2,
    },
    menuDescription: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#FEF2F2',
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.error,
        boxShadow: `0 2px 4px ${colors.error}1A`,
        elevation: 2,
        gap: spacing.sm,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.error,
        letterSpacing: 0.3,
    },
    deleteButton: {
        flexDirection: 'row',
        backgroundColor: '#FEF2F2',
        marginHorizontal: spacing.lg,
        marginTop: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.error,
        boxShadow: `0 2px 4px ${colors.error}1A`,
        elevation: 2,
        gap: spacing.sm,
    },
    deleteText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.error,
        letterSpacing: 0.3,
    },
    versionText: {
        textAlign: 'center',
        marginTop: spacing.lg,
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    changePasswordText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 15,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 4,
        marginTop: 8,
    },
    helperText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        width: '90%',
        alignItems: 'stretch',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
        elevation: 5,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: colors.textPrimary,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        flex: 0.45,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonCancel: {
        backgroundColor: '#F3F4F6',
    },
    buttonSave: {
        backgroundColor: colors.primary,
    },
    textCancel: {
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    textSave: {
        color: 'white',
        fontWeight: 'bold',
    },
});

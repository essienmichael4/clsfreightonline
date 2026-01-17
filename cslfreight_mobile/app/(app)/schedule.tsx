import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';
import useAxiosToken from 'app/_hooks/useAxiosToken';

export default function ScheduleScreen() {
    const [shippingMark, setShippingMark] = useState('');
    const [requestType, setRequestType] = useState('Pickup');
    const [partyType, setPartyType] = useState('Self');
    const [loadingDate, setLoadingDate] = useState(new Date().toLocaleDateString());
    const [location, setLocation] = useState('');
    const axios_instance_token = useAxiosToken()
    const [callNumber, setCallNumber] = useState('');
    const [thirdPartyName, setThirdPartyName] = useState('');
    const [thirdPartyPhone, setThirdPartyPhone] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setLoadingDate(currentDate.toLocaleDateString());
    };

    const validateForm = () => {
        if (!shippingMark.trim()) {
            Alert.alert('Error', 'Shipping Mark is required');
            return false;
        }
        if (!loadingDate.trim()) {
            Alert.alert('Error', 'Loading Date is required');
            return false;
        }
        if (!location.trim()) {
            Alert.alert('Error', 'Location is required');
            return false;
        }
        if (!callNumber.trim()) {
            Alert.alert('Error', 'Call Number is required');
            return false;
        }
        if (partyType === 'third-party') {
            if (!thirdPartyName.trim()) {
                Alert.alert('Error', 'Third Party Name is required');
                return false;
            }
            if (!thirdPartyPhone.trim()) {
                Alert.alert('Error', 'Third Party Phone is required');
                return false;
            }
        }
        return true;
    };


    const handleSubmit = async () => {
        console.log("handleSubmit called");

        if (!validateForm()) {
            console.log("Form validation failed");
            return;
        }

        setLoading(true);
        setShowSuccessMessage(false); // Hide any existing success message

        try {
            console.log("Sending request to API...");
            const response = await axios_instance_token.post("/deliveries", {
                shippingMark,
                deliveryType: requestType,
                pickupBy: partyType,
                thirdPartyName: partyType === 'Third Party' ? thirdPartyName : '',
                thirdPartyPhone: partyType === 'Third Party' ? thirdPartyPhone : '',
                loadedDate: new Date().toISOString(),
                location,
                phone: callNumber,
            });

            console.log("API Response:", response.data);
            console.log("Request successful, showing success message...");

            // Show success message banner
            setShowSuccessMessage(true);

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);

            console.log("Resetting form fields...");
            // Reset form fields
            setShippingMark('');
            setRequestType('Pickup');
            setPartyType('Self');
            setLoadingDate(new Date().toLocaleDateString());
            setLocation('');
            setCallNumber('');
            setThirdPartyName('');
            setThirdPartyPhone('');
            setDate(new Date());
            console.log("Form reset complete");
        } catch (err: any) {
            console.error('Request failed:', err);
            console.error('Error response:', err.response?.data);

            let errorMessage = 'Delivery failed. Please try again.';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message === 'Network Error') {
                errorMessage = 'Network error. Please check your connection.';
            }

            Alert.alert('Error', errorMessage);
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
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Schedule Service</Text>
                        <Text style={styles.subtitle}>Book a pickup or delivery</Text>
                    </View>

                    {/* Success Message Banner */}
                    {showSuccessMessage && (
                        <View style={styles.successBanner}>
                            <MaterialIcons name="check-circle" size={24} color={colors.white} />
                            <Text style={styles.successText}>Request sent successfully!</Text>
                        </View>
                    )}

                    {/* Shipping Mark */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Shipping Mark *</Text>
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
                                    requestType === 'Pickup' && styles.optionButtonActive,
                                ]}
                                onPress={() => setRequestType('Pickup')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        requestType === 'Pickup' && styles.optionButtonTextActive,
                                    ]}
                                >
                                    Pickup
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    requestType === 'Delivery' && styles.optionButtonActive,
                                ]}
                                onPress={() => setRequestType('Delivery')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        requestType === 'Delivery' && styles.optionButtonTextActive,
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
                                    partyType === 'Self' && styles.optionButtonActive,
                                ]}
                                onPress={() => setPartyType('Self')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        partyType === 'Self' && styles.optionButtonTextActive,
                                    ]}
                                >
                                    Self
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    partyType === 'Third Party' && styles.optionButtonActive,
                                ]}
                                onPress={() => setPartyType('Third Party')}
                            >
                                <Text
                                    style={[
                                        styles.optionButtonText,
                                        partyType === 'Third Party' && styles.optionButtonTextActive,
                                    ]}
                                >
                                    Third Party
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* Third Party Details */}
                        {partyType === 'Third Party' && (
                            <View style={styles.section}>
                                <Text style={styles.label}>Third Party Name *</Text>
                                <View style={[styles.inputWrapper, { marginBottom: spacing.md }]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter third party name"
                                        placeholderTextColor={colors.textSecondary}
                                        value={thirdPartyName}
                                        onChangeText={setThirdPartyName}
                                    />
                                </View>

                                <Text style={styles.label}>Third Party Phone Number *</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter third party phone"
                                        placeholderTextColor={colors.textSecondary}
                                        value={thirdPartyPhone}
                                        onChangeText={setThirdPartyPhone}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Loading Date */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Loading Date *</Text>
                        <TouchableOpacity
                            style={styles.inputWrapper}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <MaterialIcons name="event" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <Text style={[styles.inputPlaceholder, loadingDate ? { color: colors.textPrimary } : {}]}>
                                {loadingDate || 'Select loading date'}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Location *</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="location-on" size={20} color={colors.textSecondary} style={styles.inputIcon} />
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
                        <Text style={styles.label}>Call Number *</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="phone" size={20} color={colors.textSecondary} style={styles.inputIcon} />
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
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView >
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
    successBanner: {
        backgroundColor: '#10B981',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    successText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
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
    submitButtonDisabled: {
        backgroundColor: colors.textSecondary,
        opacity: 0.6,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});



import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [trackingNumbers, setTrackingNumbers] = useState('');

  const handleTrack = () => {
    // Parse tracking numbers (split by comma, enter, or tab)
    const numbers = trackingNumbers
      .split(/[,\n\t]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0);

    if (numbers.length === 0) {
      // TODO: Show error message
      console.log('Please enter at least one tracking number');
      return;
    }

    if (numbers.length > 10) {
      // TODO: Show error message
      console.log('Maximum 10 tracking numbers allowed');
      return;
    }

    // Navigate to tracking results screen
    router.push({
      pathname: '/(onboarding)/tracking-results',
      params: { numbers: numbers.join(',') }
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


          {/* Container Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../src/assets/welcome2.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          {/* Main Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.headingLineOne}>Streamline your</Text>
            <Text style={styles.headingLineTwo}>shipment process</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Manage your cargo with advanced tracking and reliable delivery all in one platform.
          </Text>

          {/* Tracking Input */}
          <View style={styles.trackingSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Track Shipment</Text>
              <View style={styles.inputRow}>
                <View style={styles.textInputWrapper}>
                  <Text style={styles.inputIcon}>📦</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter tracking numbers"
                    placeholderTextColor={colors.textSecondary}
                    value={trackingNumbers}
                    onChangeText={setTrackingNumbers}
                    multiline
                    numberOfLines={2}
                    onSubmitEditing={handleTrack}
                    blurOnSubmit={false}
                  />
                </View>
                <TouchableOpacity
                  style={styles.trackButton}
                  activeOpacity={0.8}
                  onPress={handleTrack}
                >
                  <Text style={styles.trackButtonText}>Track</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.helperText}>
              Enter your full tracking number or numbers in the input above to track separated by , or enter or tab. (Max of 10 tracking numbers)
            </Text>
          </View>

          {/* Auth Buttons */}
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={() => router.push('/(onboarding)/login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              activeOpacity={0.8}
              onPress={() => router.push('/(onboarding)/signup')}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: spacing.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  labelText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  illustrationContainer: {
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  headingContainer: {
    marginBottom: spacing.md,
  },
  headingLineOne: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    lineHeight: typography.h1.lineHeight,
  },
  headingLineTwo: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
    lineHeight: typography.h1.lineHeight,
  },
  headingLineThree: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    lineHeight: typography.h1.lineHeight,
  },
  description: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textSecondary,
    lineHeight: typography.body.lineHeight,
    marginBottom: spacing.lg,
  },
  trackingSection: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  textInputWrapper: {
    flex: 1,
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
    fontSize: 20,
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 40,
  },
  trackButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
  },
  trackButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: spacing.xs,
  },
  authButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  loginButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  signupButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.darkGray,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});

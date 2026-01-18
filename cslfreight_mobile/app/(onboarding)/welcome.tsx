import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
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
            <ContainerIllustration />
          </View>

          {/* Main Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.headingLineOne}>Streamline your</Text>
            <Text style={styles.headingLineTwo}>shipment</Text>
            <Text style={styles.headingLineThree}>process</Text>
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

// Container Illustration Component
function ContainerIllustration() {
  return (
    <View style={styles.svgContainer}>
      {/* Simplified container SVG-like illustration */}
      <View style={styles.containerMain}>
        {/* Container corners */}
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />

        {/* Container sides */}
        <View style={styles.containerSide} />
        <View style={styles.containerBack} />

        {/* Vertical lines on container */}
        <View style={styles.verticalLine1} />
        <View style={styles.verticalLine2} />
        <View style={styles.verticalLine3} />
        <View style={styles.verticalLine4} />

        {/* Horizontal lines on container */}
        <View style={styles.horizontalLine1} />
        <View style={styles.horizontalLine2} />
        <View style={styles.horizontalLine3} />

        {/* CSL Logo - White curved lines */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCurve1} />
          <View style={styles.logoCurve2} />
        </View>

        {/* Crane hook */}
        <View style={styles.craneHook} />
      </View>
    </View>
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
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerMain: {
    width: width * 0.6,
    height: height * 0.3,
    position: 'relative',
  },
  // Container main body (green container)
  containerSide: {
    position: 'absolute',
    width: width * 0.55,
    height: height * 0.22,
    left: 0,
    top: height * 0.08,
    backgroundColor: colors.primary,
    borderRadius: 8,
    opacity: 0.95,
  },
  containerBack: {
    position: 'absolute',
    width: width * 0.5,
    height: height * 0.18,
    left: width * 0.04,
    top: height * 0.12,
    backgroundColor: 'rgba(29, 184, 84, 0.6)',
    borderRadius: 6,
  },
  // Vertical lines (corrugated container effect)
  verticalLine1: {
    position: 'absolute',
    width: 3,
    height: height * 0.2,
    left: width * 0.1,
    top: height * 0.09,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  verticalLine2: {
    position: 'absolute',
    width: 3,
    height: height * 0.2,
    left: width * 0.18,
    top: height * 0.09,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  verticalLine3: {
    position: 'absolute',
    width: 3,
    height: height * 0.2,
    left: width * 0.26,
    top: height * 0.09,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  verticalLine4: {
    position: 'absolute',
    width: 3,
    height: height * 0.2,
    left: width * 0.34,
    top: height * 0.09,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  // Horizontal lines (container details)
  horizontalLine1: {
    position: 'absolute',
    width: width * 0.45,
    height: 2,
    left: width * 0.06,
    top: height * 0.14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  horizontalLine2: {
    position: 'absolute',
    width: width * 0.45,
    height: 2,
    left: width * 0.06,
    top: height * 0.19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  horizontalLine3: {
    position: 'absolute',
    width: width * 0.45,
    height: 2,
    left: width * 0.06,
    top: height * 0.24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  // CSL Logo (two white curves)
  logoContainer: {
    position: 'absolute',
    left: width * 0.38,
    top: height * 0.1,
    width: width * 0.15,
    height: height * 0.15,
  },
  logoCurve1: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: colors.white,
    left: 0,
    top: 0,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  logoCurve2: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: colors.white,
    left: 20,
    top: 20,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  // Crane hook at top
  craneHook: {
    position: 'absolute',
    width: 40,
    height: 40,
    left: width * 0.27,
    top: -20,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderLeftColor: colors.textSecondary,
    borderBottomColor: colors.textSecondary,
    borderRadius: 8,
  },
  cornerTopLeft: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 15,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderTopColor: colors.primary,
    left: -2,
    top: height * 0.07,
    opacity: 0.8,
  },
  cornerTopRight: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    right: -2,
    top: height * 0.07,
    opacity: 0.8,
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

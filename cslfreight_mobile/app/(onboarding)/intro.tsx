import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';
import introImage from '@/assets/intro1.jpg';
import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';

const { width, height } = Dimensions.get('window');
const SLIDER_WIDTH = width - spacing.lg * 2;
const THUMB_SIZE = 60;

export default function IntroScreen() {
  const router = useRouter();
  useAndroidBackButton();
  const [sliderActive, setSliderActive] = useState(false);
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setSliderActive(true);
      },
      onPanResponderMove: (evt, { dx }) => {
        const maxDrag = SLIDER_WIDTH - THUMB_SIZE;
        const newValue = Math.max(0, Math.min(dx, maxDrag));
        pan.setValue(newValue);
      },
      onPanResponderRelease: (evt, { dx }) => {
        const maxDrag = SLIDER_WIDTH - THUMB_SIZE;

        if (dx > maxDrag * 0.85) {
          // Completed swipe
          Animated.spring(pan, {
            toValue: maxDrag,
            useNativeDriver: false,
          }).start(() => {
            router.replace('/(onboarding)/welcome');
          });
        } else {
          // Reset
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start(() => {
            setSliderActive(false);
          });
        }
      },
    })
  ).current;

  const thumbPosition = pan.interpolate({
    inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
    outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
    extrapolate: 'clamp',
  });

  const sliderOpacity = pan.interpolate({
    inputRange: [0, (SLIDER_WIDTH - THUMB_SIZE) * 0.5],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={introImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay for Readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Spacer to push content down (since image is background) */}
            <View style={styles.spacer} />

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Easy Shipping,</Text>
              <Text style={styles.titleHighlight}>Smarter Business</Text>
              <Text style={styles.subtitle}>
                Smart shipping saves time, cuts costs, and accelerates business growth.
              </Text>
            </View>

            {/* Swipe Slider */}
            <View style={styles.sliderContainer}>
              <View
                style={[styles.sliderBackground]}
                {...panResponder.panHandlers}
              >
                {/* Slider Text */}
                <Animated.View style={[styles.sliderText, { opacity: sliderOpacity }]}>
                  <Text style={styles.sliderTextContent}>Swipe To Shipping →</Text>
                </Animated.View>

                {/* Thumb/Button */}
                <Animated.View
                  style={[
                    styles.sliderThumb,
                    { transform: [{ translateX: thumbPosition }] },
                  ]}
                >
                  <LinearGradient
                    colors={[colors.primary, '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.thumbGradient}
                  >
                    <Text style={styles.thumbIcon}>●</Text>
                  </LinearGradient>
                </Animated.View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 9,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    justifyContent: 'flex-end', // Align content to bottom
  },
  spacer: {
    flex: 0.2, // Create space at top to push button and text down (consistent on web and mobile)
  },
  textContainer: {
    marginBottom: spacing.xl,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white, // Changed to white for visibility
    lineHeight: 44,
  },
  titleHighlight: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F59E0B',
    lineHeight: 44,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)', // Lighter white transparency
    lineHeight: 24,
  },
  sliderContainer: {
    marginBottom: spacing.lg,
  },
  sliderBackground: {
    height: THUMB_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // More transparent for overlay feel
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  sliderText: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  sliderTextContent: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  sliderThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: THUMB_SIZE / 2,
  },
  thumbIcon: {
    fontSize: 24,
    color: colors.white,
  },
});

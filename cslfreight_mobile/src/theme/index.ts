export const colors = {
  primary: '#2563EB', // Blue
  secondary: '#1E40AF', // Darker blue
  dark: '#FFFFFF', // White background
  darkGray: '#F3F4F6', // Light gray
  white: '#FFFFFF',
  lightGray: '#E5E7EB',
  textPrimary: '#111827', // Dark gray/black for text
  textSecondary: '#6B7280', // Medium gray for secondary text
  border: '#D1D5DB', // Light border
  success: '#10B981', // Green for success states
  warning: '#F59E0B', // Orange for warnings
  error: '#EF4444', // Red for errors
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

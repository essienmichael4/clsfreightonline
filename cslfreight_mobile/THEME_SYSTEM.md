# Theme System Implementation Guide

## Overview
Your app now has a complete light/dark mode theming system. Users can toggle between light and dark modes from the "More" screen.

## Features
- ✅ Light and Dark mode support
- ✅ User preference persistence (saved to AsyncStorage)
- ✅ System theme detection (falls back to system theme if not set)
- ✅ Theme toggle in "More" screen
- ✅ Easy to apply to all screens

## How to Use in Your Screens

### 1. Import the theme utilities and hook
```typescript
import { getColors, spacing, typography, borderRadius } from '@/theme';
import { useTheme } from '../_hooks/useTheme';
```

### 2. Get current theme colors in your component
```typescript
export default function YourScreen() {
    const { mode } = useTheme();
    const colors = getColors(mode);
    
    return (
        <View style={{ backgroundColor: colors.background }}>
            <Text style={{ color: colors.textPrimary }}>Your content</Text>
        </View>
    );
}
```

### 3. Update StyleSheet to use dynamic colors
Replace hardcoded colors with theme colors:

**Before:**
```typescript
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    text: {
        color: '#111827',
    }
});
```

**After:**
```typescript
// Define styles function outside component (for performance)
const getStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
    },
    text: {
        color: colors.textPrimary,
    }
});

// Use in component
export default function YourScreen() {
    const { mode } = useTheme();
    const colors = getColors(mode);
    const styles = getStyles(colors);
    
    return <View style={styles.container}>...</View>;
}
```

## Available Colors

### Light Mode Colors
```typescript
lightColors = {
  primary: '#2563EB',           // Blue
  secondary: '#1E40AF',         // Darker blue
  background: '#FFFFFF',        // Main background
  surface: '#F9FAFB',           // Card/surface background
  white: '#FFFFFF',
  lightGray: '#E5E7EB',
  textPrimary: '#111827',       // Main text
  textSecondary: '#6B7280',     // Secondary text
  border: '#D1D5DB',            // Border color
  success: '#10B981',           // Success state
  warning: '#F59E0B',           // Warning state
  error: '#EF4444',             // Error state
}
```

### Dark Mode Colors
```typescript
darkColors = {
  primary: '#3B82F6',           // Lighter blue
  secondary: '#60A5FA',         // Even lighter blue
  background: '#111827',        // Main background
  surface: '#1F2937',           // Card/surface background
  white: '#F9FAFB',
  lightGray: '#374151',
  textPrimary: '#F9FAFB',       // Main text
  textSecondary: '#D1D5DB',     // Secondary text
  border: '#4B5563',            // Border color
  success: '#10B981',           // Success state (unchanged)
  warning: '#F59E0B',           // Warning state (unchanged)
  error: '#EF4444',             // Error state (unchanged)
}
```

## Theme Hook

The `useTheme()` hook provides:
```typescript
{
    mode: 'light' | 'dark',        // Current theme mode
    setMode: (mode) => void,       // Set specific mode
    toggleTheme: () => void,       // Toggle between modes
    isLoading: boolean             // Loading state (theme being fetched)
}
```

## Implementation Checklist for All Screens

To apply the theme system to all screens, follow these steps:

1. **Import the utilities**
   - Import `useTheme` hook
   - Import `getColors` function

2. **Get theme colors**
   - Call `const { mode } = useTheme()`
   - Call `const colors = getColors(mode)`

3. **Update StyleSheets**
   - Create `getStyles` function that takes colors as parameter
   - Call `getStyles(colors)` in your component

4. **Replace hardcoded colors**
   - Background colors → `colors.background` or `colors.surface`
   - Text colors → `colors.textPrimary` or `colors.textSecondary`
   - Borders → `colors.border`
   - Accent colors → `colors.primary` or `colors.secondary`

## Example Full Implementation

```typescript
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../_hooks/useTheme';
import { getColors, spacing } from '@/theme';

const getStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: '700',
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    card: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: spacing.md,
        margin: spacing.md,
    }
});

export default function MyScreen() {
    const { mode } = useTheme();
    const colors = getColors(mode);
    const styles = getStyles(colors);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Dark mode supported</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.subtitle}>This is a card</Text>
            </View>
        </ScrollView>
    );
}
```

## LinearGradient Updates

For screens using `expo-linear-gradient`, update gradient colors:

```typescript
const { mode } = useTheme();
const colors = getColors(mode);

<LinearGradient
    colors={[colors.background, colors.surface]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1 }}
>
```

## Tips & Best Practices

1. **Performance**: Define `getStyles` outside the component if possible
2. **Consistency**: Always use `colors.textPrimary` for main text
3. **Borders**: Use `colors.border` for all borders
4. **Cards/Surfaces**: Use `colors.surface` instead of `colors.background`
5. **Status colors**: Use `success`, `warning`, `error` - these don't change between modes
6. **Avoid hardcoding**: Never use hardcoded color values in StyleSheets

## Testing the Theme

1. Go to the "More" screen
2. Find the "Theme" option
3. Toggle the switch to change between Light and Dark modes
4. The change is instantly applied and persisted

## Current Implementation Status

✅ Theme system created  
✅ Theme context with persistence  
✅ useTheme hook  
✅ Light/Dark color palettes  
✅ Theme toggle in "More" screen  
📝 TODO: Apply theme to all other screens

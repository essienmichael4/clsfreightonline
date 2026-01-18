import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function VideosScreen() {
    const router = useRouter();

    const videoCategories = [
        {
            category: 'Getting Started',
            videos: [
                { id: '1', title: 'How to Track Your Package', duration: '3:45', thumbnail: '📦' },
                { id: '2', title: 'Creating Your First Shipment', duration: '5:20', thumbnail: '✈️' },
            ],
        },
        {
            category: 'Payments & Billing',
            videos: [
                { id: '3', title: 'Adding Payment Methods', duration: '2:30', thumbnail: '💳' },
                { id: '4', title: 'Understanding Your Invoice', duration: '4:15', thumbnail: '📄' },
            ],
        },
        {
            category: 'Shipping Tips',
            videos: [
                { id: '5', title: 'Packaging Best Practices', duration: '6:00', thumbnail: '📦' },
                { id: '6', title: 'International Shipping Guide', duration: '8:30', thumbnail: '🌍' },
            ],
        },
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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Tutorial Videos</Text>
                        <Text style={styles.subtitle}>Learn how to use our platform</Text>
                    </View>

                    {videoCategories.map((cat, index) => (
                        <View key={index} style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>{cat.category}</Text>
                            {cat.videos.map((video) => (
                                <TouchableOpacity key={video.id} style={styles.videoCard}>
                                    <View style={styles.thumbnail}>
                                        <Text style={styles.thumbnailIcon}>{video.thumbnail}</Text>
                                        <View style={styles.playButton}>
                                            <Text style={styles.playIcon}>▶️</Text>
                                        </View>
                                    </View>
                                    <View style={styles.videoInfo}>
                                        <Text style={styles.videoTitle}>{video.title}</Text>
                                        <Text style={styles.videoDuration}>🕐 {video.duration}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.dark },
    gradient: { flex: 1 },
    content: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
    header: { marginBottom: spacing.xl },
    backButton: { marginBottom: spacing.md },
    backText: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
    title: { fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight, color: colors.textPrimary, marginBottom: spacing.xs },
    subtitle: { fontSize: typography.body.fontSize, color: colors.textSecondary },
    categorySection: { marginBottom: spacing.lg },
    categoryTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
    videoCard: { flexDirection: 'row', backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
    thumbnail: { width: 100, height: 70, borderRadius: borderRadius.md, backgroundColor: colors.darkGray, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md, position: 'relative' },
    thumbnailIcon: { fontSize: 32 },
    playButton: { position: 'absolute', width: 32, height: 32, borderRadius: borderRadius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    playIcon: { fontSize: 12 },
    videoInfo: { flex: 1, justifyContent: 'center' },
    videoTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
    videoDuration: { fontSize: 12, color: colors.textSecondary },
});

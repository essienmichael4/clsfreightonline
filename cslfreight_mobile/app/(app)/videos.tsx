import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';
import useVideos from 'app/_hooks/useVideos';
import { useState } from 'react';
import type { Video } from '@/types';

export default function VideosScreen() {
    const [search, setSearch] = useState('');
    const { videos, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useVideos(20, search);
    const router = useRouter();

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const renderVideoItem = ({ item }: { item: Video }) => (
        <TouchableOpacity
            style={styles.videoCard}
            onPress={() => router.push(`/(app)/${item.key}`)}
        >
            <View style={styles.thumbnail}>
                {item.thumbnail ? (
                    <Image source={{ uri: item.thumbnail }} style={styles.thumbnailImage} />
                ) : (
                    <MaterialIcons name="video-library" size={40} color={colors.primary} />
                )}
                <View style={styles.playButton}>
                    <MaterialIcons name="play-arrow" size={24} color={colors.white} />
                </View>
            </View>
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                    {item.title || 'Untitled Video'}
                </Text>
                {item.description && (
                    <Text style={styles.videoDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                )}
                <View style={styles.metaContainer}>
                    {item.viewsCount !== undefined && (
                        <View style={styles.metaItem}>
                            <MaterialIcons name="visibility" size={14} color={colors.textSecondary} />
                            <Text style={styles.metaText}>{item.viewsCount} views</Text>
                        </View>
                    )}
                    {item.likesCount !== undefined && (
                        <View style={styles.metaItem}>
                            <MaterialIcons name={item.userLiked ? "favorite" : "favorite-border"} size={14} color={item.userLiked ? colors.primary : colors.textSecondary} />
                            <Text style={styles.metaText}>{item.likesCount}</Text>
                        </View>
                    )}
                </View>
                {item.uploader && (
                    <Text style={styles.uploaderText}>
                        By {item.uploader.name || item.uploader.email}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.emptyText}>Loading videos...</Text>
                </View>
            );
        }
        return (
            <View style={styles.centerContainer}>
                <MaterialIcons name="video-library" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No videos available</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.white, colors.darkGray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity> */}
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Tutorial Videos</Text>
                        <Text style={styles.subtitle}>Learn how to use our platform</Text>
                    </View>
                </View>

                <FlatList
                    data={videos}
                    renderItem={renderVideoItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                />
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark
    },
    gradient: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.md
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.xs
    },
    subtitle: {
        fontSize: typography.body.fontSize,
        color: colors.textSecondary
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl
    },
    videoCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        elevation: 2,
    },
    thumbnail: {
        width: 120,
        height: 90,
        borderRadius: borderRadius.md,
        backgroundColor: colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        position: 'relative',
        overflow: 'hidden',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    playButton: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    videoInfo: {
        flex: 1,
        justifyContent: 'center'
    },
    videoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4
    },
    videoDescription: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 6,
        lineHeight: 18,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    uploaderText: {
        fontSize: 11,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    footer: {
        paddingVertical: spacing.lg,
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing.xxl * 2,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
});

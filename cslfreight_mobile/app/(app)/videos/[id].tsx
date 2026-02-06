import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import { Video as VideoType } from 'app/_lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState, useEffect } from 'react';
import useAxiosToken from 'app/_hooks/useAxiosToken';
import useAuth from 'app/_hooks/useAuth';

export default function VideoPlayerScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const axios_instance_token = useAxiosToken()
    const { auth } = useAuth();

    const baseURL = axios_instance_token.defaults.baseURL;

    const { data: video, isLoading, isError } = useQuery<VideoType>({
        queryKey: ["video", id],
        queryFn: async () => {
            const res = await axios_instance_token.get(`/videos/${id}/client`);
            console.log(res.data)
            return res.data;
        },
        enabled: !!id,

    });

    const token = auth?.backendTokens?.accessToken;

    // Debug logs
    useEffect(() => {
        console.log("Auth Token present:", !!token);
        console.log("Video ID:", id);
    }, [token, id]);

    // Construct the full S3 URL from the key path
    const videoUrl = `${baseURL}/videos/stream/${id}`;

    useEffect(() => {
        if (token) console.log("Video URL constructed:", videoUrl);
    }, [videoUrl, token]);

    const player = useVideoPlayer(videoUrl && token ? {
        uri: videoUrl,
        headers: {
            Authorization: `Bearer ${token}`
        }
    } : null, (player) => {
        player.loop = true;
        player.play();
    });

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: spacing.lg }]}>
                    <MaterialIcons name="error-outline" size={64} color={colors.textSecondary} />
                    <Text style={styles.noVideoText}>Failed to load video</Text>
                    <Text style={{ color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }}>
                        Video not found. Please go back and try again.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginTop: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.primary, borderRadius: 8 }}
                    >
                        <Text style={{ color: colors.white, fontWeight: '600' }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }


    const handleBack = () => {
        if (player) {
            player.pause();
        }
        router.navigate('/(app)/videos');
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.white, colors.darkGray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {video?.title || 'Video Player'}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Video Player */}
                <View style={styles.videoContainer}>
                    {videoUrl && token ? (
                        <VideoView
                            player={player}
                            style={styles.video}
                            contentFit="contain"
                            nativeControls
                        />
                    ) : (
                        <View style={styles.noVideo}>
                            {(!videoUrl) ? (
                                <>
                                    <MaterialIcons name="videocam-off" size={64} color={colors.textSecondary} />
                                    <Text style={styles.noVideoText}>Video not available</Text>
                                </>
                            ) : (
                                <ActivityIndicator size="large" color={colors.primary} />
                            )}
                        </View>
                    )}
                </View>

                {/* Video Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{video?.title || 'Untitled Video'}</Text>

                    {video?.description && (
                        <Text style={styles.description}>{video.description}</Text>
                    )}

                    <View style={styles.statsContainer}>
                        {video?.viewsCount !== undefined && (
                            <View style={styles.statItem}>
                                <MaterialIcons name="visibility" size={20} color={colors.textSecondary} />
                                <Text style={styles.statText}>{video.viewsCount} views</Text>
                            </View>
                        )}
                        {video?.likesCount !== undefined && (
                            <View style={styles.statItem}>
                                <MaterialIcons
                                    name={video.userLiked ? "favorite" : "favorite-border"}
                                    size={20}
                                    color={video.userLiked ? colors.primary : colors.textSecondary}
                                />
                                <Text style={styles.statText}>{video.likesCount}</Text>
                            </View>
                        )}
                        {video?.createdAt && (
                            <View style={styles.statItem}>
                                <MaterialIcons name="calendar-today" size={20} color={colors.textSecondary} />
                                <Text style={styles.statText}>
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {video?.uploader && (
                        <View style={styles.uploaderContainer}>
                            <MaterialIcons name="person" size={24} color={colors.primary} />
                            <View style={styles.uploaderInfo}>
                                <Text style={styles.uploaderLabel}>Uploaded by</Text>
                                <Text style={styles.uploaderName}>
                                    {video.uploader.name || video.uploader.email}
                                </Text>
                            </View>
                        </View>
                    )}

                    {video?.tags && video.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {video.tags.map((tag: string, index: number) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </LinearGradient>
        </SafeAreaView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginTop: Platform.OS === 'android' ? spacing.sm : 0,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
        marginHorizontal: spacing.md,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        overflow: 'hidden',     // <-- IMPORTANT
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: '100%',
    },

    noVideo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.darkGray,
    },
    noVideoText: {
        marginTop: spacing.md,
        fontSize: 16,
        color: colors.textSecondary,
    },
    infoContainer: {
        flex: 1,
        padding: spacing.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    uploaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: spacing.md,
    },
    uploaderInfo: {
        marginLeft: spacing.md,
    },
    uploaderLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    uploaderName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    tag: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tagText: {
        fontSize: 12,
        color: colors.textPrimary,
        fontWeight: '500',
    },
});
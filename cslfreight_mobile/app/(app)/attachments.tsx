import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { downloadAsync, cacheDirectory } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { colors, spacing, typography, borderRadius } from '@/theme';

import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';
import { Attachment } from '@/types';
import { useQuery } from '@tanstack/react-query';
import useAxiosToken from 'app/_hooks/useAxiosToken';
import useAuth from 'app/_hooks/useAuth';

export default function AttachmentsScreen() {
    useAndroidBackButton();
    const [page, setPage] = useState(1);
    const limit = 10;

    const [downloadingId, setDownloadingId] = useState<number | null>(null);


     const axios_instance_token = useAxiosToken()
     const {auth} = useAuth();
    const {data: attachments = [], isLoading} = useQuery<Attachment[]>({
        queryKey: ["attachments", auth?.id],
        queryFn: async() => await axios_instance_token.get(`/users/clients/${auth?.id}/attachments`).then(res => res.data)
    })

    // Frontend Pagination Logic
    const totalItems = attachments.length;
    const pageCount = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAttachments = attachments.slice(startIndex, endIndex);
    
    const meta = {
        page,
        pageCount,
        hasPreviousPage: page > 1,
        hasNextPage: page < pageCount,
    };





    const handleDownload = async (attachment: Attachment) => {
        try {
            setDownloadingId(attachment.id);
            
            // Extract filename from URL or use a default
            const urlParts = attachment.imageUrl.split('/');
            const filename = urlParts[urlParts.length - 1] || `invoice-${attachment.id}`;
            
            // Create a file path in the documents directory
            const fileUri = `${cacheDirectory}${filename}`;
            
            // Download the file
            const downloadResult = await downloadAsync(
                attachment.imageUrl,
                fileUri
            );

            if (downloadResult.status === 200) {
                // Share the downloaded file
                await Sharing.shareAsync(downloadResult.uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: `Share ${attachment.name}`,
                });
            } else {
                Alert.alert('Error', 'Failed to download the file');
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Could not download the attachment');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleNextPage = () => {
        if (meta?.hasNextPage) {
            setPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (meta?.hasPreviousPage) {
            setPage(prev => prev - 1);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
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
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <MaterialIcons name="attach-file" size={32} color={colors.primary} />
                        <View style={styles.headerText}>
                            <Text style={styles.title}>MY ATTACHMENTS</Text>
                            <Text style={styles.subtitle}>Download your invoices</Text>
                        </View>
                    </View>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : attachments?.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="inbox" size={60} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No attachments yet</Text>
                        <Text style={styles.emptySubtext}>
                            Your invoices will appear here
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {paginatedAttachments?.map((attachment) => (
                            <View
                                key={attachment.id}
                                style={styles.attachmentCard}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconWrapper}>
                                        <MaterialIcons
                                            name="picture-as-pdf"
                                            size={32}
                                            color={colors.error}
                                        />
                                    </View>
                                    <View style={styles.attachmentInfo}>
                                        <Text
                                            style={styles.attachmentName}
                                            numberOfLines={2}
                                        >
                                            {attachment.name}
                                        </Text>
                                        <Text style={styles.attachmentDate}>
                                            {formatDate(attachment.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.downloadButton,
                                        downloadingId === attachment.id && styles.downloadingButton,
                                    ]}
                                    onPress={() => handleDownload(attachment)}
                                    disabled={downloadingId === attachment.id}
                                >
                                    {downloadingId === attachment.id ? (
                                        <ActivityIndicator
                                            size="small"
                                            color={colors.white}
                                        />
                                    ) : (
                                        <>
                                            <MaterialIcons
                                                name="download"
                                                size={20}
                                                color={colors.white}
                                            />
                                            <Text style={styles.downloadButtonText}>
                                                Download
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                )}

                {/* Pagination Controls */}
                {attachments.length > 0 && (
                    <View style={styles.pagination}>
                        <TouchableOpacity
                            style={[
                                styles.pageButton,
                                !meta?.hasPreviousPage && styles.disabledButton,
                            ]}
                            onPress={handlePrevPage}
                            disabled={!meta?.hasPreviousPage}
                        >
                            <MaterialIcons name="arrow-back" size={18} color={colors.white} />
                            <Text style={styles.pageButtonText}>Previous</Text>
                        </TouchableOpacity>
                        <Text style={styles.pageText}>
                            Page {meta?.page || 1} of {meta?.pageCount || 1}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.pageButton,
                                !meta?.hasNextPage && styles.disabledButton,
                            ]}
                            onPress={handleNextPage}
                            disabled={!meta?.hasNextPage}
                        >
                            <Text style={styles.pageButtonText}>Next</Text>
                            <MaterialIcons name="arrow-forward" size={18} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                )}
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
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.white,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: spacing.md,
        flex: 1,
    },
    title: {
        fontSize: typography.h2.fontSize,
        fontWeight: typography.h2.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.bodySmall.fontSize,
        color: colors.textSecondary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    emptyText: {
        fontSize: typography.h3.fontSize,
        fontWeight: typography.h3.fontWeight,
        color: colors.textPrimary,
        marginTop: spacing.md,
    },
    emptySubtext: {
        fontSize: typography.bodySmall.fontSize,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    attachmentCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.md,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    attachmentInfo: {
        flex: 1,
    },
    attachmentName: {
        fontSize: typography.body.fontSize,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    attachmentDate: {
        fontSize: typography.caption.fontSize,
        color: colors.textSecondary,
    },
    downloadButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        minWidth: 120,
        justifyContent: 'center',
    },
    downloadingButton: {
        opacity: 0.7,
    },
    downloadButtonText: {
        color: colors.white,
        fontSize: typography.bodySmall.fontSize,
        fontWeight: '600',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    pageButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    disabledButton: {
        backgroundColor: colors.lightGray,
        opacity: 0.5,
    },
    pageButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: typography.bodySmall.fontSize,
    },
    pageText: {
        color: colors.textPrimary,
        fontWeight: '600',
        fontSize: typography.bodySmall.fontSize,
    },
});

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Trash2, Edit3, X, Save } from "lucide-react";
import useAxiosToken from "@/hooks/useAxiosToken";
import type { Comment } from "@/lib/types";
import CommentForm from "./CommentForm";
import { toast } from "sonner";
import axios from "axios";

interface Props {
    comment: Comment;
    videoId: number;
    clientId?: number;
    userId?: number;
}

const CommentItem = ({ comment, videoId, clientId, userId }: Props) => {
    const axios_instance_token = useAxiosToken();
    const queryClient = useQueryClient();

    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const authorName = comment.user?.name || comment.client?.name || comment.client?.email || "Anonymous";
    const isOwner =
        clientId === comment.client?.id

    // === Reply mutation ===
    const replyMutation = useMutation({
        mutationFn: async () => {
        toast.loading("Replying to comment...", { id: "add-comment" });
        const res = await axios_instance_token.post(
            `/videos/${videoId}/comments/admin`,
            { content: replyText, parentId: comment.id }
        );
        return res.data;
        },
        onSuccess: () => {
        toast.success("Reply successful", { id: "add-comment" });
        setReplyText("");
        setShowReply(false);
        queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
        },
        onError: (err: any) => {
        if (axios.isAxiosError(err)) {
            toast.error(err?.response?.data?.message, { id: "add-comment" });
        } else {
            toast.error(`Something went wrong`, { id: "add-comment" });
        }
        },
    });

    // === Delete mutation ===
    const deleteMutation = useMutation({
        mutationFn: async () => {
            toast.loading("Deleting comment...", { id: "delete-comment" });
            await axios_instance_token.delete(`/videos/${videoId}/comments/${comment.id}/client`, {
                data: { author: { clientId } },
            });
        },
        onSuccess: () => {
            toast.success("Comment deleted!", { id: "delete-comment" });
            queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
        },
        onError: (err: any) => {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message, { id: "delete-comment" });
            } else {
                toast.error(`Something went wrong`, { id: "delete-comment" });
            }
        },
    });

    // === Edit mutation ===
    const editMutation = useMutation({
        mutationFn: async () => {
            toast.loading("Saving changes...", { id: "edit-comment" });
            const res = await axios_instance_token.patch(
                `/videos/${videoId}/comments/${comment.id}/client`,
                { content: editText }
            );
            return res.data;
        },
        onSuccess: () => {
            toast.success("Comment updated!", { id: "edit-comment" });
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
        },
        onError: (err: any) => {
            if (axios.isAxiosError(err)) {
                toast.error(err?.response?.data?.message, { id: "edit-comment" });
            } else {
                toast.error(`Something went wrong`, { id: "edit-comment" });
            }
        },
    });

    return (
        <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
            <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 mt-1">
                    {authorName ?? "Anonymous"} •{" "}
                    {new Date(comment.createdAt as string).toLocaleString()}
                </div>
                <div className="flex gap-3">
                    {!comment.parentId && (
                        <button
                        onClick={() => setShowReply(!showReply)}
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                        >
                        <MessageSquare size={12} /> Reply
                        </button>
                    )}

                    {isOwner && (
                        <>
                        {!isEditing ? (
                            <button
                            onClick={() => setIsEditing(true)}
                            className="text-xs text-green-500 hover:underline flex items-center gap-1"
                            >
                            <Edit3 size={12} /> Edit
                            </button>
                        ) : (
                            <button
                            onClick={() => setIsEditing(false)}
                            className="text-xs text-gray-400 hover:underline flex items-center gap-1"
                            >
                            <X size={12} /> Cancel
                            </button>
                        )}

                        <button
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                            className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                        </>
                    )}
                </div>
            </div>

            {/* Comment Content / Edit Mode */}
            {isEditing ? (
                <div className="mt-3">
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    rows={2}
                />
                <div className="flex justify-end mt-2">
                    <button
                    onClick={() => editMutation.mutate()}
                    disabled={editMutation.isPending}
                    className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                    <Save size={12} /> Save
                    </button>
                </div>
                </div>
            ) : (
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                {comment.content}
                </p>
            )}

            {/* Reply Form */}
            {showReply && (
                <div className="ml-6 mt-3">
                <CommentForm
                    value={replyText}
                    onChange={setReplyText}
                    onSubmit={() => replyMutation.mutate()}
                    placeholder="Write a reply..."
                    isLoading={replyMutation.isPending}
                />
                </div>
            )}

            {/* Replies (only one level deep) */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-3 space-y-2 border-l pl-3">
                {comment.replies.map((reply) => (
                    <CommentItem
                    key={reply.id}
                    comment={reply}
                    videoId={videoId}
                    clientId={clientId}
                    userId={userId}
                    />
                ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;

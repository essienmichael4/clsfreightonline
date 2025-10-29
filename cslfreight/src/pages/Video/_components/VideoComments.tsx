import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosToken from "@/hooks/useAxiosToken";
import type { Comment } from "@/lib/types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface Props {
  videoId: number;
  clientId?: number;
}

const VideoComments = ({ videoId, clientId, }: Props) => {
  const axios_instance_token = useAxiosToken();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  // === Fetch comments ===
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/videos/${videoId}/comments`);
      return res.data;
    },
  });

  // === Add comment mutation ===
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await axios_instance_token.post(`/videos/${videoId}/comments/client`, {
        content: newComment,
        author: { clientId },
      });
      return res.data;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });

  if (isLoading) return <p className="text-gray-500">Loading comments...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      {/* Add Comment */}
      <CommentForm
        value={newComment}
        onChange={setNewComment}
        onSubmit={() => addCommentMutation.mutate()}
        placeholder="Add a comment..."
        isLoading={addCommentMutation.isPending}
      />

      {/* Comment List */}
      <div className="space-y-4 mt-4">
        {comments?.length ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              videoId={videoId}
              clientId={clientId}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default VideoComments;

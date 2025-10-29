import useAuth from "@/hooks/useAuth";
import useAxiosToken from "@/hooks/useAxiosToken";
import type { Video } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useParams } from "react-router-dom";
import VideoComments from "./_components/VideoComments";

const VideoPlayer = () => {
  const axios_instance_token = useAxiosToken();
  const {auth} = useAuth()
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // === Fetch video details ===
  const { data: video, isLoading } = useQuery<Video>({
    queryKey: ["video", id],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/videos/${id}/client`);
      return res.data;
    },
    enabled: !!id,
  });

  // === Like mutation ===
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await axios_instance_token.post(`/videos/${video?.id}/like`);
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["video", id] });

      const previousData = queryClient.getQueryData<Video>(["video", id]);
      if (previousData) {
        // Optimistic toggle: if already liked, remove; if not, add
        const isLiked = previousData.userLiked ?? false;
        queryClient.setQueryData<Video>(["video", id], {
          ...previousData,
          userLiked: !isLiked,
          likesCount: (previousData.likesCount ?? 0) + (isLiked ? -1 : 1),
        });
      }
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["video", id], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["video", id] });
    },
  });


  // === Dislike mutation ===
  const dislikeMutation = useMutation({
    mutationFn: async () => {
      const res = await axios_instance_token.post(`/videos/${id}/dislike`);
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["video", id] });
    },
  });

  if (isLoading) return <p className="text-center mt-8">Loading video...</p>;
  if (!video) return <p className="text-center mt-8">Video not found</p>;

  const baseURL = axios_instance_token.defaults.baseURL;

  return (
    <div className="container mx-auto flex flex-col md:flex-row">
      {/* ==== LEFT: Video Section ==== */}
      <div className="w-full md:w-2/3 p-4">
        <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
          <video
            controls
            width="100%"
            className="w-full h-full object-contain"
            src={`${baseURL}/videos/stream/${id}`}
          />
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
          
          {/* === Likes Section === */}
          <div className="flex items-center gap-6 mb-2">
            <button
              onClick={() => likeMutation.mutate()}
              className={`${video.userLiked ? "text-blue-600" : "text-gray-700 hover:text-blue-600"} flex items-center gap-2 transition-colors disabled:opacity-50`}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp size={20} />
              <span>{video.likesCount}</span>
            </button>

            <button
              onClick={() => dislikeMutation.mutate()}
              className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors disabled:opacity-50"
              disabled={dislikeMutation.isPending}
            >
              <ThumbsDown size={20} />
            </button>
          </div>

          <p className="text-gray-600">{video.description}</p>
        </div>

        {/* === Comments Section === */}
        <VideoComments videoId={video.id} clientId={auth?.id} />
      </div>

      {/* ==== RIGHT: Sidebar (related videos, etc.) ==== */}
      <div className="w-full md:w-1/3 p-4">
        <h3 className="text-lg font-semibold mb-3">Related Videos</h3>
        <p className="text-gray-500 text-sm">Coming soon...</p>
      </div>
    </div>
  );
};

export default VideoPlayer;

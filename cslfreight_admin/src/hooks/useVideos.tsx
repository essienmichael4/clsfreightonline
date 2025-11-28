import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data, Video } from "@/lib/types";

const useVideos = (page: number, limit: number, search?: string) => {
  const axios_instance_token = useAxiosToken();

  const videosQuery = useQuery<Data>({
    queryKey: ["videos", page, limit, search],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/videos`, {
        params: { page, take: limit, search },
      });
      
      return res.data;
    },
  });

  const videos = videosQuery.data?.data as Video[] | undefined;
  const meta = videosQuery.data?.meta;

  return {
    videos,
    meta,
    hasNextPage: meta?.hasNextPage ?? false,
    hasPreviousPage: meta?.hasPreviousPage ?? false,
    isLoading: videosQuery.isLoading,
    isFetching: videosQuery.isFetching,
    error: videosQuery.error,
  };
};

export default useVideos;

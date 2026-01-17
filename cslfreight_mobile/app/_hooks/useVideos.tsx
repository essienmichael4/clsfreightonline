import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data, Video } from "../_lib/types";

const useVideos = (limit: number, search?: string) => {
    const axios_instance_token = useAxiosToken();

    const videosQuery = useInfiniteQuery<Data>({
        queryKey: ["videos", limit, search],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const res = await axios_instance_token.get("/videos", {
                    params: { page: pageParam, take: limit, search },
                });
                console.log("Videos API Response:", res.data);
                return res.data;
            } catch (error) {
                console.error("Videos API Error:", error);
                throw error;
            }
        },
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const videos = videosQuery.data?.pages.flatMap(page => page.data as Video[]) ?? [];
    const lastPage = videosQuery.data?.pages[videosQuery.data.pages.length - 1];

    return {
        videos,
        meta: lastPage?.meta,
        hasNextPage: lastPage?.meta.hasNextPage ?? false,
        fetchNextPage: videosQuery.fetchNextPage,
        isLoading: videosQuery.isLoading,
        isFetching: videosQuery.isFetching,
        isFetchingNextPage: videosQuery.isFetchingNextPage,
        error: videosQuery.error,
    };
};

export default useVideos;
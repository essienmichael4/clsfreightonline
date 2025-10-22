import { useCallback, useRef, useState } from "react";
import useVideos from "@/hooks/useVideos";
import { useNavigate } from "react-router-dom";

const AllVideos = () => {
    const [page, setPage] = useState(1);
    const { videos, isLoading, hasNextPage, isFetching } = useVideos(page, 50);
    const intObserver = useRef<IntersectionObserver | null>(null);
    const navigate = useNavigate();

    const lastVideoRef = useCallback(
        (node: HTMLDivElement) => {
        if (isLoading || isFetching) return;

        if (intObserver.current) intObserver.current.disconnect();

        intObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
            setPage((prev) => prev + 1);
            }
        });

        if (node) intObserver.current.observe(node);
        },
        [isLoading, isFetching, hasNextPage]
    );

    const handleVideoClick = (id: string) => {
        navigate(`/${id}`);
    };

    return (
        <div className="flex flex-wrap">
        {videos?.map((video, i) => {
            if (videos.length === i + 1) {
            // attach observer to the last video item
            return (
                <div
                ref={lastVideoRef}
                onClick={() => handleVideoClick(video.key as string)}
                key={video.id}
                className="py-2 md:p-2 lg:p-4 w-full md:w-1/2 lg:w-1/3 cursor-pointer"
                >
                    <div className="aspect-video w-full overflow-hidden rounded-md cursor-pointer">
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover cursor-pointer"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 text-sm font-semibold">{video.title}</h3>
                    </div>
                </div>
            );
            } else {
            return (
                <div
                key={video.id}
                className="py-2 md:p-2 lg:p-4 w-full md:w-1/2 lg:w-1/3 cursor-pointer"
                onClick={() => handleVideoClick(video.key as string)}
                >
                    <div className="aspect-video w-full overflow-hidden rounded-md">
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 text-sm font-semibold">{video.title}</h3>
                    </div>
                </div>
            );
            }
        })}

        {(isLoading || isFetching) && (
            <p className="col-span-full text-center text-gray-500">Loading...</p>
        )}
        </div>
    );
};

export default AllVideos;

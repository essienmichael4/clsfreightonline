import { useCallback, useRef, useState } from "react";
import useVideos from "@/hooks/useVideos";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import DeleteVideo from "./DeleteVideo";

const AllVideos = () => {
    const limit = 50;
    const [page, setPage] = useState(1);
    const { videos, isLoading, hasNextPage, isFetching } = useVideos(page, limit);
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
                    className="py-2 md:p-2 lg:p-4 w-full md:w-1/2 lg:w-1/3 cursor-pointer relative"
                    >
                        <div className="relative aspect-video w-full overflow-hidden rounded-md group">
                            {/* Thumbnail */}
                            <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                            />

                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex  gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`${video.id}/edit`)
                                    // handle delete logic
                                    }}
                                    className="flex items-center gap-1 bg-white/80 text-emerald-800 px-2 py-1 rounded text-xs hover:bg-white">
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                                <DeleteVideo trigger={<button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // handle delete logic
                                    } }
                                    className="flex items-center gap-1 bg-white/80 text-red-600 px-2 py-1 rounded text-xs hover:bg-white">
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>} page={page} limit={limit} video={video} />
                                
                            </div>
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
                        <div className="relative aspect-video w-full overflow-hidden rounded-md group">
                            {/* Thumbnail */}
                            <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                            />

                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex  gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`${video.id}/edit`)
                                    // handle delete logic
                                    }}
                                    className="flex items-center gap-1 bg-white/80 text-emerald-800 px-2 py-1 rounded text-xs hover:bg-white">
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                                <DeleteVideo trigger={<button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        return
                                        // handle delete logic
                                    } }
                                    className="flex items-center gap-1 bg-white/80 text-red-600 px-2 py-1 rounded text-xs hover:bg-white">
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>} page={page} limit={limit} video={video} />
                            </div>
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

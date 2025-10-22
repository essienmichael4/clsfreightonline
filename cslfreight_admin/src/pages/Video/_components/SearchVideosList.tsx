import type { Video } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface Props {
    videos: Video[] | undefined;
    lastVideoRef: (node: HTMLDivElement) => void;
    isLoading: boolean;
    isFetching: boolean;
}

const SearchVideosList = ({ videos, lastVideoRef, isLoading, isFetching }: Props) => {
    const navigate = useNavigate();
    const handleVideoClick = (id: string) => {
        navigate(`../${id}`);
    };
    return (
        <div className="flex flex-wrap">
        {videos?.map((video, i) => {
            if (videos?.length === i + 1) {
                return (
                    <div
                    ref={lastVideoRef}
                    onClick={() => handleVideoClick(video.key as string)}
                    key={video.id}
                    className="py-2 md:p-2 lg:p-4 w-full md:w-1/2 cursor-pointer"
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
            return (
                <div
                key={video.id}
                className="py-2 md:p-2 lg:p-4 w-full md:w-1/2 cursor-pointer"
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
            )
        })}
        {(isLoading || isFetching) && <p className="text-center py-4">Loading...</p>}
        </div>
    );
}

export default SearchVideosList

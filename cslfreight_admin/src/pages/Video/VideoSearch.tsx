import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useVideos from "@/hooks/useVideos";
import SearchVideosList from "./_components/SearchVideosList";

const VideoSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [page, setPage] = useState(1);
    const query = searchParams.get("q") || "";
    const { videos, isLoading, hasNextPage, isFetching } = useVideos(page, 50);
    const intObserver = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setPage(1); // reset to first page on new query
    }, [query]);

    const handleSearch = () => {
        if (search.trim()) {
            setPage(1); // reset pagination
            setSearchParams({ q: search, page: "1" });
        } else {
            setPage(1);
            setSearchParams({});
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        handleSearch();
        }
    };

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

    return (
        <div className="container mx-auto px-4">
        {/* Search bar */}
            <div className="py-4 flex justify-between items-center">
                <div className="flex w-full md:w-1/2 items-center gap-2">
                    <div className="hidden md:flex flex-1 items-center h-10">
                        <div className="flex w-full border h-full items-center px-3 gap-3 rounded-s-md bg-white focus-within:border-gray-500">
                            <Search className="h-4 w-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search videos"
                                className="outline-none w-full bg-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="text-white bg-cyan-700 h-full px-6 rounded-e-md hover:bg-cyan-500"
                            >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Video list */}
            <div>
                <SearchVideosList
                    videos={videos}
                    lastVideoRef={lastVideoRef}
                    isLoading={isLoading}
                    isFetching={isFetching}
                />
                {/* <AllVideos query={searchParams.get("q") || ""} page={page} /> */}
            </div>
        </div>
    );
};

export default VideoSearch;

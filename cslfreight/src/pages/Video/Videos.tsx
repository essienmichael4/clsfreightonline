import { Input } from "@/components/ui/input";
import AllVideos from "./_components/AllVideos";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Videos = () => {
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const handleSearch = () => {
        setQuery(search.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };
    
    return (
        <div className="container px-4 mx-auto">
            <div className="py-4 flex justify-between items-center">
                <h4 className="text-xl font-semibold">Videos</h4>
                 <div className="w-full md:w-1/3 flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search videos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                    />
                    <Button
                        variant="default"
                        onClick={handleSearch}
                        disabled={!search.trim()}
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>
            {/* </div> */}

            {/* Video grid */}
            <AllVideos search={query} />
        </div>
    );
};

export default Videos;

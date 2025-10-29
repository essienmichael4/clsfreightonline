import AllVideos from "./_components/AllVideos";
import { useState } from "react";
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
                <div className="hidden rounded-md md:flex justify-center items-center h-10">
                    <div className="flex w-full sm:w-2/3 md:w-[400px] border h-full items-center px-3 gap-3 rounded-s-md bg-white focus-within:border-gray-500">
                        <Search className="h-4 w-4 text-gray-400 pointer-events-none" />
                        <input type="text" onChange={(e)=>setSearch(e.target.value)}
                            value={search as string} placeholder="Search videos" onKeyDown={handleKeyDown} className="outline-none w-full bg-transparent"/>
                    </div>
                    <button className="text-white bg-cyan-700 h-full px-6 rounded-e-md hover:bg-cyan-500" onClick={handleSearch}>Search</button>
                </div>
            </div>
            {/* </div> */}

            {/* Video grid */}
            <AllVideos search={query} />
        </div>
    );
};

export default Videos;

import { useState } from "react"
import VidoeUploadDialog from "./_components/VidoeUploadDialog"
import AllVideos from "./_components/AllVideos"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Vidoes = () => {
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    
    const handleSearch = () => {
        if(search) {
            navigate(`/results?q=${search.trim()}`)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="container px-4 mx-auto">
            <VidoeUploadDialog show={show} onClose={()=>setShow(!show)}/>
            <div className="py-4 flex justify-between items-center">
                <h4>Videos</h4>
                <div className="flex w-1/2 items-center gap-2">
                    <button 
                        className="text-xs py-2 px-2 h-10 md:px-4 flex text-nowrap items-center rounded-md bg-gradient-to-r from-green-500 to-green-800 text-white"
                        onClick={()=> setShow(!show)}
                    >Upload Video</button>
                    <div className="hidden rounded-md md:flex flex-1 justify-center items-center h-10">
                        <div className="flex w-full flex-1 sm:w-2/3 md:w-2/4 border h-full items-center px-3 gap-3 rounded-s-md bg-white focus-within:border-gray-500">
                            <Search className="h-4 w-4 text-gray-400 pointer-events-none" />
                            <input type="text" onChange={(e)=>setSearch(e.target.value)}
                                value={search as string} placeholder="Search videos" onKeyDown={handleKeyDown} className="outline-none w-full bg-transparent"/>
                        </div>
                        <button className="text-white bg-cyan-700 h-full px-6 rounded-e-md hover:bg-cyan-500" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-wrap">
                <div className="py-2 md:p-2 lg:p-4 aspect-video w-full md:w-1/2 lg:w-1/3 ">
                    <div className="bg-amber-300 w-full h-full rounded-md">

                    </div>
                </div>
            </div> */}
            <AllVideos />
        </div>
    )
}

export default Vidoes

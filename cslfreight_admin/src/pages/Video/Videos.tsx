import { useState } from "react"
import VidoeUploadDialog from "./_components/VidoeUploadDialog"

const Vidoes = () => {
    const [show, setShow] = useState(false)

    return (
        <div className="container px-4 mx-auto">
            <VidoeUploadDialog show={show} onClose={()=>setShow(!show)}/>
            <div className="py-4 flex justify-between items-center">
                <h4>Videos</h4>

                <button 
                    className="text-xs py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-green-500 to-green-800 text-white"
                    onClick={()=> setShow(!show)}
                >Upload Video</button>
            </div>
            <div className="flex flex-wrap">
                <div className="py-2 md:p-2 lg:p-4 aspect-video w-full md:w-1/2 lg:w-1/3 ">
                    <div className="bg-amber-300 w-full h-full rounded-md">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vidoes

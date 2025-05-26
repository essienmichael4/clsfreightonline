import { useQuery } from "@tanstack/react-query"
import { LoadingType } from "@/lib/types"
import { axios_instance } from "@/api/axios"

const Loading = () => {

    const loadings = useQuery<LoadingType[]>({
        queryKey: ["loadings"],
        queryFn: async() => await axios_instance.get(`/loadings?status=${status}`).then(res => res.data)
    })

    const dataAvailable = loadings.data && loadings.data.length > 0
    
    return (
        <>
            <div className="container px-4 mx-auto">
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center">
                        <h2 className="font-bold text-3xl sm:font-normal sm:text-6xl tracking-wide">Our Container loadings & Vessel Lines</h2>
                    </div>
                </div>
                <div className="w-full mt-8 flex flex-col gap-4">
                    {
                        !dataAvailable && 
                        <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
                            <p className='text-center'>No container loadings have been added yet.</p>
                        </div>
                    }
                    {
                    dataAvailable &&
                        loadings?.data.map((item, i)=>(
                        <div key={i} className="p-4 border rounded-md flex flex-wrap gap-4 items-center">
                            <div className="relative w-full sm:w-auto">
                                <div className="flex gap-2 items-center">
                                    <div className="sm:hidden" >
                                        <span className="text-xs">Loaded</span>
                                        <p>{new Date(item.loaded as string).toDateString()}</p>
                                    </div>
                                    <p className="hidden sm:block">Loaded - {new Date(item.loaded as string).toDateString()}</p> <span className="absolute sm:relative sm:top-0 right-0 top-2 text-xs py-2 px-4 bg-emerald-200 rounded-full text-emerald-700">{item.status}</span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-xs">Vessel Name</span>
                                    <h5 className="text-3xl">{item.vessel}</h5>
                                </div>
                            </div>
                            <div className="md:ml-8">
                                <span className="text-xs">ETA</span>
                                <p className="text-xl">{new Date(item.eta as string).toDateString()}</p>
                            </div>
                        </div>)
                    )}
                </div>
            </div>
        </>
    )
}

export default Loading

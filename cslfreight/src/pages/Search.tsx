import { axios_instance } from "@/api/axios"
import { Package } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"

const Search = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const loadedQuery = useQuery<Package[] | []>({
        queryKey: ["packages"],
        queryFn: async() => await axios_instance.get(`/packages/search?filter=${location.state.toString()}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const dataAvailable = loadedQuery.data && loadedQuery.data.length > 0
    return (
        <>
            <div className="container mx-auto mt-8">
                <div className="mb-8 flex items-center gap-2">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-12 h-12 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <p>Hello, Find details of your packages below</p>
                </div>
                {
                    !dataAvailable && 
                    <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
                        <p className='text-center'>No Packages found for the given tracking number(s).</p>
                        <p className="lg:w-1/2 text-sm text-muted-foreground">Check the tracking number(s) for mistakes or contact your service provider for more details as it might not exist currently on the system.</p>
                    </div>
                }

                {
                    dataAvailable &&
                    loadedQuery?.data.map((item, i)=>(
                        <div key={i} className="">
                            <div>
                                <h3 className="text-gray-400 mb-2">Tracking Number:</h3>
                                <p className="text-xl">{item?.trackingNumber}</p>
                            </div>
                            <div>
                            <div className="px-4 flex flex-wrap gap-8 mt-8">
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2 '>Custormer name</h4>
                                    <p>{item?.customer}</p>
                                </div>
                                {/* <div>
                                    <h4 className='text-xs text-gray-400 mb-2 '>Custormer email</h4>
                                    <p>{item?.email}</p>
                                </div>
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2 '>Custormer phone</h4>
                                    <p>{item?.phone}</p>
                                </div> */}
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2 '>Status</h4>
                                    <p ><span className={`${item.status === "ON_HOLD" && 'bg-gray-300'} ${item.status === "ARRIVED" && 'bg-emerald-300 text-emerald-700'} ${item.status === "EN_ROUTE" && 'bg-yellow-300 text-yellow-700'} ${item.status === "DELIVERED" && 'bg-blue-300 text-blue-700'} py-1 px-4 rounded-full text-xs`}>{item.status}</span></p>
                                </div>
                            </div>
                            <div className="px-4 flex flex-wrap gap-8 mt-8">
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2'>Package</h4>
                                    <p>{item?.package}</p>
                                </div>
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2'>CBM</h4>
                                    <p>{item.cbm}</p>
                                </div>
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2'>Quantity</h4>
                                    <p>{item.quantity}</p>
                                </div>
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2'>Vessel Line</h4>
                                    <p>{item?.vessel ? item?.vessel : "-"}</p>
                                </div>
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2'>Received</h4>
                                    <p>{item?.received ? new Date(item?.received).toDateString() : "-"}</p>
                                </div>
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2'>Loaded</h4>
                                    <p>{item?.loaded ? new Date(item?.loaded).toDateString() : "-"}</p>
                                </div>
                                <div>
                                    <h4 className='text-xs text-gray-400 mb-2'>ETA</h4>
                                    <p>{item?.eta ? new Date(item?.eta).toDateString() : "-"}</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Search
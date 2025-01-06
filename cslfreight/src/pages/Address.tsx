import { axios_instance_token } from "@/api/axios"
import Footer from "@/components/Footer"
import { AddressType } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

const Address = () => {
    const address = useQuery<AddressType[]>({
        queryKey: ["address",],
        queryFn: async() => await axios_instance_token.get(`/address`).then(res => res.data)
    })

    const dataAvailable = address.data && address.data.length > 0
    return (<>
        <div className="container mx-auto">
            <div className="mt-12">
            <div className="px-6 mt-10 rounded-lg">
                <h2 className="font-bold text-3xl sm:font-normal sm:text-6xl tracking-wide">Our Shipping Adresses</h2>
                <div className="">
                    <p><span className='text-red-500 mr-2 text-xl'>&#9888;</span>Please put your Shipping mark on all your packages with your name and contact at (XXX)</p>
                </div>
                {dataAvailable && <div className="flex flex-wrap mt-12">
                    {address.data?.map((add)=>(<div className="w-full sm:w-1/2 p-2">
                        <div className="border h-full p-8 rounded-lg">
                        
                            <p className="text-2xl font-bold">{add.name}</p>
                            <div className="mt-4">
                                <h4 className="text-xs">Contact:</h4>
                                <p className="text-lg">
                                    {add.contact}
                                </p>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-xs">Mobile:</h4>
                                <p className="text-lg">
                                    {add.mobile}
                                </p>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-xs">Warehouse Address:</h4>
                                <p className="text-lg">
                                    {add.address}
                                </p>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-xs">Shipping Mark</h4>
                                <p className="text-lg">
                                    GH-CSL-XXX
                                </p>
                            </div>
                        
                            <p className="text-xs"><span className='text-red-500 mr-2 text-lg'>&#9888;</span> XXX - put your name and phone number.</p>
                        </div>
                    </div>))}
                    
                </div>}
                
            </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default Address
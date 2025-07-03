import { Skeleton } from "@/components/ui/skeleton"
import useAxiosToken from "@/hooks/useAxiosToken"
import { PackageTypeAndRate } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Edit, Trash2 } from "lucide-react"
import EditRate from "./EditRate"

const ShippingRates = () => {
    const axios_instance_token = useAxiosToken()
    
    const {data:rates, isLoading} = useQuery<PackageTypeAndRate[]>({
        queryKey: ["rates"],
        queryFn: async() => await axios_instance_token.get(`/packages/shipping-rates`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const content = isLoading ? <Skeleton>
      <div className="sm:h-72 md:h-80 lg:h-96 w-full">

      </div>
    </Skeleton> : rates && rates.length > 0 ? <div>
        <div className="w-full flex mt-4 flex-wrap">
            {rates.map(rate=>{
                return <div key={rate.id} className='p-1 w-full sm:p-2 md:w-1/2'>
                    <div className='relative flex flex-col bg-gradient-to-r from-white to-gray-300 rounded-lg p-4 border'>
                      <div className='flex absolute right-2 top-2 gap-2'>
                        <EditRate id={Number(rate.id)} rate={rate} trigger={
                          <button className='p-2 rounded-full  bg-white  text-emerald-300 hover:text-emerald-700'>
                            <Edit className='w-4 h-4' />
                          </button>} />

                          <button className='p-2 rounded-full  bg-white  text-rose-300 hover:text-rose-700'>
                            <Trash2 className='w-4 h-4' />
                          </button>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold">Package Description</h5>
                        <p className="text-xl">{rate.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <h5 className='font-bold text-3xl text-muted-foreground my-2'>$ {rate.rate}</h5> 
                        <span className="text-2xl text-muted-foreground">/</span>
                        <h5 className='font-bold text-3xl text-muted-foreground my-2'>¢ {rate.cedisRate || 0}</h5>
                      </div>
                    </div>
                </div>
            })}
        </div>
    </div> : <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
        No rates added yet...
        <p className="text-sm text-center text-muted-foreground">Try adding one.</p>
    </div>
    
    return (
        <div>{content}</div>
    )
}

export default ShippingRates

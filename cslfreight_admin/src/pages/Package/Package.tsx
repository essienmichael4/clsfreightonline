import { Button } from "@/components/ui/button"
import useAxiosToken from "@/hooks/useAxiosToken"
import { FormattedDate, FormattedTime } from "@/lib/helper"
import { Package } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const PackageDetails = () => {
    const {id} =useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const packageDetail = useQuery<Package>({
        queryKey: ["orders", id],
        queryFn: async() => await axios_instance_token.get(`/package/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const updatePackage = async (status:string) => {
        const response = await axios_instance_token.put(`/package/${id}`, {
            status
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updatePackage,
        onSuccess: ()=>{
            toast.success("Package updated successfully", {
                id: "package-update"
            })

            queryClient.invalidateQueries({queryKey: ["package", id]})
            
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "package-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "package-update"
                })
            }
        }
    })

    const onPackageUpdate = (data:string)=>{
        toast.loading("Updating Package ...", {
            id: "package-update"
        })
        mutate(data)
    }
    
    return (
        <div>
            <div className="flex justify-between flex-wrap mb-4 lg:mb-0">
                <div className="flex gap-4 ">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-12 h-12 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        &larr;
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-3xl font-semibold mb-2">Order ID: #{id}</h4>
                                <p>Tracking Number: </p>
                            </div>
                            <span className={`${packageDetail.data?.status === "HELD" && 'bg-gray-300'} ${packageDetail.data?.status === "COMPLETED" && 'bg-emerald-300 text-emerald-700'} ${packageDetail.data?.status === "CANCELLED" && 'bg-rose-300 text-rose-700'} ${packageDetail.data?.status === "PENDING" && 'bg-blue-300 text-blue-700'} py-1 px-4 rounded-full text-xs`}>{packageDetail.data?.status}</span>
                        </div>
                        <p className="mb-2 text-xs lg:text-sm text-muted-foreground">{FormattedDate(new Date(packageDetail.data?.createdAt as string))} at {FormattedTime(new Date(packageDetail.data?.createdAt as string))} from drafts</p>
                    </div>
                </div>
                <div className="flex justify-self-end gap-2">
                    {packageDetail.data?.status !== "COMPLETED" && <Button className="border bg-rose-700 hover:bg-rose-500" onClick={()=>{onPackageUpdate("CANCELLED")}} disabled={isPending}>Cancel Order</Button>}
                </div>
            </div>
        </div>
    )
}

export default PackageDetails

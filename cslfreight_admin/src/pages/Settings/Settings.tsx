import { Loader2, Plus } from "lucide-react"
import AddRate from "./AddRate"
import ShippingRates from "./_components/ShippingRates"
import AddAnnouncement from "./_components/AddAnnouncement"
import AnnouncementParser from "@/components/AnnouncementParser"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxiosToken from "@/hooks/useAxiosToken"
import { AnnouncementType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import EditAnnouncement from "./_components/EditAnnouncement"
import { toast } from "sonner"
import axios from "axios"

const Settings = () => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const announcement = useQuery<AnnouncementType>({
        queryKey: ["announcements", "clients"],
        queryFn: async() => await axios_instance_token.get(`/announcements/clients`).then(res => res.data)
    })

    const upadateAnnouncementStatus = async (data:string)=>{
        const response = await axios_instance_token.patch(`/announcements/clients/1/show`, {
            show: data
        },)
        console.log(response.data);
        
        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: upadateAnnouncementStatus,
        onSuccess: ()=>{
            toast.success("Announcement status change successfully", {
                id: "update-announcement"
            })
    
            queryClient.invalidateQueries({queryKey: ["announcements", "clients"]})
    
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "update-announcement"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "update-announcement"
                })
            }
        }
    })
    
    const onUpdate = (data:string)=>{
        toast.loading("Updating announcement status...", {
            id: "update-announcement"
        })
        mutate(data)
    }
    
    return (
        <div className="container px-4 mx-auto">
            <div className="mt-6 flex items-center justify-between">
                <h3 className="font-bold">Shipping Rates</h3>
                <div>
                    <AddRate trigger={
                    <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                        <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Package</span>
                    </button>}
                    />
                </div>
            </div>
            <div className="mt-4">
                <ShippingRates />
            </div>
            <div className="mt-6 flex items-center justify-between">
                <h3 className="font-bold">Client Announcement</h3>
                {!announcement.data && <div>
                    <AddAnnouncement trigger={
                    <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                        <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Announcement</span>
                    </button>}
                    />
                </div>}
                {announcement.data && 
                    <EditAnnouncement announcement={announcement.data} trigger={
                    <Button className="text-xs lg:text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Edit Announcement</Button>
                    } />
                }
            </div>
            {announcement.data &&
                <div className="mt-4">
                <h3 className="text-2xl font-bold mb-2">{announcement.data.title}</h3>
                <div className="mt-4">
                    <AnnouncementParser announcement={announcement.data.body} />
                </div>
                {announcement.data.show === "TRUE" && 
                    <button onClick={ ()=>onUpdate("FALSE")} disabled={isPending} className="py-2 px-4 bg-gray-600 hover:bg-gray-800 rounded-md flex text-white">
                    {!isPending && "Remove Announcement"}
                    {isPending && <Loader2 className='animate-spin' /> }
                    </button>
                }
                {announcement.data.show === "FALSE" && 
                    <button onClick={ ()=>onUpdate("TRUE")} disabled={isPending} className="py-2 px-4 bg-gray-600 hover:bg-gray-800 rounded-md flex text-white">
                    {!isPending && "Show Announcement"}
                    {isPending && <Loader2 className='animate-spin' /> }
                    </button>
                }
                </div>
            }
            
        </div>
    )
}

export default Settings

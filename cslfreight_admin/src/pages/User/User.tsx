import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Plus, PlusCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { AddressType, AnnouncementType, User } from "@/lib/types"
import useAxiosToken from '@/hooks/useAxiosToken'
import EditAccountDialog from './EditAccountDialog'
import { Button } from '@/components/ui/button'
import ChangePassword from './ChangePassword'
import AddAnnouncement from './AddAnnouncement'
import EditAnnouncement from './EditAnnouncement'
import { toast } from 'sonner'
import axios from 'axios'
import AddAddress from './AddAddress'

const UserProfile = () => {
    // const {auth} = useAuth()
    const navigate = useNavigate()
    const {id} =useParams()
    const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()

    const announcement = useQuery<AnnouncementType>({
        queryKey: ["announcements",],
        queryFn: async() => await axios_instance_token.get(`/announcements`).then(res => res.data)
    })

    const address = useQuery<AddressType[]>({
        queryKey: ["address",],
        queryFn: async() => await axios_instance_token.get(`/address`).then(res => res.data)
    })

    const user = useQuery<User>({
      queryKey: ["user"],
      queryFn: async() => await axios_instance_token.get(`/users/${id}`).then(res => res.data)
    })

    const upadateAnnouncementStatus = async (data:string)=>{
        const response = await axios_instance_token.patch(`/announcements/1/show`, {
            show: data
        },)
    
        return response.data
    }
    
      const {mutate, isPending} = useMutation({
        mutationFn: upadateAnnouncementStatus,
        onSuccess: ()=>{
            toast.success("Announcement status change successfully", {
                id: "update-announcement"
            })
    
            queryClient.invalidateQueries({queryKey: ["announcements"]})
    
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

    const dataAvailable = address.data && address.data.length > 0

    return (
        <div className='mx-auto container mt-4 mb-16 px-4'>
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-4'>
                    <button className='p-2 bg-blue-100 flex items-center justify-center rounded-lg' onClick={()=>{navigate(-1)}}>
                        <ArrowLeft className='w-4 h-4'/>
                    </button>
                    <h4 className=" font-semibold">User Account</h4>
                </div>
                <div className=" flex items-center justify-end gap-2 flex-wrap">
                    <EditAccountDialog user={user.data as User} trigger={
                    <Button className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Edit Profile</Button>} />
                    <ChangePassword id={Number(id)} trigger={
                    <Button className="border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent">Change Password</Button>} />
                </div>
            </div>
            <div className='bg-white my-4 border border-gray-300 rounded-lg h-full relative'>
              <div className='w-full h-48 bg-gray-200 rounded-lg relative'>
              </div>
              <div className='px-4 pt-4 pb-8'>
                <div className='absolute w-36 h-36 rounded-full bg-white border-4 border-gray-200 top-16 left-4'></div>
                <h3 className="font-bold text-4xl">{user.data?.name}</h3>
                <p className="mt-2 text-muted-foreground">{user.data?.email}</p>
                <div className='flex flex-wrap gap-8'></div>
              </div>
            </div>
            <div className="my-8 border flex flex-wrap gap-8 p-4 rounded-2xl">
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h4 className="text-lg lg:text-3xl">Announcement</h4>
                  <div className="flex gap-2">
                    {!announcement.data &&
                      <AddAnnouncement trigger={
                        <Button className="text-xs lg:text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent"><PlusCircle  className="w-4 h-4 mr-2"/> Add Announcement</Button>
                      } />
                    }
                    {announcement.data && 
                      <EditAnnouncement announcement={announcement.data} trigger={
                        <Button className="text-xs lg:text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Edit Announcement</Button>
                      } />
                    }
                  </div>
                </div>
                <hr />
                <div className='h-2 w-36 lg:w-96 relative block bg-[#FFDD66] -top-1'></div>
                {announcement.data &&
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold mb-2">{announcement.data.title}</h3>
                    <p className="mb-4 text-muted-foreground">{announcement.data.body}</p>
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
            </div>
          <div className="mt-12">
            <div className="px-6 mt-10 rounded-lg">
              <div className='flex items-center justify-between+'>
                <h2 className="font-bold text-lg lg:text-3xl ">Shipping Adresses</h2>
                <AddAddress trigger={
                <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                  <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add New Address</span>
                </button>
                } />
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
                      </div>
                  </div>))}
                  
              </div>}
              
            </div>
          </div>
        </div>
    )
}

export default UserProfile

import useAxiosToken from "@/hooks/useAxiosToken"
import { Client } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Badge, Download, Edit, File } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import ChangePassword from "./ChangePassword"
import { Button } from "@/components/ui/button"
import EditProfile from "./EditProfile"
import EditInfoDialog from "./EditInfo"
import { DownloadFile, GetTierBadgeClass } from "@/lib/helper"
import { Skeleton } from "@/components/ui/skeleton"

const Profile = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const axios_instance_token = useAxiosToken()

  const user = useQuery<Client>({
    queryKey: ["user", "clients", id],
    queryFn: async() => await axios_instance_token.get(`/users/clients/${id}`).then(res => res.data)
  })

  return (
    <div className='mx-auto container mt-4 mb-16 px-4'>
      <div className="flex items-center justify-between">
          <div className='flex items-center gap-4'>
              <button className='p-2 bg-blue-100 flex items-center justify-center rounded-lg' onClick={()=>{navigate(-1)}}>
                  <ArrowLeft className='w-4 h-4'/>
              </button>
              <h4 className=" font-semibold">User Profile</h4>
          </div>
          <div className=" flex items-center justify-end gap-2 flex-wrap">
              <ChangePassword id={Number(id)} trigger={
                <Button className="border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent">Change Password</Button>
              } />
          </div> 
      </div>
      <div className='bg-white my-4 border border-gray-300 rounded-lg h-full relative'>
        <div className='w-full h-48 bg-gray-200 rounded-lg relative'>
        </div>
        <div className='px-4 pt-4 pb-8'>
          {user.data && <EditProfile client={user.data} trigger={
            <Button className="p-2 absolute right-4 border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent"><Edit /></Button>
          } />}
          <div className="absolute top-16 left-4 flex items-end">
            <div className=' w-36 h-36 rounded-full bg-white border-4 border-gray-200 '></div>
            <div className="mb-2">
              <span className={`
                ${!user.data?.membershipTier?.priority || user.data?.membershipTier?.priority === 1 && "bg-[#ffdbb7] text-[#cd7f32]"}
                ${user.data?.membershipTier?.priority === 2 && "bg-[#f1f1f1] text-[#c0c0c0]"}
                ${user.data?.membershipTier?.priority === 3 && "bg-amber-100 text-amber-600"}
                ${user.data?.membershipTier?.priority === 4 && "bg-emerald-100 text-emerald-600"}
                ${user.data?.membershipTier?.priority === 5 && "bg-cyan-100 text-cyan-600"}
                  flex gap-2 items-center px-5 py-2 rounded-lg text-xs`}>
                  <Badge className={`w-4 h-4 rounded-full ${GetTierBadgeClass(user.data?.membershipTier?.priority)}`} />
                  {user.data?.membershipTier?.name}
                </span>
            </div>
          </div>
          <h3 className="font-bold md:text-4xl">{user.data?.shippingMark}</h3>
          <p className="mt-2 text-xs md:text-md text-muted-foreground">{user.data?.email}</p>
          <p className="mt-2 text-xs md:text-md text-muted-foreground">+{user.data?.phone}</p>
        </div>
      </div>
      <div className='relative my-4 border border-gray-300 rounded-lg p-4'>
        {user.data && <EditInfoDialog client={user.data} trigger={
            <Button className="p-2 absolute right-4 border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent"><Edit /></Button>
          } />}
        <h4 className="font-bold text-xl">Other Info</h4>
        <div className="flex flex-wrap gap-8 mt-4">
          <div>
            <h6 className="font-bold text-xs">Date of Birth</h6>
            <p>{user.data?.clientDetails?.dob ? user.data?.clientDetails?.dob : "-"}</p>
          </div>
          <div>
            <h6 className="font-bold text-xs">Location</h6>
            <p>{user.data?.clientDetails?.location ? user.data?.clientDetails?.location : "-"}</p>
          </div>
          <div>
            <h6 className="font-bold text-xs">Next of Kin (Name)</h6>
            <p>{user.data?.clientDetails?.nextOfKin ? user.data?.clientDetails?.nextOfKin : "-"}</p>
          </div>
          <div>
            <h6 className="font-bold text-xs">Next of Kin (Phone)</h6>
            <p>{user.data?.clientDetails?.nextOfKinPhone ? user.data?.clientDetails?.nextOfKinPhone : "-"}</p>
          </div>
        </div>
      </div>
      <div className='relative my-4 border border-gray-300 rounded-lg p-4'>
        <h4 className="font-bold text-xl">Attachments</h4>
        <div className="flex flex-wrap gap-8 mt-4">
          {user.isLoading && 
            <Skeleton >
              <div className="h-32 w-full">

              </div>
            </Skeleton>
          }
          {!user.data?.attachments || user.data?.attachments.length === 0 && 
              <div className='bg-gray-100 w-full rounded-lg h-[300px] flex flex-col text-center items-center justify-center'>
                  No Attachments have been uploaded yet
              </div>
          }
          {
            user.data?.attachments?.map(attachment=>{
              const ext = attachment.name?.split(".")[1]
              let content
              if(ext === "jpg" || ext === "jpeg" || ext === "png" ){
                content = <img className="w-full" src={attachment.imageUrl}/>
              }else {
                content = <File className="w-28 h-28 text-gray-600" />
              }
              
              return <div key={attachment.id} className="border hover:bg-blue-100 hover:border-blue-700 w-full sm:w-1/2 lg:w-1/3 rounded-xl overflow-hidden">
                <div className="border-b aspect-video overflow-hidden flex items-center justify-center">
                  {content}
                </div>
                <div className="p-2 flex items-center justify-between bg-white">
                  <div>
                    <p className="text-sm text-ellipsis line-clamp-1">{attachment.name.split("-").length === 7 ? attachment.name.split("-")[0].replace(/_+/g,' ') : attachment.name.split("-")[attachment.name.split("-").length - 1].replace(/_+/g,' ')}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(attachment.createdAt as string).toDateString()}</p>
                  </div>
                  <button onClick={()=>DownloadFile(attachment.imageUrl, attachment.name.split("-").length === 7 ? attachment.name.split("-")[0].replace(/_+/g,' ') : attachment.name.split("-")[attachment.name.split("-").length - 1].replace(/_+/g,' '))} className="p-2 border text-gray-400 hover:border-blue-700 hover:text-blue-700 rounded-full"><Download /></button>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Profile

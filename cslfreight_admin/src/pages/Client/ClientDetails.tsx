import AddAttachments from "@/components/AddAttachments"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import useAxiosToken from "@/hooks/useAxiosToken"
import { DownloadFile } from "@/lib/helper"
import { Client } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Download, File, Trash2 } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DeleteAttachment from "./_components/DeleteAttachment"

const ClientDetails = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const {id} = useParams()
  const axios_instance_token = useAxiosToken()

  const clientQuery = useQuery<Client>({
    queryKey: ["clients", id],
    queryFn: async() => await axios_instance_token.get(`/users/clients/${id}`).then(res => {
      console.log(res.data);
      
      return res.data
    })
  })

  const handleOpenChange= () => {setOpen(!open)}

  return (
    <div className='mx-auto container mt-4 mb-16 px-4'>
      <AddAttachments id={Number(id)} open={open} onOpenChange={handleOpenChange}/>
      <div className="flex items-center justify-between">
          <div className='flex items-center gap-4'>
              <button className='p-2 bg-blue-100 flex items-center justify-center rounded-lg' onClick={()=>{navigate(-1)}}>
                  <ArrowLeft className='w-4 h-4'/>
              </button>
              <h4 className=" font-semibold">Client Profile</h4>
          </div>
          <div className=" flex items-center justify-end gap-2 flex-wrap">
              <Button onClick={()=>handleOpenChange()} className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Add Attachment</Button>
          </div> 
      </div>
      <div className='bg-white my-4 border border-gray-300 rounded-lg h-full relative'>
        <div className='w-full h-48 bg-gray-200 rounded-lg relative'>
        </div>
        <div className='px-4 pt-4 pb-8'>
          <div className='absolute w-36 h-36 rounded-full bg-white border-4 border-gray-200 top-16 left-4'></div>
          <h3 className="font-bold md:text-4xl">{clientQuery.data?.shippingMark}</h3>
          <p className="mt-2 text-muted-foreground">{clientQuery.data?.email}</p>
          <p className="mt-2 text-muted-foreground">+{clientQuery.data?.phone}</p>
        </div>
      </div>
      <div className='relative my-4 border border-gray-300 rounded-lg p-4'>
        <h4 className="font-bold text-xl">Other Info</h4>
        <div className="flex flex-wrap gap-8 mt-4">
          <div>
            <h6 className="font-bold text-xs">Date of Birth</h6>
            <p>{clientQuery.data?.clientDetails?.dob ? clientQuery.data?.clientDetails?.dob : "-"}</p>
          </div>
          <div>
            <h6 className="font-bold text-xs">Location</h6>
            <p>{clientQuery.data?.clientDetails?.location ? clientQuery.data?.clientDetails?.location : "-"}</p>
          </div>
          <div>
            <h6 className="font-bold text-xs">Next of Kin (Name)</h6>
            <p>{clientQuery.data?.clientDetails?.nextOfKin ? clientQuery.data?.clientDetails?.nextOfKin : "-"}</p>
          </div>
          <div>
            <h6 className="font-bold text-xs">Next of Kin (Phone)</h6>
            <p>{clientQuery.data?.clientDetails?.nextOfKinPhone ? clientQuery.data?.clientDetails?.nextOfKinPhone : "-"}</p>
          </div>
        </div>
      </div>
      <div className='relative my-4 border border-gray-300 rounded-lg p-4'>
        <h4 className="font-bold text-xl">Attachments</h4>
        <div className="flex flex-wrap gap-8 mt-4">
          {clientQuery.isLoading && 
            <Skeleton >
              <div className="h-32 w-full">

              </div>
            </Skeleton>
          }
          {!clientQuery.data?.attachments || clientQuery.data?.attachments.length === 0 && 
              <div className='bg-gray-100 w-full rounded-lg h-[300px] flex flex-col items-center justify-center'>
                  No Attachments have been uploaded yet
                  <p className="text-sm text-center text-muted-foreground">Try  adding a new attachment</p>
              </div>
          }
          {
            clientQuery.data?.attachments?.map(attachment=>{
              const ext = attachment.name?.split(".")[1]
              let content
              if(ext === "jpg" || ext === "jpeg" || ext === "png" ){
                content = <img className="w-full" src={attachment.imageUrl}/>
              }else {
                content = <File className="w-28 h-28 text-gray-600" />
              }
              return <div key={attachment.id} className="border relative hover:bg-blue-100 hover:border-blue-700 w-1/2 lg:w-1/3 rounded-xl overflow-hidden">
                <DeleteAttachment id={Number(id)} attachmentId={attachment.id} name={attachment.name} trigger={<button className="absolute top-4 right-4 p-2 rounded-full border border-rose-300 hover:border-rose-700 text-rose-400 hover:text-rose-700"><Trash2 className="w-4 h-4" /></button>} />
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

export default ClientDetails

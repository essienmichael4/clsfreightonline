import AddAttachments from "@/components/AddAttachments"
import { Button } from "@/components/ui/button"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Client } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const ClientDetails = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const {id} = useParams()
  const axios_instance_token = useAxiosToken()

  const clientQuery = useQuery<Client>({
    queryKey: ["clients", id],
    queryFn: async() => await axios_instance_token.get(`/users/clients/${id}`).then(res => res.data)
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
          {/* {user.data && <EditProfile client={user.data} trigger={
            <Button className=" absolute right-4 border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent"><Edit /></Button>
          } />} */}
          <div className='absolute w-36 h-36 rounded-full bg-white border-4 border-gray-200 top-16 left-4'></div>
          <h3 className="font-bold md:text-4xl">{clientQuery.data?.shippingMark}</h3>
          <p className="mt-2 text-muted-foreground">{clientQuery.data?.email}</p>
          <p className="mt-2 text-muted-foreground">+{clientQuery.data?.phone}</p>
        </div>
      </div>
      <div className='relative my-4 border border-gray-300 rounded-lg p-4'>
        {/* {clientQuery.data && <EditInfoDialog client={clientQuery.data} trigger={
            <Button className=" absolute right-4 border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white bg-transparent"><Edit /></Button>
          } />} */}
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
    </div>
  )
}

export default ClientDetails

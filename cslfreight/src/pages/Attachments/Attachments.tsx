import { Skeleton } from "@/components/ui/skeleton"
import useAxiosToken from "@/hooks/useAxiosToken"
import { DownloadFile } from "@/lib/helper"
import { Attachment } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Download, File } from "lucide-react"
import { useParams } from "react-router-dom"

const Attachments = () => {
    const {id} = useParams()
    const axios_instance_token = useAxiosToken()
    const attachmentsQuery = useQuery<Attachment[]>({
        queryKey: ["attachments", id],
        queryFn: async() => await axios_instance_token.get(`/users/clients/${id}/attachments`).then(res => res.data)
    })

    return (
        <div className='mx-auto container mt-4 mb-16 px-4'>
            <div className='relative my-4 rounded-lg'>
                <h4 className="text-lg lg:text-xl font-semibold">My Attachments</h4>
                <div className="flex flex-wrap gap-8 mt-4">
                    {attachmentsQuery.isLoading && 
                        <Skeleton >
                        <div className="h-32 w-full">

                        </div>
                        </Skeleton>
                    }
                    {!attachmentsQuery.data || attachmentsQuery.data?.length === 0 && 
                        <div className='bg-gray-100 w-full rounded-lg h-[300px] flex flex-col items-center justify-center'>
                            No Attachments have been uploaded yet
                        </div>
                    }
                {
                    attachmentsQuery.data?.map(attachment=>{
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

export default Attachments

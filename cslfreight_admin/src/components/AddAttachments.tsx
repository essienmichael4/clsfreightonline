import { File, Loader2, X } from "lucide-react"
import Dropzone from "./Dropzone"
import { useCallback, useState } from "react"
import { Input } from "./ui/input"
import { toast } from "sonner"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosToken from "@/hooks/useAxiosToken"

interface Props{
    id: number,
    open: boolean,
    onOpenChange: ()=>void
}
const AddAttachments = ({id, open, onOpenChange}:Props) => {
    const [file, setFile] = useState<File & {preview:string} | undefined>()
    const [fileName, setFileName] = useState<string>("")
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const handleFileChange = useCallback((value:File & {preview:string} | undefined)=>{
        setFile(value)
    }, [])

    const addAttachments = async ()=>{
        if(!file){
            toast.error("Please hoose an image to upload", {
                id: "create-order"
            })
            return
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("filename", fileName)
        const response = await axios_instance_token.post(`/users/clients/${id}/upload`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            }
        })

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAttachments,
        onSuccess: ()=>{
            toast.success("Attachment added successfully", {
                id: "add-image"
            })

            queryClient.invalidateQueries({queryKey: ["clients", id]})
            
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-image"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-image"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Adding attachment...", {
            id: "add-image"
        })
        mutate()
    }

    const preview = file && file.type.split("/")[0] === "image" ? <img className='w-100%' src={file.preview} alt={file.name} /> : 
            file && file.type.split("/")[0] === "application" ? <div className="w-full h-full hidden lg:flex flex-col items-center justify-center">
            <File className="w-20 h-20 text-gray-600"/>
            <p className="text-gray-600 text-xl">{file?.name}</p>
        </div> : <div className="w-[320px]">
        </div>
    
    return (
        <div className={`${open ? "flex" : "hidden"} items-center justify-center z-50 absolute inset-0 bg-black/40`}>
            <div className="min-w-[350px] w-[50%] h-[70%] bg-white rounded-lg">
                <div className="px-8 w-full flex items-center justify-between bg-blue-700 h-16 rounded-t-lg">
                    <h4 className="text-white font-semibold text-lg">Add Attachment</h4>
                    <button onClick={onOpenChange} className="bg-transparent text-white border rounded p-1">
                        <X className="w-4 h-4"/>
                    </button>
                </div>
                <div className="mt-2 w-full px-8 flex items-center justify-around">
                    <div className=" w-full lg:w-[250px]">
                        <div>
                            <label className='text-xs 2xl:text-sm font-bold' htmlFor="filename">File name</label>
                            <Input onChange={(e)=> setFileName(e.target.value)} placeholder="Optional file name"/>
                        </div>
                        <Dropzone handleFileChange={handleFileChange} />
                        <button onClick={()=>onSubmit()} className="py-2 px-4 lg:hidden bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-lg">
                            {!isPending && "Add Attachment"}
                            {isPending && <Loader2 className='animate-spin' /> }
                        </button>
                    </div>
                    <div className="hidden lg:flex flex-col items-end w-[350px]">
                        <div className='w-full flex items-center justify-center mx-auto h-[320px] relative rounded-lg overflow-hidden'>
                            {/* {file && <button type='button' className=' absolute top-4 right-4 p-2 bg-white/80  rounded-lg' onClick={() => setFiles(undefined)}><Trash2 className='text-rose-700 w-4 h-4' /></button>} */}
                            {preview && preview}
                        </div>
                        <button onClick={()=>onSubmit()} className="mt-2 py-2 px-4 hidden lg:block bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-lg">
                            {!isPending && "Add Attachment"}
                            {isPending && <Loader2 className='animate-spin' /> }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAttachments

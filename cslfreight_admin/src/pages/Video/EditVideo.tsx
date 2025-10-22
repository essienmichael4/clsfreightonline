import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { Textarea } from "@/components/ui/textarea"
import useAxiosToken from "@/hooks/useAxiosToken"
import { VideoSchema, type VideoSchemaType } from "@/schema/video"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Info, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import PremierePicker from "./_components/PremierePicker"
import Tags from "../Invoices/_components/Tags"

const EditVideo = () => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const [thumbnail, setThumbnail] = useState<File | undefined>()
    const [tags, setTags] = useState<string[]>([])
    const { id } = useParams();
    
    const form = useForm<VideoSchemaType>({
        resolver:zodResolver(VideoSchema),
        defaultValues:{
            title: "",
            description: "",
            premiere: "Public"
        }
    })

    const handlePremiereChange = (value:"Public" | "Unlisted" | "Private" | "Scheduled")=>{
        form.setValue("premiere", value)        
    }

    const handleFileChange = (value: File[] | undefined) => {
        setThumbnail(value?.[0]);
    };

    const handleChange = (e: string[]) => {
        setTags(e)
    }

    const editVideo = async (data:VideoSchemaType)=>{
        if( thumbnail) {
            const formData = new FormData()
            formData.append("tags", JSON.stringify(tags))
            formData.append("title", data.title as string)
            formData.append("description", data.description as string)
            formData.append("premiere", data.premiere)
            formData.append("file", thumbnail)
            const response = await axios_instance_token.patch(`/videos/${id}/edit`, formData, {
            headers: {
                "content-type": "multipart/form-data",
            }},)
            return response.data
        }else{
            const response = await axios_instance_token.patch(`/videos/${id}/video-meta`, {...data})
            return response.data
        }
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editVideo,
        onSuccess: ()=>{
            toast.success("Video published successfully", {
                id: "edit-video"
            })

            queryClient.invalidateQueries({queryKey: ["videos"]})

            form.reset()
            navigate("/videos");
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-video"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-video"
                })
            }
        }
    })

    const onSubmit = (data:VideoSchemaType)=>{
        toast.loading("Publishing Video...", {
            id: "edit-video"
        })
        mutate(data)
    }

    return (
        <div className="container mx-auto py-4">
            <div className="w-full px-4">
                
                <button
                onClick={() => form.handleSubmit(onSubmit)()}
                className="text-xs px-4 py-1.5 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                >
                    {!isPending && "Publish"}
                    {isPending && <Loader2 className='animate-spin' />}
                </button>
                <div className="text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-500"/><p className="text-gray-500" > Click "Publish" to make the video live.</p>
                </div>
                <Form {...form}>
                    <form  className="mt-4 flex">
                        <div className="w-3/5 space-y-3 px-1">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) =>(
                                    <FormItem className='space-y-0'>
                                        <FormLabel className='text-xs'>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                            <FormField 
                                control={form.control}
                                name="description"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel className='text-xs'>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                            <FormField 
                                name="tags"
                                render={() =>(
                                    <FormItem>
                                        <FormLabel className='text-xs'>Video tags</FormLabel>
                                        <FormControl>
                                            <Tags value={tags} placeholder={"Tutorial, Lessons, Info"} onChange={handleChange}/>
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
                        </div>
                        <div className="w-2/5 px-1 space-y-3">
                            <FormField
                                name="premiere"
                                render={() =>(
                                    <FormItem className='space-y-0'>
                                        <FormLabel className='text-xs'>Premiere</FormLabel>
                                        <FormControl>
                                            <PremierePicker  onChange={handlePremiereChange}/>
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
                            <FormField
                                // control={form.control}
                                name="thumbnail"
                                render={() =>(
                                    <FormItem className='space-y-0'>
                                        <FormLabel className='text-xs'>Video Thumbnail</FormLabel>
                                        <FormControl>
                                            <Dropzone 
                                                maxFiles={1}
                                                accept={{ 'image/*': [] }}
                                                onDrop={handleFileChange}
                                            >
                                                <DropzoneEmptyState />
                                                <DropzoneContent />
                                            </Dropzone>
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default EditVideo

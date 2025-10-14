import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import axios from "axios";
import { Info, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Tags from "../Invoices/_components/Tags";
import { VideoSchema, type VideoSchemaType } from "@/schema/video";
import PremierePicker from "./_components/PremierePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxiosToken from "@/hooks/useAxiosToken";

export default function UploadProgressPage() {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const location = useLocation();
    const navigate = useNavigate();
    const { file, uploadUrl, key } = location.state || {};
    const [progress, setProgress] = useState(0);
    const [thumbnail, setThumbnail] = useState<File | undefined>()
    const [generatedThumbs, setGeneratedThumbs] = useState<string[]>([]);
    const [selectedThumb, setSelectedThumb] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([])

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

    const uploadMutation = useVideoUpload(setProgress);

    useEffect(() => {
        if (file && uploadUrl) {
            generateThumbnails(file);
            uploadMutation.mutate(
                { file, uploadUrl },
                {
                onSuccess: async () => {
                    await axios.post("/api/videos/complete", { key, filename: file.name });
                    // navigate("/upload-success");
                },
                }
            );
        }
    }, [file, uploadUrl, key, navigate]);

    if (!file || !uploadUrl) {
        return <div className="p-6 text-center text-gray-500">No upload session found.</div>;
    }

    const generateThumbnails = async (videoFile: File) => {
        const video = document.createElement("video");
        const videoUrl = URL.createObjectURL(videoFile);
        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.muted = true;

        await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
        });

        const duration = video.duration;
        const captureTimes = [duration * 0.1, duration * 0.5, duration * 0.9]; // 10%, 50%, 90%
        const thumbs: string[] = [];

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = 480;
        canvas.height = 270;

        for (const time of captureTimes) {
        await new Promise<void>((resolve) => {
            video.currentTime = time;
            video.onseeked = () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg");
            thumbs.push(dataUrl);
            resolve();
            };
        });
        }

        setGeneratedThumbs(thumbs);
        URL.revokeObjectURL(videoUrl);
    };

    const handleThumbnailSelect = async (dataUrl: string) => {
        setSelectedThumb(dataUrl);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
        setThumbnail(file);
    };

    const editVideo = async (data:VideoSchemaType)=>{
        const formData = new FormData()
        formData.append("key", key)
        formData.append("tags", JSON.stringify(tags))
        formData.append("title", data.title as string)
        formData.append("description", data.description as string)
        formData.append("premiere", data.premiere)
        if( thumbnail) {
            formData.append("file", thumbnail)
        }
        else {
            const firstThumbUrl = generatedThumbs[0];
            const res = await fetch(firstThumbUrl);
            const blob = await res.blob();
            const autoThumb = new File([blob], "auto-thumbnail.jpg", { type: "image/jpeg" });
            formData.append("file", autoThumb);
        }
        const response = await axios_instance_token.patch(`/videos/thumbnail`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        }},)
        return response.data
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
        <div className="p-6 flex">
            <div className="w-1/4">
                <div className="w-full max-w-lg aspect-video bg-gray-200 dark:bg-gray-800 rounded-md mb-2">

                </div>
                <h1 className="text-sm font-medium mb-4">Uploading: {file.name}</h1>
                <div className="w-full max-w-lg bg-gray-200 dark:bg-gray-800 rounded-full h-4 mb-2">
                    <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{progress}%</p>

                {uploadMutation.isError && (
                    <p className="mt-4 text-red-600">
                    ❌ Upload failed — {String(uploadMutation.error)}
                    </p>
                )}
            </div>
            <div className="w-3/4 px-4">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-full relative bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                        className="bg-blue-600 absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                        ></div>
                        <div className="py-2 px-4 text-xs text-center relative z-10 text-white">
                        <p>{progress < 100 ? `Uploading ${progress}%` : "Processing..."}</p>
                        </div>
                    </div>
                    {progress < 100 ? (
                        <button
                        disabled
                        className="text-xs px-4 py-1.5 bg-gray-500 text-white rounded-md cursor-not-allowed"
                        >
                        Uploading...
                        </button>
                    ) : (
                        <button
                        onClick={() => form.handleSubmit(onSubmit)()}
                        className="text-xs px-4 py-1.5 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                        >
                            {!isPending && "Publish"}
                            {isPending && <Loader2 className='animate-spin' />}
                        </button>
                    )}
                  </div>
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
                             {/* Thumbnail suggestions */}
                            {generatedThumbs.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs font-medium mb-1">Suggested Thumbnails:</p>
                                <div className="flex gap-2">
                                {generatedThumbs.map((thumb, idx) => (
                                    <div className="w-1/2 p-2">
                                        <img
                                        key={idx}
                                        src={thumb}
                                        alt={`Thumb ${idx + 1}`}
                                        className={`w-32 aspect-video object-cover rounded-md cursor-pointer border-2 ${
                                            selectedThumb === thumb ? "border-blue-600" : "border-transparent"
                                        }`}
                                        onClick={() => handleThumbnailSelect(thumb)}
                                        />
                                    </div>
                                ))}
                                </div>
                            </div>
                            )}
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
    );
}

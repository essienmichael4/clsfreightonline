import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import type { Video } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    page: number,
    limit: number,
    video: Video
}

const DeleteVideo = ({video, page, limit, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const deleteVideo = async ()=>{
        const response = await axios_instance_token.delete(`/videos/${video.id}`)
        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: deleteVideo,
        onSuccess: ()=>{
            toast.success("Video deleted successfully", {
                id: "delete-video"
            })

            queryClient.invalidateQueries({queryKey: ["videos", page, limit]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "delete-video"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "delete-video"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting video...", {
            id: "delete-video"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Delete Video: {video.title}
                    </DialogTitle>
                </DialogHeader>
                <div className='text-sm text-rose-600'>
                    Are you sure you want to delete this video with name: {video.title}?
                    Please note that this action cannot be reversed.
                </div>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={isPending} className='bg-gradient-to-r from-rose-500 to-rose-800 text-white'
                    >
                        {!isPending && "Delete Video"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteVideo

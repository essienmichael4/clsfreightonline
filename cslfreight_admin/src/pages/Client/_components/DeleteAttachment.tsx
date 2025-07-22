import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    attachmentId:number,
    name:string
}

const DeleteAttachment = ({id, attachmentId, name, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const deleteAttachments = async ()=>{
        const response = await axios_instance_token.delete(`/users/clients/${id}/attachments/${attachmentId}`)
        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: deleteAttachments,
        onSuccess: ()=>{
            toast.success("Attachment deleted successfully", {
                id: "delete-attachment"
            })

            queryClient.invalidateQueries({queryKey: ["clients", id]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "delete-attachment"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "delete-attachment"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting attachment...", {
            id: "delete-attachment"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Delete Attachment: {name.split("-").length === 7 ? name.split("-")[0].replace(/_+/g,' ') : name.split("-")[name.split("-").length - 1].replace(/_+/g,' ')}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    Are you sure you want to delete this Attachment?
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
                        {!isPending && "Delete Attachment"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAttachment

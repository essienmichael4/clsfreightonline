import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import type { PackageTypeAndRate } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    rate:PackageTypeAndRate
}

const DeleteRate = ({trigger, id, rate}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const deleteRate = async ()=>{
        const response = await axios_instance_token.delete(`/packages/shipping-rates/${id}`,)
        return response.data
    }    

    const {mutate, isPending} = useMutation({
        mutationFn: deleteRate,
        onSuccess: ()=>{
            toast.success(`Rate deleted successfully`, {
                id: "delete-rate"
            })

            queryClient.invalidateQueries({queryKey: ["rates"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "delete-rate"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "delete-rate"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting rate...", {
            id: "delete-rate"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Delete Rate: {rate.description}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <p>Are you sure you want to delete this rate? This action is not reversible. You may continue to delete whenever you are ready. </p>
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
                        {!isPending && "Delete Rate"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteRate

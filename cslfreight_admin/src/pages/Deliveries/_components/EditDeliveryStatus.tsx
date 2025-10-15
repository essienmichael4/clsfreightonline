import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { type DeliveryStatusSchemaType, DeliveryStatusSchema} from '@/schema/delivery'
import StatusPicker from './StatusPicker'
import type { Delivery } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    delivery: Delivery
}

const EditDeliveryStatus = ({id, delivery, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const handleStatusChange = (value:"Completed" | "Pending")=>{
        form.setValue("status", value)        
    }

    const form = useForm<DeliveryStatusSchemaType>({
        resolver:zodResolver(DeliveryStatusSchema),
        defaultValues:{
            status: delivery.status
        }
    })

    const addPackage = async (data:DeliveryStatusSchemaType)=>{
        const response = await axios_instance_token.patch(`/deliveries/${id}/status`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addPackage,
        onSuccess: ()=>{
            toast.success("Delivery status updated successfully", {
                id: "edit-delivery"
            })

            queryClient.invalidateQueries({queryKey: ["deliveries", id]})
            queryClient.invalidateQueries({queryKey: ["deliveries"]})
            form.reset({
                status: delivery.status
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-delivery"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-delivery"
                })
            }
        }
    })

    const onSubmit = (data:DeliveryStatusSchemaType)=>{
        toast.loading("Editing delivery...", {
            id: "edit-delivery"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Delivery Status
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1 w-full'>
                        <FormField 
                            control={form.control}
                            name="status"
                            render={({}) =>(
                                <FormItem className='flex flex-col'>
                                    <FormLabel className='my-1 text-xs'>Status</FormLabel>
                                    <FormControl>
                                        <StatusPicker onChange={handleStatusChange}/>
                                    </FormControl>
                                    <FormDescription className='text-xs'>Select a status</FormDescription>
                                </FormItem>
                            )} 
                        />
                    </form>
                </Form>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Update Status"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditDeliveryStatus

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { type DeliveryConfirmationSchemaType, DeliveryConfirmationSchema} from '@/schema/delivery'
import ConfirmationPicker from './ConfirmationPicker'
import type { Delivery } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    delivery: Delivery
}

const EditConfirmationStatus = ({id, delivery, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const handleStatusChange = (value:"Confirmed" | "Pending" | "Declined")=>{
        form.setValue("confirmation", value)        
    }

    const form = useForm<DeliveryConfirmationSchemaType>({
        resolver:zodResolver(DeliveryConfirmationSchema),
        defaultValues:{
            confirmation: delivery.isConfirmed
        }
    })

    const addPackage = async (data:DeliveryConfirmationSchemaType)=>{
        const response = await axios_instance_token.patch(`/deliveries/${id}/confirmation`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addPackage,
        onSuccess: ()=>{
            toast.success("Delivery confirmation updated successfully", {
                id: "edit-delivery"
            })

            queryClient.invalidateQueries({queryKey: ["deliveries", id]})
            queryClient.invalidateQueries({queryKey: ["deliveries"]})
            form.reset({confirmation: delivery.isConfirmed})

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

    const onSubmit = (data:DeliveryConfirmationSchemaType)=>{
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
                        Edit Delivery Confirmation
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1 w-full'>
                        <FormField 
                            control={form.control}
                            name="confirmation"
                            render={({}) =>(
                                <FormItem className='flex flex-col'>
                                    <FormLabel className='my-1 text-xs'>Confirmation</FormLabel>
                                    <FormControl>
                                        <ConfirmationPicker onChange={handleStatusChange}/>
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
                        {!isPending && "Update Confirmation"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditConfirmationStatus

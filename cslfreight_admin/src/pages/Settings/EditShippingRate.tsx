import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import  { RateSchema,  type RateType } from '@/schema/package'
import type { Rate } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    rate: Rate
}

const EditShippingRate = ({rate, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<RateType>({
        resolver:zodResolver(RateSchema),
        defaultValues:{
            rate: Number(rate.rate),
        }
    })

    const editRate = async (data:RateType)=>{
        
        const response = await axios_instance_token.patch(`/packages/rate/${rate.id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editRate,
        onSuccess: ()=>{
            toast.success("Rate edited successfully", {
                id: "rate"
            })

            queryClient.invalidateQueries({queryKey: ["rate"]})
            form.reset({})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "rate"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "rate"
                })
            }
        }
    })

    const onSubmit = (data:RateType)=>{
        toast.loading("Editing rate...", {
            id: "rate"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit USD - GHS Rate
                    </DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form className='space-y-1 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control}
                            name="rate"
                            render={({field}) =>(
                                <FormItem className='flex flex-col w-full'>
                                    <FormLabel className='my-1 font-semibold text-xs'>Rate (¢ GHS)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number"
                                            className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                            placeholder='Please enter rate' {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                        {!isPending && "Edit Rate"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditShippingRate

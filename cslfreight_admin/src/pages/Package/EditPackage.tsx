import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { EditPackageSchema, EditPackageSchemaType } from '@/schema/package'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'

interface Props{
    trigger?: React.ReactNode,
    id:number,
    trackingNumber:string
}

const EditPackage = ({id, trackingNumber, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()

    const form = useForm<EditPackageSchemaType>({
        resolver:zodResolver(EditPackageSchema),
        defaultValues:{
            package: "",
            email: "",
            phone: "",
            trackingNumber: "",
            vessel: "",
            customer: "",
        }
    })

    const addPackage = async (data:EditPackageSchemaType)=>{
        const response = await axios_instance_token.patch(`/${id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addPackage,
        onSuccess: ()=>{
            toast.success("Package editted successfully", {
                id: "edit-package"
            })

            form.reset({
                package: "",
                email: "",
                phone: "",
                trackingNumber: "",
                vessel: "",
                customer: "",
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "edit-package"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-package"
                })
            }
        }
    })

    const onSubmit = (data:EditPackageSchemaType)=>{
        toast.loading("Editing package...", {
            id: "edit-package"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Package: {trackingNumber}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1 h-72 overflow-y-scroll'>
                        <FormField
                            control={form.control}
                            name="trackingNumber"
                            render={({field}) =>(
                                <FormItem className='flex-1 px-1'>
                                    <FormLabel className='text-xs'>Tracking Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <div className='flex flex-wrap'>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField
                                    control={form.control}
                                    name="customer"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Customer</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>

                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="phone"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="cbm"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>CBM</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="quantity"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Quantity</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="package"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Package</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                            <div className='w-full sm:w-1/2 px-1'>
                                <FormField 
                                    control={form.control}
                                    name="vessel"
                                    render={({field}) =>(
                                        <FormItem className='w-full'>
                                            <FormLabel className='text-xs'>Vessel Line</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                        </div>
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
                        {!isPending && "Edit Package"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditPackage

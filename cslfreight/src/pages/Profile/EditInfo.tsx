import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
import axios from 'axios'
import { CalendarIcon, Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Client } from '@/lib/types'
import {  EditClientInfoSchema, EditClientInfoSchemaType } from '@/schema/client'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'

interface Props {
    client:Client,
    trigger?: React.ReactNode,
}

const EditInfoDialog = ({client, trigger}:Props) => {
    const [phone, setPhone] = useState(client.clientDetails?.nextOfKinPhone || "")
    const axios_instance_token = useAxiosToken()
    const [open, setOpen] = useState(false)

    const form = useForm<EditClientInfoSchemaType>({
        resolver:zodResolver(EditClientInfoSchema),
        defaultValues:{
            nextOfKinPhone: client.clientDetails?.nextOfKinPhone || "",
            nextOfKin: client.clientDetails?.nextOfKin || "",
            dob: client.clientDetails?.dob ? new Date(client.clientDetails?.dob) : undefined,
            location: client.clientDetails?.location || ""
        }
    })

    const updateClient = async (data:EditClientInfoSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/clients/${client.id}/info`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updateClient,
        onSuccess: ()=>{
            toast.success("Client update successful", {
                id: "client-update"
            })

            form.reset({})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.massage, {
                    id: "client-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "client-update"
                })
            }
        }
    })

    const onSubmit = (data:EditClientInfoSchemaType)=>{
        toast.loading("Updating client...", {
            id: "client-update"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Client
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField 
                            control={form.control}
                            name="location"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Location</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Kumasi'/>
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField 
                            control={form.control}
                            name="dob"
                            render={({field}) =>(
                                <FormItem className='flex flex-col w-full'>
                                    <FormLabel className='my-1 text-xs'>Date of Birth</FormLabel>
                                    <Popover >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button 
                                                variant={'outline'}
                                                className={cn("w-full pl-3 text-xs text-left font-normal", !field.value && 'text-muted-foreground')}>
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className='p-0 w-auto'>
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(value)=>{
                                                    if(!value) return
                                                    field.onChange(value)
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="nextOfKin"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Next of Kin (Name)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='John Doe'/>
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField 
                            control={form.control}
                            name="nextOfKinPhone"
                            render={({}) =>(
                                <FormItem className='w-full flex flex-1 flex-col mb-0'>
                                    <FormLabel className='text-xs font-bold'>Next of Kin (Phone)</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            country="gh"
                                            value={phone}
                                            onChange={(value)=>setPhone(value)}
                                            onBlur={()=>form.setValue("nextOfKinPhone", phone)}
                                            containerStyle={{
                                                width: "100%",
                                                border: "1 px solid #ebebeb"
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className='text-xs text-gray-300 mb-0'>Contact to be reached on.</FormDescription>
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white py-2'
                    >
                        {!isPending && "Edit Details"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditInfoDialog

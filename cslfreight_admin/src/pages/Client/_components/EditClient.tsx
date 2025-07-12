import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Client } from '@/lib/types'
import { EditClientSchemaType, EditClientSchema } from '@/schema/client'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"

interface Props {
    client:Client,
    trigger?: React.ReactNode,
    page: number, 
    limit: number, 
    search: string
}

const EditClientDialog = ({client, trigger, page, limit, search}:Props) => {
    const [phone, setPhone] = useState(client.phone || "")
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const form = useForm<EditClientSchemaType>({
        resolver:zodResolver(EditClientSchema),
        defaultValues:{
            phone: client.phone,
            shippingMark: client.shippingMark
        }
    })

    const updateClient = async (data:EditClientSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/clients/${client.id}`, {
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
            queryClient.invalidateQueries({queryKey: ["clients", page, limit, search]})

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

    const onSubmit = (data:EditClientSchemaType)=>{
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
                            name="shippingMark"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Shipping Mark</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField 
                            control={form.control}
                            name="phone"
                            render={({}) =>(
                                <FormItem className='w-full flex flex-1 flex-col mb-0'>
                                    <FormLabel className='text-xs font-bold'>Phone</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            country="gh"
                                            value={phone}
                                            onChange={(value)=>setPhone(value)}
                                            onBlur={()=>form.setValue("phone", phone)}
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
                        {!isPending && "Edit Account"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditClientDialog

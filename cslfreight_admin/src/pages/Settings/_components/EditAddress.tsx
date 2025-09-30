import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { useState } from 'react'
import { type AddInvoiceAddressSchemaType , AddInvoiceAddressSchema} from '@/schema/address'
import type { InvoiceAddressType } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    address: InvoiceAddressType
}

const EditAddress = ({trigger, address}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<AddInvoiceAddressSchemaType>({
        resolver:zodResolver(AddInvoiceAddressSchema),
        defaultValues:{
            name: address.name,
            streetAddress: address.streetAddress,
            state: address.state,
            city: address.city,
            addressLine: address.state,
            box: address.box
        }
    })

    const addAddress = async (data:AddInvoiceAddressSchemaType)=>{
        const response = await axios_instance_token.patch(`/settings/address/${address.id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAddress,
        onSuccess: ()=>{
            toast.success("Address edited successfully", {
                id: "edit-address"
            })

            queryClient.invalidateQueries({queryKey: ["settings", "address"]})

            form.reset({})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-address"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-address"
                })
            }
        }
    })

    const onSubmit = (data:AddInvoiceAddressSchemaType)=>{
        toast.loading("Editing address...", {
            id: "edit-address"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Invoice Address
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Address Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField
                            control={form.control}
                            name="addressLine"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Address Line</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField
                            control={form.control}
                            name="streetAddress"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Street Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="box"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>P.O. Box number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <div className='flex gap-2'>
                            <FormField 
                                control={form.control}
                                name="city"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel className='text-xs'>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
                            <FormField 
                                control={form.control}
                                name="state"
                                render={({field}) =>(
                                    <FormItem>
                                        <FormLabel className='text-xs'>State</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white py-2'
                    >
                        {!isPending && "Edit Address"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditAddress

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
import { MembershipTierSchema, MembershipTierSchemaType } from '@/schema/membership'
import { Textarea } from '@/components/ui/textarea'

interface Props {
    trigger?: React.ReactNode
}

const AddMembershipTierDialog = ({trigger}:Props) => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const form = useForm<MembershipTierSchemaType>({
        resolver:zodResolver(MembershipTierSchema),
        defaultValues:{}
    })

    const updateClient = async (data:MembershipTierSchemaType)=>{
        const response = await axios_instance_token.post(`/users/memberships`, {
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
            queryClient.invalidateQueries({queryKey: ["memberships"]})

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

    const onSubmit = (data:MembershipTierSchemaType)=>{
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
                        New Membership Tier
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Tier Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Bronze' />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="priority"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Tier priority</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='1' />
                                    </FormControl>
                                    <FormDescription>e.g., 1 = Bronze, 4 = Platinum</FormDescription>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="minShipping"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Minimum Shipping Rate</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='9999' />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="description"
                            render={({field}) =>(
                                <FormItem className='flex flex-col'>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
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
                        {!isPending && "Add Tier"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddMembershipTierDialog

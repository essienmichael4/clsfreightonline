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
import { type AddBankSchemaType , AddBankSchema} from '@/schema/warehouse'
import type { BankType } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    bank: BankType
}

const EditBank = ({trigger, bank}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<AddBankSchemaType>({
        resolver:zodResolver(AddBankSchema),
        defaultValues:{
            name: bank.name,
            accountName: bank.accountName,
            accountNumber: bank.accountNumber,
            branch: bank.branch
        }
    })

    const addAddress = async (data:AddBankSchemaType)=>{
        const response = await axios_instance_token.patch(`/settings/banks/${bank.id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAddress,
        onSuccess: ()=>{
            toast.success("Bank edited successfully", {
                id: "edit-bank"
            })

            queryClient.invalidateQueries({queryKey: ["settings", "banks"]})

            form.reset({})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-bank"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-bank"
                })
            }
        }
    })

    const onSubmit = (data: AddBankSchemaType)=>{
        toast.loading("Editing bank...", {
            id: "edit-bank"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Bank Details
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField
                            control={form.control}
                            name="branch"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Branch</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Account Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField
                            control={form.control}
                            name="accountName"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
                                    <FormLabel className='text-xs'>Name on Account</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                        {!isPending && "Edit Bank"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditBank

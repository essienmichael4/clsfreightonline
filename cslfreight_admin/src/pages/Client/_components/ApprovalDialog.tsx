import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import useAxiosToken from "@/hooks/useAxiosToken"
import type { Client } from "@/lib/types"
import { EditClientApprovalSchema, type EditClientApprovalSchemaType } from "@/schema/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import ApprovalPicker from "./ApprovalPicker"

interface Props {
    client:Client,
    trigger?: React.ReactNode,
    page: number, 
    limit: number, 
    search: string
}

const ApprovalDialog = ({client, trigger, page, limit, search}:Props) => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const form = useForm<EditClientApprovalSchemaType>({
        resolver:zodResolver(EditClientApprovalSchema),
        defaultValues:{
            approvalStatus: client.approvalStatus as "PENDING" | "APPROVED" | "REJECTED"
        }
    })

    const updateClient = async (data:EditClientApprovalSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/clients/${client.id}/approval`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updateClient,
        onSuccess: ()=>{
            toast.success("Client approval update successful", {
                id: "client-update-approval"
            })

            form.reset({})
            queryClient.invalidateQueries({queryKey: ["clients", page, limit, search]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "client-update-approval"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "client-update-approval"
                })
            }
        }
    })

    const onSubmit = (data:EditClientApprovalSchemaType)=>{
        toast.loading("Updating client approval...", {
            id: "client-update-approval"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Client Approval Status
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField 
                            control={form.control}
                            name="approvalStatus"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Approval Status</FormLabel>
                                    <FormControl>
                                        <ApprovalPicker onChange={(value)=>{
                                            field.onChange(value)
                                        }} />
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
                        {!isPending && "Edit Approval Status"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ApprovalDialog

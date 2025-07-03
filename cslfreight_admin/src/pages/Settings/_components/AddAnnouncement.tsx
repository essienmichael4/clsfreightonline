import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Tiptap from "@/components/RichTextEditor/Tiptap"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { useState } from 'react'
import { AddAnnouncementSchema, AddAnnouncementSchemaType,  } from '@/schema/announcement'

interface Props{
    trigger?: React.ReactNode,
}

const AddAnnouncement = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<AddAnnouncementSchemaType>({
        resolver:zodResolver(AddAnnouncementSchema),
        defaultValues:{
            title: "",
            subject: "",
        }
    })

    const addAnnouncement = async (data:AddAnnouncementSchemaType)=>{
        const response = await axios_instance_token.post(`/announcements/clients`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAnnouncement,
        onSuccess: ()=>{
            toast.success("Announcement added successfully", {
                id: "add-announcement"
            })

            queryClient.invalidateQueries({queryKey: ["announcements"]})

            form.reset({
                title: "",
                subject: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-announcement"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-announcement"
                })
            }
        }
    })

    const onSubmit = (data:AddAnnouncementSchemaType)=>{
        toast.loading("Adding announcement...", {
            id: "add-announcement"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add Announcement
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2 h-72 overflow-y-scroll'>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                        <FormField
                            control={form.control}
                            name="subject"
                            render={({field}) =>(
                                <FormItem className='md:max-w-[400px] lg:max-w-[480px] xl:max-w-[700px] space-y-1'>
                                    <FormLabel className='text-xs'>Subject</FormLabel>
                                    <FormControl>
                                        <Tiptap onChange={field.onChange} />
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
                        {!isPending && "Add Announcement"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddAnnouncement

import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { PasswordInput } from '@/components/ui/password-input'
import { UserPasswordUpdateSchema, UserPasswordUpdateSchemaType } from '@/schema/client'

interface Props{
    id:number,
    trigger?: React.ReactNode,
}

const ChangePassword = ({id, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()

    const form = useForm<UserPasswordUpdateSchemaType>({
        resolver:zodResolver(UserPasswordUpdateSchema),
        defaultValues:{
            oldPassword: "",
            confirmPassword: "",
            newPassword: ""
        }
    })

    const updatePassword = async (data:UserPasswordUpdateSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/password/${id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updatePassword,
        onSuccess: ()=>{
            toast.success("Password update successful", {
                id: "password-update"
            })

            form.reset({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "password-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "password-update"
                })
            }
        }
    })

    const onSubmit = (data:UserPasswordUpdateSchemaType)=>{
        toast.loading("Updating account password...", {
            id: "password-update"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Change Password
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Current Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                        <FormField 
                            control={form.control}
                            name="newPassword"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>New Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField 
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white py-2]'
                    >
                        {!isPending && "Change Password"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePassword

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { User } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    user:User
}

const DeleteUser = ({user, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    

    const addUser = async ()=>{
        const response = await axios_instance_token.delete(`/users/${user.id}`)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addUser,
        onSuccess: ()=>{
            toast.success("User deleted successfully", {
                id: "delete-user"
            })

            queryClient.invalidateQueries({queryKey: ["users"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "delete-user"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "delete-user"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting user...", {
            id: "delete-user"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit User
                    </DialogTitle>
                </DialogHeader>
                <div>
                    Are you sure you want to delete this user?
                </div>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={isPending} className='bg-gradient-to-r from-rose-500 to-rose-800 text-white'
                    >
                        {!isPending && "Delete Package"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteUser

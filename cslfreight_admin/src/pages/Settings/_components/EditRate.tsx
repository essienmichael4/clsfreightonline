import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { PackageTypeAndRate } from "@/lib/types"
import { PackageRateType, PackageRate } from "@/schema/package"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props{
    trigger?: React.ReactNode,
    id:number,
    rate:PackageTypeAndRate
}

const EditRate = ({id, rate, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<PackageRateType>({
        resolver:zodResolver(PackageRate),
        defaultValues: rate ? {
            description: rate.description || "",
            rate: Number(rate.rate) || 0,
            cedisRate: Number(rate.cedisRate) || 0
        } : undefined
    })

    const editPackageRate = async (data:PackageRateType)=>{
        const response = await axios_instance_token.patch(`/packages/shipping-rates/${id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editPackageRate,
        onSuccess: ()=>{
            toast.success("Rate updated successfully", {
                id: "package-rate"
            })

            queryClient.invalidateQueries({queryKey: ["rates"]})
            form.reset({
                description: rate.description,
                rate: rate.rate
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "package-rate"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "package-rate"
                })
            }
        }
    })

    const onSubmit = (data:PackageRateType)=>{
        toast.loading("Editing rate...", {
            id: "package-rate"
        })
        mutate(data)
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Shipping Rate
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1 w-full'>
                        <FormField 
                            control={form.control}
                            name="description"
                            render={({field}) =>(
                                <FormItem className='flex flex-col w-full'>
                                    <FormLabel className='my-1 font-semibold text-xs'>Description</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                            placeholder='Please enter rate description' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="rate"
                            render={({field}) =>(
                                <FormItem className='flex flex-col w-full'>
                                    <FormLabel className='my-1 font-semibold text-xs'>Rate ($ USD)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                            placeholder='Please enter rate' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="cedisRate"
                            render={({field}) =>(
                                <FormItem className='flex flex-col w-full'>
                                    <FormLabel className='my-1 font-semibold text-xs'>Rate (¢ GHS)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                            placeholder='Please enter rate' {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Edit Rate"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditRate

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import ShippingMark from "@/pages/Package/ShippingMarkPicker"
import { PaymentSchemaType, PaymentSchema } from "@/schema/payments"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props{
    trigger?: React.ReactNode,
}

const CreatePaymentDialog = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const [shippingMark, setShippingMark] = useState("")
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<PaymentSchemaType>({
        resolver:zodResolver(PaymentSchema),
    })

    const handleShippingChange = (value:string)=>{
        setShippingMark(value)        
    }

    const addPayment = async (data:PaymentSchemaType)=>{
        const response = await axios_instance_token.post(`/users/clients/${shippingMark}/payments`, {
            ...data
        })

        return response.data
    }
    
    const {mutate, isPending} = useMutation({
        mutationFn: addPayment,
        onSuccess: ()=>{
            toast.success("Payment added successfully", {
                id: "add-payment"
            })

            queryClient.invalidateQueries({queryKey: ["payments"]})
            form.reset()

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-payment"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-payment"
                })
            }
        }
    })

    const onSubmit = (data:PaymentSchemaType)=>{
        toast.loading("Adding payment...", {
            id: "add-payment"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add Payment
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-1 w-full'>
                        <FormField 
                            name="shippingMark"
                            render={() =>(
                                <FormItem className='flex flex-col w-full'>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Client Shipping Mark</FormLabel>
                                    <FormControl>
                                        <ShippingMark onChange={handleShippingChange}/>
                                    </FormControl>
                                    {/* <FormDescription>Select a date for this transaction</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="paidShippingRate"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Paid Shiping Fee</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='9999' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="paymentMethod"
                            render={({field}) =>(
                                <FormItem className='flex flex-col'>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Payment Method</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., Cash, Momo, Card"/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="reference"
                            render={({field}) =>(
                                <FormItem className='flex flex-col'>
                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Payment Reference</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., Invoice reference"/>
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Add Payment"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
    
}

export default CreatePaymentDialog

import { Loader2 } from 'lucide-react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { axios_instance } from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { Input } from './ui/input'
import { PasswordInput } from './ui/password-input'
import { RegisterSchema, RegisterSchemaType } from '@/schema/login'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"

const RegisterForm = () => {
    const [phone, setPhone] = useState("")
    const {dispatch} = useAuth()
    const [isPending, setIsPending] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dashboard'
    
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            shippingMark: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data:RegisterSchemaType) =>{
        try{
            setIsPending(true)
            toast.loading("Signing Up...", {
                id: "login"
            })

            const response = await axios_instance.post("/auth/signup/client", {
                email: data.email,
                password: data.password,
                shippingMark: data.shippingMark,
                confirmPassword: data.confirmPassword,
                phone: data.phone

            })
            
            dispatch({type: "ADD_AUTH", payload: response.data})
            form.reset()
            setIsPending(false)
            toast.success("Register successful", {
                id: "login"
            })            
            
            navigate(from, {replace:true})
            
        }catch(err:any){
            setIsPending(false)
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "login"
                })
            }
        }
    }
    
    return (
        <div>
            <Form {...form}>
                <form className='md:w-full xl:w-[80%] mt-6' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="shippingMark"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-1'>
                                <FormLabel className='text-xs font-bold'>Shipping Mark</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='py-1 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your shipping mark' {...field} />
                                </FormControl>
                                <FormDescription className='text-xs text-gray-300' >Use shipping mark given by cslfrieght.</FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-1'>
                                <FormLabel className='text-xs font-bold'>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='py-1 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='example@gmail.com' {...field} />
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
                    <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-0'>
                                <FormLabel className='text-xs font-bold'>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput 
                                        className='py-1 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your password'
                                        {...field} />
                                </FormControl>
                                <FormDescription className='text-xs text-gray-300 mb-0'>Minimum 8 characters</FormDescription>
                            </FormItem>
                        )}
                    />
                    
                    <FormField 
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-2'>
                                <FormLabel className='text-xs font-bold'>Confirm Password</FormLabel>
                                <FormControl>
                                    <PasswordInput 
                                        className='py-2 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your password'
                                        {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <button className='rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-800 w-full text-sm text-white py-2' disabled={isPending}> 
                        {!isPending && "Register"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </button>
                    <div className='flex gap-2 mb-3 mt-2'>
                        <p className='text-gray-400 text-xs 2xl:text-sm'>Already have an account?
                        </p>
                        
                        <Link to={"../login"} className='text-xs 2xl:text-sm text-blue-700'>Login</Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default RegisterForm

import shipping from "../../assets/shipping.jpg"
import logo from "../../assets/logo.webp"
import RegisterForm from "@/components/RegisterForm"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"

const Register = () => {
  return (
    <>
        <div className="h-screen flex flex-col md:flex-row w-full max-h-[800px] items-center md:justify-between">
            <div className="w-full mb-8 flex justify-center items-start bg-cover bg-center text-black md:hidden" style={{backgroundImage:`url(${shipping})`}}>
                <div className="py-8 w-full bg-white/25 ">
                    <div className="px-4 w-full sm:w-3/4">
                        <Link to={"/"} className="font-semibold text-xs flex gap-2 items-center text-blue-700" > <ArrowLeftIcon className="w-4 h-4" /> Go Back</Link>
                        <div className="w-16 h-16 mb-6 mt-2 md:hidden">
                            <Link to={'../'}><img src={logo} alt="logo" /></Link>
                        </div>
                        <div className="md:hidden">
                            <h2 className="text-4xl mb-2 font-semibold">Sign up</h2>
                            <p className="font-medium text-xs">Let's help you register an account...</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-start w-full lg:w-[50%]">
                <div className="px-4 w-full sm:w-3/4">
                    <Link to={"/"} className="text-blue-700 font-semibold text-xs flex gap-2 items-center" > <ArrowLeftIcon className="w-4 h-4" /> Go Home</Link>
                    <div className="w-16 h-16 mb-4 mt-2 hidden md:block">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="hidden md:block">
                        <h2 className="font-bold text-4xl mb-1">Sign up</h2>
                        <p className="text-neutral-500 text-xs">Let's help you register an account...</p>
                    </div>

                    <RegisterForm />
                </div>
            </div>
            <div className="w-full hidden md:block lg:w-[50%] h-full p-4 rounded-lg overflow-hidden">
                <div className={`w-full h-full bg-slate-500 flex bg-cover rounded-lg bg-center`} style={{backgroundImage:`url(${shipping})`}}>
                    <div className="overlay w-full h-full bg-black opacity-40 sm:hidden"></div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Register

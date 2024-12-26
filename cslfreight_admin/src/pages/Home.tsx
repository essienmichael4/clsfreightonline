import shipping from "../assets/shipping.jpg"
import logo from "../assets/logo.webp"
import Login from "@/components/Login"

const Home = () => {
  return (
    <>
        <div className="h-screen flex w-full max-h-[800px] items-center justify-between">
            <div className="flex justify-center items-start w-full lg:w-[50%]">
                <div className="w-3/4">
                    <div className="w-16 h-16 mb-6">
                        <img src={logo} alt="logo" />
                    </div>
                    <div>
                        <h2 className="font-bold text-4xl mb-2">Sign in</h2>
                        <p className="text-neutral-500 text-sm">Welcome to CCSL Freight Admin Panel - Let's help you sign in</p>
                    </div>

                    <Login />
                </div>
            </div>
            <div className="w-full  lg:w-[50%] h-full p-4 rounded-lg overflow-hidden">
                <div className={`w-full h-full bg-slate-500 flex bg-cover rounded-lg bg-center`} style={{backgroundImage:`url(${shipping})`}}>
                    <div className="overlay w-full h-full bg-black opacity-40 sm:hidden"></div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Home

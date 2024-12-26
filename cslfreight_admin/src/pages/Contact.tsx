import { MailCheck, MapPinned, PhoneCall } from "lucide-react"
import shipping from "../assets/shipping.jpg"
import Footer from "@/components/Footer"
import useAuth from "@/hooks/useAuth"

const Contact = () => {
    const {auth} = useAuth()
    return (
        <>
            <div className="container mx-auto">
                <div className="mt-12">
                    <div className="px-6  flex flex-wrap mt-10 rounded-lg justify-center items-center">
                        <div className="p-2 w-full lg:w-1/2 space-y-4">
                            <h2 className="text-3xl sm:text-5xl lg:text-6xl tracking-wide">
                                We are here to help you with your vessel cleaning services {auth?.user.email}
                            </h2>
                        </div>
                        <div className="p-2 w-full lg:w-1/2">
                            <img src={shipping} alt="" className="rounded-lg aspect-video border border-[#FF9D00] shadow shadow-orange-400"/>
                        </div>
                    </div>
                </div>
                <div className="mt-20 px-6">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl tracking-wide mb-12">
                        Reach out to us directly
                    </h2>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 lg:w-1/4 sm:px-4 py-2 mb-8">
                            <div className="border border-gray-300 p-4">
                                <div className="bg-[#ff9d00]/50 w-10 h-10 flex items-center justify-center rounded-full">
                                    <MailCheck className="text-[#ff9d00] w-5 h-5"/>
                                </div>
                                <p className="font-bold mt-12 text-lg">Send us message</p>
                                <p className="text-xs mt-3">Chat with our friendly team</p>
                                <p className="test-sm mt-8">kojosavage@ymail.com</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/4 sm:px-4 py-2 mb-8">
                            <div className="border border-gray-300 p-4">
                                <div className="bg-[#ff9d00]/50 w-10 h-10 flex items-center justify-center rounded-full">
                                    <PhoneCall className="text-[#ff9d00] w-5 h-5"/>
                                </div>
                                <p className="font-bold mt-12 text-lg">Call us</p>
                                <p className="text-xs mt-3">Mon-Sun, anytime.</p>
                                <p className="test-sm mt-8">(+233) 24 366 0662</p>
                            </div>
                        </div>
                        <div className="w-full lg:w-2/4 sm:px-4 py-2 mb-8">
                            <div className="border border-gray-300 p-4">
                                <div className="bg-[#ff9d00]/50 w-10 h-10 flex items-center justify-center rounded-full">
                                    <MapPinned className="text-[#ff9d00] w-5 h-5"/>
                                </div>
                                <p className="font-bold mt-2 text-lg">Vists our office</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-20 px-6">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl tracking-wide mb-12">
                        Meet the management team
                    </h2>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 lg:w-1/4 sm:px-4 py-2 mb-8">
                            <div className="w-full h-96 bg-black rounded-xl">
                                
                            </div>
                            <div>
                                <h3 className="font-semibold text-3xl mt-4">Kojo Savage</h3>
                                <p className="text-lg mt-2">Chief Operating Officer</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/4 sm:px-4 py-2 mb-8">
                            <div className="w-full h-96 bg-black rounded-xl">
                                
                            </div>
                            <div>
                                <h3 className="font-semibold text-3xl mt-4">Kojo Savage</h3>
                                <p className="text-lg mt-2">Chief Operating Officer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Contact
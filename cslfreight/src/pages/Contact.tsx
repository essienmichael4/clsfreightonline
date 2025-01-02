import { MailCheck, MapPinned, PhoneCall } from "lucide-react"
import shipping from "../assets/shipping.jpg"
import Footer from "@/components/Footer"

const Contact = () => {
  return (
    <>
        <div className="container mx-auto">
            <div className="mt-12">
                <div className="px-6  flex flex-wrap mt-10 rounded-lg justify-center items-center">
                    <div className="p-2 w-full lg:w-1/2 space-y-4">
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl tracking-wide">
                            We are here to help you with your freight forwarding services
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
                        <div className="border h-full border-gray-300 p-4">
                            <div className="bg-blue-300/50 w-10 h-10 flex items-center justify-center rounded-full">
                                <MailCheck className="text-blue-800 w-5 h-5"/>
                            </div>
                            <p className="font-bold mt-12 text-lg">Send us a message</p>
                            <p className="text-xs mt-3">Chat with our friendly team</p>
                            <p className="test-sm mt-8">info@clixmartonline.com</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/4 sm:px-4 py-2 mb-8">
                        <div className="border h-full border-gray-300 p-4">
                            <div className="bg-blue-300/50 w-10 h-10 flex items-center justify-center rounded-full">
                                <PhoneCall className="text-blue-800 w-5 h-5"/>
                            </div>
                            <p className="font-bold mt-12 text-lg">Call us</p>
                            <p className="text-xs mt-3">Mon-Sat, 8:00am - 8:00pm (GMT).</p>
                            <p className="text-xs mt-8">Customer Care</p>
                            <p className="test-sm mt-2">(+233) 552 902 556</p>
                            <p className="test-sm mt-2">(+233) 546 548 705</p>
                            <p className="text-xs mt-8">Invoices & Payments</p>
                            <p className="test-sm mt-2">(+233) 244 699 112</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/4 sm:px-4 py-2 mb-8">
                        <div className="border h-full border-gray-300 p-4">
                            <div className="bg-blue-300/50 w-10 h-10 flex items-center justify-center rounded-full">
                                <MapPinned className="text-blue-800 w-5 h-5"/>
                            </div>
                            <p className="font-bold mt-2 text-lg">Visit our office</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20 px-6">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl tracking-wide mb-12">
                    Meet the management team
                </h2>
                {/* <div className="flex flex-wrap">
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
                </div> */}
            </div>
        </div>
        <Footer />
    </>
  )
}

export default Contact
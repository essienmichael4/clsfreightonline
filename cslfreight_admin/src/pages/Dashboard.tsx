import ShippingReport from "@/components/ShippingReport"
import useAuth from "@/hooks/useAuth"
import { PackageCheck, PackageOpen, Truck } from "lucide-react"

const Dashboard = () => {
    return (
        <>
            <div className="lg:container w-full mx-auto mt-4 px-4 lg:px-0">
                <div className="w-full flex flex-wrap">
                    <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-orange-500 rounded-full p-3 bg-orange-400/50">
                                <Truck className="w-10 h-10 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">On Going</h3>
                                <p className="text-3xl">3000</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-blue-700 rounded-full p-3 bg-blue-400/50">
                                <PackageOpen className="w-10 h-10 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Shipped</h3>
                                <p className="text-3xl">3000</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
                        <div className="flex gap-4 items-center h-full rounded-md p-6 text-md border border-neutral-300">
                            <div className="border border-emerald-700 rounded-full p-3 bg-emerald-400/50">
                                <PackageCheck className="w-10 h-10 text-emerald-700" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground">Completed</h3>
                                <p className="text-3xl">3000</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <ShippingReport />
                </div>
            </div>
            
        </>
    )
}

export default Dashboard

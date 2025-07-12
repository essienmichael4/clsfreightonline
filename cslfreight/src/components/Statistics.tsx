import useAxiosToken from "@/hooks/useAxiosToken"
import { Stats } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { LucideArrowUpRight } from "lucide-react"

interface Props{
    from: Date,
    to:Date,
    state: "USD" | "GHS"
}

const Statistics = ({from, to, state}:Props) => {
    const axios_instance_token = useAxiosToken()
    
    const stats = useQuery<Stats>({
        queryKey: ["summary", from, to, state],
        queryFn: async() => await axios_instance_token.get(`/statistics/client-dashboard?state=${state}&to=${to}&from=${from}`).then(res => {
            return res.data
        })
    })

    return (
        <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
                <div className="flex flex-col rounded-2xl border bg-gradient-to-r from-orange-50 to-orange-500">
                    <div className="rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold">Total Est. Shipping Fees</h4>
                            <div className="p-2 bg-white rounded-full ">
                                <LucideArrowUpRight className="w-5 h-5"/>
                            </div>
                        </div>
                        <p className="text-2xl mt-4">{state === "GHS" ? "¢" : "$"} {stats.data?.estimated?.stat.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || 0}</p>
                    </div>
                </div>
            </div>
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
            <div className="flex flex-col p-[2px] rounded-2xl border h-full bg-gradient-to-r from-white to-gray-300">
                <div className="rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Total Packages</h4>
                        <div className="p-2 bg-white rounded-full ">
                            <LucideArrowUpRight className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-2xl mt-4">{stats.data?.packages?.stat || 0}</p>
                </div>
            </div>
            </div>
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
            <div className="flex flex-col p-[2px] rounded-2xl border h-full bg-gradient-to-r from-white to-gray-300">
                <div className="rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Undelivered Packages</h4>
                        <div className="p-2 bg-white rounded-full ">
                            <LucideArrowUpRight className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-2xl mt-4">{stats.data?.undelivered?.stat || 0}</p>
                </div>
            </div>
            </div>
            <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
            <div className="flex flex-col p-[2px] rounded-2xl border h-full bg-gradient-to-r from-white to-gray-300">
                <div className="rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Delivered Packages</h4>
                        <div className="p-2 bg-white rounded-full ">
                            <LucideArrowUpRight className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-2xl mt-4">{stats.data?.delivered?.stat || 0}</p>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Statistics

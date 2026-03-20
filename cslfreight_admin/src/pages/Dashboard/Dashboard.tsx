import ShippingReport from "@/components/ShippingReport"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import { PackageCheck, PackageOpen, Truck, TrendingUp } from "lucide-react"

interface countRequest {
    count: number
}

const StatCard = ({
    icon: Icon,
    label,
    value,
    accent,
    delay,
}: {
    icon: React.ElementType
    label: string
    value: number | undefined
    accent: {
        bg: string
        border: string
        icon: string
        glow: string
        badge: string
    }
    delay: string
}) => (
    <div
        className="group relative flex-1 min-w-[220px]"
        style={{ animationDelay: delay }}
    >
        {/* Ambient glow */}
        <div
            className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${accent.glow}`}
        />

        <div className="relative rounded-2xl bg-white border border-neutral-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Subtle corner accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-[0.06] ${accent.bg}`} />

            <div className="flex items-start justify-between mb-5">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${accent.bg} ${accent.border} border`}>
                    <Icon className={`w-5 h-5 ${accent.icon}`} strokeWidth={1.75} />
                </div>
                <span className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${accent.badge}`}>
                    Live
                </span>
            </div>

            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1.5">
                {label}
            </p>

            <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-neutral-900 tabular-nums leading-none">
                    {value ?? (
                        <span className="inline-block w-16 h-9 rounded-lg bg-neutral-100 animate-pulse" />
                    )}
                </span>
                <TrendingUp className="w-4 h-4 text-neutral-300 mb-1" />
            </div>
        </div>
    </div>
)

const Dashboard = () => {
    const axios_instance_token = useAxiosToken()

    const loadedQuery = useQuery<countRequest>({
        queryKey: ["packages", "loaded"],
        queryFn: async () =>
            await axios_instance_token
                .get(`/packages/dashboard/loaded`)
                .then((res) => res.data),
    })

    const enrouteQuery = useQuery<countRequest>({
        queryKey: ["packages", "intransit"],
        queryFn: async () =>
            await axios_instance_token
                .get(`/packages/dashboard/intransit`)
                .then((res) => res.data),
    })

    const arrivedQuery = useQuery<countRequest>({
        queryKey: ["packages", "arrived"],
        queryFn: async () =>
            await axios_instance_token
                .get(`/packages/dashboard/arrived`)
                .then((res) => res.data),
    })

    const stats = [
        {
            icon: Truck,
            label: "On Hold",
            value: loadedQuery.data?.count,
            delay: "0ms",
            accent: {
                bg: "bg-amber-50",
                border: "border-amber-200",
                icon: "text-amber-600",
                glow: "bg-amber-200",
                badge: "bg-amber-50 text-amber-600 border border-amber-200",
            },
        },
        {
            icon: PackageOpen,
            label: "Shipped",
            value: enrouteQuery.data?.count,
            delay: "80ms",
            accent: {
                bg: "bg-blue-50",
                border: "border-blue-200",
                icon: "text-blue-600",
                glow: "bg-blue-200",
                badge: "bg-blue-50 text-blue-600 border border-blue-200",
            },
        },
        {
            icon: PackageCheck,
            label: "Arrived",
            value: arrivedQuery.data?.count,
            delay: "160ms",
            accent: {
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                icon: "text-emerald-600",
                glow: "bg-emerald-200",
                badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
            },
        },
    ]

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-neutral-400 tracking-widest uppercase">
                            Operations · Overview
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                        Shipping Dashboard
                    </h1>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                {/* Report Section */}
                <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-neutral-900">
                                Shipping Report
                            </h2>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                Full package activity overview
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </div>
                    </div>
                    <div className="p-6">
                        <ShippingReport />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

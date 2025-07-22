import { GetTierBadgeClass } from "@/lib/helper"
import { MembershipTier } from "@/lib/types"
import { Badge } from "lucide-react"

interface Props {
    membershipTiers?: MembershipTier[]
}

const TierStatistics = ({membershipTiers}:Props) => {
  return (
    <>
        <h2 className="font-bold">Tier Statistic</h2>
        <div className="flex flex-wrap">
            {membershipTiers?.map(tier=>(
                <div className="w-1/2 p-2">
                    <div className="p-3 border rounded-lg">
                        <h3 className="flex text-xs items-center gap-2"><Badge className={`w-4 h-4 rounded-full ${GetTierBadgeClass(tier.priority)}`} /><span className='text-gray-500'>{tier.name}</span></h3>
                        <p className="text-2xl">{tier.clientCount ?? 0}</p>
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}

export default TierStatistics

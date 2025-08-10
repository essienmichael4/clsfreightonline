import useAxiosToken from "@/hooks/useAxiosToken";
import { MembershipTier } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import AddMembershipTierDialog from "./_components/AddMembershipTier";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Members from "./_components/Members";
import Tiers from "./_components/Tiers";
import TierStatistics from "./_components/TierStatistics";

const Membership = () => {
    const axios_instance_token = useAxiosToken()
    const [name, setName] = useState("")

    const membershipTierQuery = useQuery<MembershipTier[]>({
        queryKey: ["membership-tiers"],
        queryFn: async() => await axios_instance_token.get(`/users/membership-tiers`).then(res => {
            return res.data
        })
    })
      
    return (
        <div className='mx-auto container mt-4 mb-16 px-4'>
            <div className="flex flex-wrap gap-4 justify-between">
                <div>
                    <TierStatistics membershipTiers={membershipTierQuery.data} />
                </div>
                <div>
                    <Tiers membershipTiers={membershipTierQuery.data} />
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <h3 className="font-bold">Memberships</h3>
                <AddMembershipTierDialog trigger={
                    <Button  className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Add Membership Tier</Button>
                } />
            </div>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
                <button onClick={()=> setName("")} className={`${name === "" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
                {membershipTierQuery.data?.map(tier => (
                    <button key={tier.id} onClick={()=> setName(tier.name)} className={`${tier.name === name && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>{tier.name}</button>
                ))}
            </div>
            <Members name={name} />
        </div>
    )
}

export default Membership

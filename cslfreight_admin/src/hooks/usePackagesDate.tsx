import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data } from "@/lib/types";

export const usePackagesDate = (page: number, limit: number, loaded?:Date, received?:Date) => {
    const axios_instance_token = useAxiosToken()
    
    return useQuery<Data>({
        queryKey: ["packages", page, limit, loaded, received],
        queryFn: async() => await axios_instance_token.get(`/packages/status`, {
            params: { page, take: limit, loaded, received }
        }).then(res => {            
            return res.data
        })
    })
}

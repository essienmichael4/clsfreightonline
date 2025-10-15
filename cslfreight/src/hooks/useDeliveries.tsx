import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data } from "@/lib/types";

export const useDeliveries = (page: number, limit: number, status?: string) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["deliveries", page, limit, status],
        queryFn: async() => await axios_instance_token.get(`/deliveries/client`, {
            params: { page, take: limit, status}
        }).then(res => {
            return res.data
        })
    })
}

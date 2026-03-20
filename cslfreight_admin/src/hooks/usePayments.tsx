import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data } from "@/lib/types";

export const usePayments = (page: number, limit: number, search?: string, month?:string, year?:string) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["payments", page, limit, search, month, year],
        queryFn: async() => await axios_instance_token.get(`/users/clients/payments`, {
            params: { page, take: limit, search}
        }).then(res => {
            return res.data
        })
    })
}

import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import { Data } from "@/lib/types";

export const usePayments = (page: number, limit: number) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["payments", page, limit],
        queryFn: async() => await axios_instance_token.get(`/users/clients/payments`, {
            params: { page, take: limit, }
        }).then(res => {
            return res.data
        })
    })
}

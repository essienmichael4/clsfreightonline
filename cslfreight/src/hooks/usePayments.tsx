import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import { Data } from "@/lib/types";
import useAuth from "./useAuth";

export const usePayments = (page: number, limit: number) => {
    const {auth} = useAuth()
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["payment", page, limit],
        queryFn: async() => await axios_instance_token.get(`/users/clients/${auth?.id}/payments`, {
            params: { page, take: limit, }
        }).then(res => {
            return res.data
        })
    })
}

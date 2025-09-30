import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data } from "@/lib/types";

export const useInvoices = (page: number, limit: number, search: string, status?: string) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["invoices", page, limit, search, status],
        queryFn: async() => await axios_instance_token.get(`/invoices/admin`, {
            params: { page, take: limit, search, status}
        }).then(res => {
            return res.data
        })
    })
}

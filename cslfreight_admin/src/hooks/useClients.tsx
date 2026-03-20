import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data } from "@/lib/types";

export const useClients = (page: number, limit: number, search: string, location?: string) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["clients", page, limit, search, location],
        queryFn: async() => await axios_instance_token.get(`/users/clients`, {
            params: { page, take: limit, search, location: location || undefined }
        }).then(res => {
            return res.data
        })
    })
}

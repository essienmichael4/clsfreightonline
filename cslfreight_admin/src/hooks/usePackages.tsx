import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import { Data } from "@/lib/types";

export const usePackages = (page: number, limit: number, search: string, status:string) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["packages", status, page, limit, search],
        queryFn: async() => await axios_instance_token.get(`/packages`, {
            params: { page, take: limit, search, status }
        }).then(res => {
            return res.data
        })
    })
}

import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Data } from "@/lib/types";
import type { DateFilter } from "@/pages/Package/_components/PackageFilters";

export const usePackages = (
    page: number,
    limit: number,
    search: string,
    status: string,
    filters?: DateFilter
) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["packages", status, page, limit, search, filters],
        queryFn: async () => await axios_instance_token.get(`/packages`, {
            params: {
                page,
                take: limit,
                search,
                status,
                ...filters, 
            }
        }).then(res => res.data)
    })
}

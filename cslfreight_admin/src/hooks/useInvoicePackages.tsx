import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "./useAxiosToken";
import type { Package } from "@/lib/types";

export const useInvoicePackages = (
  id: number,
  search: string,
  loadedDate?: Date,
  enabled: boolean = true
) => {
  const axios_instance_token = useAxiosToken();

  return useQuery<Package[]>({
    queryKey: ["packages", id, search, loadedDate],
    queryFn: async () =>
      axios_instance_token
        .get(`/packages/clients/${id}`, {
          params: { search, loaded_date: loadedDate },
        })
        .then((res) => res.data),
    enabled: enabled && !!id, // 👈 run only if client ID is valid
  });
};

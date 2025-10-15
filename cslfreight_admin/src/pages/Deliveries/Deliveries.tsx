import useAxiosToken from "@/hooks/useAxiosToken";
import type { Delivery } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react"
import { useState } from "react";
import * as XLSX from "xlsx"
import DeliveryTable from "./_components/DeliveryTable";

const Deliveries = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    
    const axios_instance_token = useAxiosToken()
    const { data: deliveries, isLoading } = useQuery<Delivery[]>({
        queryKey: ["delivery", "all"],
        queryFn: async () => {
            const res = await axios_instance_token.get(`/deliveries`);
            return res.data;
        },
    });

    const onClick = () => {
        if (!deliveries) return;
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(deliveries);

        XLSX.utils.book_append_sheet(wb, ws, "deliveries");
        XLSX.writeFile(wb, "deliveries.xlsx");
    };

    return (
        <div className="container px-4 mx-auto">
            <div className="mt-4 flex items-center justify-between">
                <h3 className="font-bold">Deliveries</h3>
                <button
                    onClick={onClick}
                    disabled={isLoading}
                    className="flex gap-2 text-gray-500 py-2 px-4 rounded-md border hover:border-gray-600 hover:text-gray-800"><Download className="w-4 h-4"/> <span className="text-nowrap text-sm">Export CSV</span></button>
            </div>
            <div>
                <DeliveryTable page={page} limit={limit} setLimit={setLimit} setPage={setPage}/>
            </div>
        </div>
    )
}

export default Deliveries

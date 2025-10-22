import { Download, Plus, Search } from "lucide-react"
import CreatePaymentDialog from "./_components/CreatePayment"
import AllPayments from "./_components/AllPayments"
import { useState } from "react"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import type { Payment } from "@/lib/types"
import useAxiosToken from "@/hooks/useAxiosToken"
import * as XLSX from "xlsx"

const Payments = () => {
  const axios_instance_token = useAxiosToken()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [debouncedValue] = useDebounce(search, 500)

  const { data: clients, isLoading } = useQuery<Payment[]>({
    queryKey: ["payments", "all",, debouncedValue],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/users/clients/payments/export`);
      return res.data;
    },
  });

  const onClick = () => {
    if (!clients) return;
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(clients);

    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    XLSX.writeFile(wb, "clients.xlsx");
  };
  
  return (
    <>
        <div className="container px-4 mx-auto">
            <div className="mt-6 flex items-center justify-between">
                <h3 className="font-bold">Payments</h3>
                <div className="flex gap-2">
                  <div className="w-full sm:w-[320px]">
                    <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                      <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                      <input type="text" placeholder="Plur 890987645368" 
                        onChange={e => {
                          setSearch(e.target.value)
                          setPage(1)
                          }
                        } className="outline-none text-sm w-full"/>
                    </div>
                  </div>
                  <button
                    onClick={onClick}
                    disabled={isLoading}
                    className="flex gap-2 text-gray-500 py-2 px-4 rounded-md border hover:border-gray-600 hover:text-gray-800"><Download className="w-4 h-4"/> <span className="text-nowrap text-sm">Export CSV</span></button>
                  <div>
                    <CreatePaymentDialog trigger={
                        <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                        <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Payment</span>
                        </button>}
                    />
                  </div>
                </div>
            </div>
            <AllPayments search={debouncedValue} page={page} setPage={setPage} />
        </div>
    </>
  )
}

export default Payments

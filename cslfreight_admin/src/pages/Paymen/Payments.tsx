import { Download, Plus, Search } from "lucide-react"
import CreatePaymentDialog from "./_components/CreatePayment"
import AllPayments from "./_components/AllPayments"
import { useState } from "react"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import type { Payment } from "@/lib/types"
import useAxiosToken from "@/hooks/useAxiosToken"
import * as XLSX from "xlsx"

const MONTHS = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

const currentYear = new Date().getFullYear()
const YEARS = [
  { value: "", label: "All Years" },
  ...Array.from({ length: currentYear - 2023 + 1 }, (_, i) => {
    const y = String(currentYear - i)
    return { value: y, label: y }
  }),
]

const selectClass =
  "border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 text-sm text-gray-700 bg-white h-full"

const Payments = () => {
  const axios_instance_token = useAxiosToken()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [debouncedValue] = useDebounce(search, 500)

  const { data: clients, isLoading } = useQuery<Payment[]>({
    queryKey: ["payments", "all", debouncedValue],
    queryFn: async () => {
      const res = await axios_instance_token.get(`/users/clients/payments/export`,{
        params: {
          ...(debouncedValue && { search: debouncedValue }),
          ...(month && { month }),
          ...(year && { year }),
        },
      })
      return res.data
    },
  })

  const onClick = () => {
    if (!clients) return
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(clients)
    XLSX.utils.book_append_sheet(wb, ws, "Client Payments")
    XLSX.writeFile(wb, "payments.xlsx")
  }

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="mt-6 flex items-center justify-between">
          <h3 className="font-bold">Payments</h3>
          <div className="flex gap-2 flex-wrap justify-end">
            {/* Search */}
            <div className="w-full sm:w-[320px]">
              <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Plur 890987645368"
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* Month filter */}
            <select
              className={selectClass}
              value={month}
              onChange={(e) => {
                setMonth(e.target.value)
                setPage(1)
              }}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            {/* Year filter */}
            <select
              className={selectClass}
              value={year}
              onChange={(e) => {
                setYear(e.target.value)
                setPage(1)
              }}
            >
              {YEARS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>

            {/* Export */}
            <button
              onClick={onClick}
              disabled={isLoading}
              className="flex gap-2 text-gray-500 py-2 px-4 rounded-md border hover:border-gray-600 hover:text-gray-800"
            >
              <Download className="w-4 h-4" />
              <span className="text-nowrap text-sm">Export CSV</span>
            </button>

            {/* Add Payment */}
            <div>
              <CreatePaymentDialog
                trigger={
                  <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                    <Plus className="w-4 h-4 mr-2 text-white" />
                    <span className="text-xs md:text-sm">Add Payment</span>
                  </button>
                }
              />
            </div>
          </div>
        </div>

        <AllPayments
          search={debouncedValue}
          page={page}
          setPage={setPage}
          month={month}
          year={year}
        />
      </div>
    </>
  )
}

export default Payments

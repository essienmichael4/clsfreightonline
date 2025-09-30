import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useDebounce } from "use-debounce"
import AllInvoices from "./_components/AllInvoices"


const Invoices = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [debouncedValue] = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="mt-6 flex items-center justify-between">
            <h3 className="font-bold">Invoices</h3>
            <div className="flex gap-2">
              <div>
                    <Link to="create" className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                    <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Create Invoice</span>
                    </Link>
              </div>
            </div>
        </div>
        <div className="w-full flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=> setStatus("")} className={`${status === "" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All Invoice</button>
            <button onClick={()=> setStatus("DRAFT")} className={`${status === "DRAFT" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Dratf</button>
            <button  onClick={()=> setStatus("OPEN")} className={`${status === "OPEN" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Open</button>
            <button  onClick={()=> setStatus("PAST_DUE")} className={`${status === "PAST_DUE" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Past Due</button>
            <button  onClick={()=> setStatus("PAID")} className={`${status === "PAID" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Paid</button>
          </div>

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
        </div>
        <div>
          <AllInvoices search={debouncedValue} page={page} limit={limit} setLimit={setLimit} setPage={setPage}/>
        </div>
      </div>
    </>
  )
}

export default Invoices

import AllPackages from "@/components/AllPackages"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import CreatePackage from "./CreatePackage"
import { useState } from "react"
import {useDebounce} from "use-debounce"
import { Link } from "react-router-dom"
import type { DateFilter } from "./_components/PackageFilters"
import FilterPopup from "./_components/PackageFilters"

const EMPTY_FILTERS: DateFilter = {
  receivedFrom: "",
  receivedTo: "",
  loadedFrom: "",
  loadedTo: "",
}

const PackagesList = () => {
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [debouncedValue] = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [showFilter, setShowFilter] = useState(false)
  const [pendingFilters, setPendingFilters] = useState<DateFilter>(EMPTY_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<DateFilter>(EMPTY_FILTERS)

  const handleApply = () => {
    setAppliedFilters(pendingFilters)
    setShowFilter(false)
  }

  const handleReset = () => {
    setPendingFilters(EMPTY_FILTERS)
    setAppliedFilters(EMPTY_FILTERS)
  }

  const hasActiveFilters = (f: DateFilter) =>
  Object.values(f).some((v) => v !== "")

  return (
    <>
      <div className="container mx-auto">
        <div className="mt-2 flex items-center justify-between">
          <h3 className="font-bold">Packages</h3>
          <div className="flex gap-3">
            <Link to={"upload/excel"} className="py-2 px-2 md:px-4 text-emerald-400 border border-emerald-400 flex items-center rounded-md">
              <Plus className="w-4 h-4 mr-2 "/> <span className="text-xs md:text-sm">Add Packages</span>
            </Link>
            <CreatePackage trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Package</span>
              </button>}
            />
          </div>
        </div>
        {/* <div className="w-full flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=> setStatus("")} className={`${status === "" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
            <button onClick={()=> setStatus("YET_TO_LOAD")} className={`${status === "YET_TO_LOAD" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Yet to load</button>
            <button  onClick={()=> setStatus("IN_TRANSIT")} className={`${status === "IN_TRANSIT" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>In transit</button>
            <button  onClick={()=> setStatus("ARRIVED")} className={`${status === "ARRIVED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Arrived</button>
            <button  onClick={()=> setStatus("DELIVERED")} className={`${status === "DELIVERED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Delivered</button>
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
        </div> */}

        <div className="w-full flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStatus("")} className={`${status === "" && "active bg-slate-400"} text-xs py-2 px-4 rounded-md`}>All</button>
            <button onClick={() => setStatus("YET_TO_LOAD")} className={`${status === "YET_TO_LOAD" && "active bg-slate-400"} text-xs py-2 px-4 rounded-md`}>Yet to load</button>
            <button onClick={() => setStatus("IN_TRANSIT")} className={`${status === "IN_TRANSIT" && "active bg-slate-400"} text-xs py-2 px-4 rounded-md`}>In transit</button>
            <button onClick={() => setStatus("ARRIVED")} className={`${status === "ARRIVED" && "active bg-slate-400"} text-xs py-2 px-4 rounded-md`}>Arrived</button>
            <button onClick={() => setStatus("DELIVERED")} className={`${status === "DELIVERED" && "active bg-slate-400"} text-xs py-2 px-4 rounded-md`}>Delivered</button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="flex-1 sm:w-[280px]">
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

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setPendingFilters(appliedFilters) // sync pending with applied on open
                  setShowFilter((v) => !v)
                }}
                className={`flex items-center gap-1.5 text-xs py-2 px-3 rounded-md border transition-colors
                  ${hasActiveFilters(appliedFilters)
                    ? "border-slate-500 bg-slate-100 text-slate-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
                {hasActiveFilters(appliedFilters) && (
                  <span className="bg-slate-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {Object.values(appliedFilters).filter(Boolean).length}
                  </span>
                )}
              </button>

              {showFilter && (
                <FilterPopup
                  filters={pendingFilters}
                  setFilters={setPendingFilters}
                  onApply={handleApply}
                  onReset={handleReset}
                  onClose={() => setShowFilter(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <AllPackages page={page} setPage={setPage} setLimit={setLimit} limit={limit} status={status} search={debouncedValue} filters={appliedFilters} />
        </div>
      </div>
    </>
  )
}

export default PackagesList

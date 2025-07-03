import AllPackages from "@/components/AllPackages"
import { useState } from "react"

const Packages = () => {
  const [status, setStatus] = useState("")

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="mt-6 flex items-center justify-between">
          <h3 className="font-bold">Packages</h3>
        </div>
        <div className="w-full flex flex-wrap items-center justify-between mt-4 gap-2">
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=> setStatus("")} className={`${status === "" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
            <button onClick={()=> setStatus("YET_TO_LOAD")} className={`${status === "YET_TO_LOAD" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Yet to load</button>
            <button  onClick={()=> setStatus("EN_ROUTE")} className={`${status === "EN_ROUTE" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>En route</button>
            <button  onClick={()=> setStatus("ARRIVED")} className={`${status === "ARRIVED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Arrived</button>
            <button  onClick={()=> setStatus("DELIVERED")} className={`${status === "DELIVERED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Delivered</button>
          </div>
        </div>

        <div>
          <AllPackages status={status} />
        </div>
      </div>
    </>
  )
}

export default Packages

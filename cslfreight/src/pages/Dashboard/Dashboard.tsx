import ShippingReport from "@/components/ShippingReport"
import Statistics from "@/components/Statistics"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import useAxiosToken from "@/hooks/useAxiosToken"
import { PackageTypeAndRate } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { startOfMonth, subMonths } from "date-fns"
import { useState } from "react"

const Dashboard = () => {
  const axios_instance_token = useAxiosToken()
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: startOfMonth(subMonths(new Date(), 5)),
    to: new Date()
  })
  const [state, setState] = useState<"USD"|"GHS">("USD")

  const handleCurrencyChange = (value:"USD"|"GHS") => {
    if(value === "GHS"){
      setState("USD")
    }else{
      setState("GHS")
    }
  }

  const rates = useQuery<PackageTypeAndRate[]>({
      queryKey: ["package-rates"],
      queryFn: async() => await axios_instance_token.get(`/packages/shipping-rates`).then(res => {
          return res.data
      })
  })



  return (
    <div className="container w-full mx-auto mt-4 px-4">
      <div className='px-2 w-full flex flex-wrap justify-between gap-4 mb-4'>
        <div className="w-full md:w-1/2">
          <h2 className='text-lg lg:text-xl font-semibold'>Dashboard</h2>
          <p className="text-xs md:w-full text-muted-foreground">Estimated shipping fees does not reflect your actual shipping fees as the fees may be higher or lower than what is shown. Please, only make payment for fees sent to you on invoices. The estimate reflects fees for undelivered packages only. Also, all billings are in USD and will be paid against the current USD-GHS rate.</p>
        </div>
        <div className="flex w-full md:w-[520px] flex-col p-3 rounded-2xl border bg-gradient-to-r from-orange-50 to-orange-500">
          <div className="flex gap-8 justify-between items-center">
            <h4 className=" font-bold">Shipping Rate</h4>
            <button onClick={()=>handleCurrencyChange(state)} className="text-nowrap border border-white bg-white hover:bg-black hover:text-white hover:border-black py-2 px-4 rounded-full text-black text-xs">To {state === "GHS" ? "USD" : "GHS"}</button>
          </div>
          <div className="flex gap-8 flex-wrap">
            {rates.data?.map(rate=>{
              return (<div>
                <p className="text-2xl mt-2">{state === "GHS" ? "¢" : "$"} {state === "GHS" ? rate.cedisRate || 0 : rate.rate || 0}</p>
                <p className="text-xs mt-2">{rate.description}</p>
              </div>)
            })}
          </div>
        </div>
      </div>
      <div className="px-2 mb-2">
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values)=>{
            const {from, to} = values.range
            if(!from || !to) return
            setDateRange({from, to})
          }}
        />
      </div>
      <div>
        <Statistics state={state} from={dateRange.from} to={dateRange.to} />
      </div>
      <div>
        <ShippingReport />
      </div>
    </div>
  )
}

export default Dashboard

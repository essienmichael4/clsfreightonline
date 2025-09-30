import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

const InvoiceDetails = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  return (
    <div className="container px-4 mx-auto">
      <Breadcrumb className="mt-1">
          <BreadcrumbList>
              <BreadcrumbItem>
              <BreadcrumbLink href="../invoices" className="text-xs">Invoices</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-xs"/>
              <BreadcrumbItem>
              <BreadcrumbPage className="text-xs">{id}</BreadcrumbPage>
              </BreadcrumbItem>
          </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-1 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <button onClick={()=> navigate(-1)} className="flex gap-2 items-center text-gray-400 hover:text-gray-600 hover:border-gray-600">
                  <ArrowLeft className="w-4 h-4" /> <span>Invoice List</span>
              </button>
          </div>
          {/* <div><span className="font-bold text-lg">#{ticketsQuery.data?.id}</span> <span className="py-1 px-2 bg-gray-100 text-xs font-semibold text-gray-600 rounded-md">{ticketsQuery.data?.subject}</span> </div> */}
          <div>
              {/* {ticketsQuery.data?.status === "CLOSED" ? <span className="bg-rose-200 text-rose-700 py-2px-4">{ticketsQuery.data.status}</span> : <EditStatusDropdown id={Number(ticketsQuery.data?.id)} defaultStatus={ticketsQuery.data?.status as TicketStatus} />} */}
          </div>
      </div>
    </div>
  )
}

export default InvoiceDetails

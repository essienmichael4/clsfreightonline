import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import useAxiosToken from "@/hooks/useAxiosToken"
import type { Delivery } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Edit } from "lucide-react"
import { useParams } from "react-router-dom"
import EditDeliveryStatus from "./_components/EditDeliveryStatus"
import EditConfirmationStatus from "./_components/EditConfirmationStatus"
import EditPickupReadyStatus from "./_components/EditPickupReadyStatus"

const DeliveryDetails = () => {
    const {id} = useParams()
    const axios_instance_token = useAxiosToken()

    const deliveryDetails = useQuery<Delivery>({
        queryKey: ["deliveries", id],
        queryFn: async() => await axios_instance_token.get(`/deliveries/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    return (
        <div className="container px-4 mx-auto">
            <Breadcrumb className="mt-1">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="../deliveries" className="text-xs">Deliveries</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-xs"/>
                    <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs">{id}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-6 flex items-center justify-between">
                <h3 className="font-bold">Delivery Details</h3>
                <div className="flex gap-2">
                    {deliveryDetails.data && <EditConfirmationStatus id={Number(id)} trigger={
                        <Button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-emerald-500 to-emerald-800 text-white">
                            <Edit className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Edit Confirmation</span>
                        </Button>
                    } delivery={deliveryDetails.data} />}
                
                    {deliveryDetails.data && <EditDeliveryStatus id={Number(id)} trigger={
                        <Button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                            <Edit className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Edit Status</span>
                        </Button>
                    } delivery={deliveryDetails.data} />}

                    {deliveryDetails.data && <EditPickupReadyStatus id={Number(id)} trigger={
                        <Button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                            <Edit className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Edit Ready For Pickup</span>
                        </Button>
                    } delivery={deliveryDetails.data} />}
                </div>
            </div>
            <div>
                {deliveryDetails.data?.client?.shippingMark}
            </div>
        </div>
    )
}

export default DeliveryDetails

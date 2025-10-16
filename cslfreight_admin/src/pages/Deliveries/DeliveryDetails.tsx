import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import useAxiosToken from "@/hooks/useAxiosToken"
import type { Delivery } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Calendar, CheckCheck, Edit, Handshake, MapPin, Package, PackageCheck, Phone, Truck, User, UserCheck } from "lucide-react"
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
            <div className="mt-4">
                <div className="space-y-6 animate-fadeIn">
                    <div className=" border-2 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Package className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex item-center justify-between">
                                <h3 className="text-lg font-bold text-blue-900">Request Information</h3>
                            </div>
                        </div>
            
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
                                <p className="text-xs text-slate-600 mb-1">Shipping Mark</p>
                                <p className="text-sm font-bold text-slate-900">{deliveryDetails.data?.client?.shippingMark}</p>
                            </div>
                
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
                            <p className="text-xs text-slate-600 mb-1">Delivery Type</p>
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-blue-600" />
                                <p className="text-sm font-bold text-slate-900 capitalize">{deliveryDetails.data?.deliveryType}</p>
                            </div>
                            </div>
                
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
                            <p className="text-xs text-slate-600 mb-1">Pickup By</p>
                            <p className="text-sm font-bold text-slate-900">
                                {deliveryDetails.data?.pickupBy === 'Third Party' ? 'Third Party' : 'Self'}
                            </p>
                            </div>
                
                            {deliveryDetails.data?.pickupBy === 'Third Party' && (
                            <>
                                <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
                                <p className="text-xs text-slate-600 mb-1">Third Party Name</p>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm font-bold text-slate-900">{deliveryDetails.data?.thirdPartyName}</p>
                                </div>
                                </div>
                
                                <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100 md:col-span-2">
                                <p className="text-xs text-slate-600 mb-1">Phone Number</p>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <p className="text-sm font-bold text-slate-900">{deliveryDetails.data?.thirdPartyPhone}</p>
                                </div>
                                </div>
                            </>
                            )}
                        </div>
                    </div>
            
                    <div className=" border-2 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-600 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-green-900">Scheduling Details</h3>
                        </div>
                
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
                                <p className="text-xs text-slate-600 mb-1">Loading Date</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                    <p className="text-sm font-bold text-slate-900">
                                    {new Date(deliveryDetails.data?.loaded as string).toLocaleString('en-US', {
                                        dateStyle: 'full',
                                        timeStyle: 'short'
                                    })}
                                    </p>
                                </div>
                            </div>
                
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
                            <p className="text-xs text-slate-600 mb-1">Location</p>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <p className="text-sm font-bold text-slate-900">{deliveryDetails.data?.location}</p>
                            </div>
                            </div>
                
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
                            <p className="text-xs text-slate-600 mb-1">Phone</p>
                            <p className="text-sm font-bold text-slate-900">{deliveryDetails.data?.phone}</p>
                            </div>
                        </div>
                    </div>
            
                    <div className="mb-12 border-2 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-rose-600 p-2 rounded-lg">
                            <CheckCheck className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-rose-900">Confirmations & Statuses</h3>
                        </div>
                
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
                                <p className="text-xs text-slate-600 mb-1">Confirmation</p>
                                <div className="flex items-center gap-2">
                                    <Handshake className="w-5 h-5 text-green-600" />
                                    <p className="text-sm font-bold text-slate-900">
                                        {deliveryDetails.data?.isConfirmed}
                                    </p>
                                </div>
                            </div>
                
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
                            <p className="text-xs text-slate-600 mb-1">Ready for pickup</p>
                            <div className="flex items-center gap-2">
                                <PackageCheck className="w-5 h-5 text-green-600" />
                                <p className="text-sm font-bold text-slate-900">{deliveryDetails.data?.isPickupReady}</p>
                            </div>
                            </div>
                
                            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
                            <p className="text-xs text-slate-600 mb-1">Completed/Delivered</p>
                            <div className="flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-green-600" />
                                <p className="text-sm font-bold text-slate-900">{deliveryDetails.data?.status}</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryDetails

import useAxiosToken from "@/hooks/useAxiosToken"
import type { BankType, HelplineType, InvoiceAddressType, WarehouseType } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import AddAddress from "./AddAddress"
import { Edit } from "lucide-react"
import EditAddress from "./EditAddress"
import AddWarehouse from "./AddWarehouse"
import AddHelpline from "./AddHelpline"
import EditWarehouse from "./EditWarehouse"
import EditHelpline from "./EditHelpline"
import AddBank from "./AddBank"
import EditBank from "./EditBank"

const InvoiceDetails = () => {
    const axios_instance_token = useAxiosToken()

    const invoiceAddress = useQuery<InvoiceAddressType>({
        queryKey: ["settings", "address"],
        queryFn: async() => await axios_instance_token.get(`/settings/address`).then(res => res.data)
    })
    
    const warehouses = useQuery<WarehouseType[]>({
        queryKey: ["settings", "warehouses"],
        queryFn: async() => await axios_instance_token.get(`/settings/warehouses`).then(res => res.data)
    })

    const helplines = useQuery<HelplineType[]>({
        queryKey: ["settings", "helplines"],
        queryFn: async() => await axios_instance_token.get(`/settings/helplines`).then(res => res.data)
    })

    const banks = useQuery<BankType[]>({
        queryKey: ["settings", "banks"],
        queryFn: async() => await axios_instance_token.get(`/settings/banks`).then(res => res.data)
    })

    return (
        <div className="border my-2 p-4  rounded-md">
            <h5 className="font-bold mb-4">Invoice Details</h5>
            <div className="flex justify-between flex-wrap">
                <div className="w-full md:w-1/3">
                    <div className="px-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Address</h3>
                            {!invoiceAddress.data && <AddAddress trigger={
                            <button className="text-xs py-2 px-4 rounded-md bg-gray-200">Add Invoice Address</button>} />}
                        </div>
                        {invoiceAddress.data && <div className="relative py-2">
                            <EditAddress trigger={
                                <button className="absolute right-2 top-2 p-2 border-emerald-500 text-emerald-500 border rounded-full"><Edit  className="w-3 h-3"/></button>
                                } address={invoiceAddress.data}
                            />
                            <p>{invoiceAddress.data?.name}</p>
                            <p>{invoiceAddress.data?.addressLine}</p>
                            <p>{invoiceAddress.data?.streetAddress}</p>
                            <p>{invoiceAddress.data?.box}.{invoiceAddress.data?.city}.{invoiceAddress.data?.state}</p>
                        </div>}
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div className="px-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Warehouses</h3>
                            <AddWarehouse trigger={
                                <button className="text-xs py-2 px-4 rounded-md bg-gray-200">Add warehouse</button>}
                            />
                        </div>
                        {warehouses?.data?.map(warehouse=>{
                            return <div className="mb-2 relative" key={warehouse.id}>
                                <div>
                                    <p className="text-xs font-semibold">{warehouse.description}</p>
                                    <p>{warehouse.name}</p>
                                </div>
                                <EditWarehouse warehouse={warehouse} trigger={
                                    <button className="absolute right-2 top-2 p-2 border-emerald-500 text-emerald-500 border rounded-full"><Edit  className="w-3 h-3"/></button>}
                                />
                            </div>
                        })}
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div className="px-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Helplines</h3>
                            <AddHelpline trigger={
                                <button className="text-xs py-2 px-4 rounded-md bg-gray-200">Add helpline</button>}
                            />
                        </div>
                        {helplines.data?.map(line=>(
                            <div className="mb-2 relative" key={line.id}>
                                <div>
                                    <p className="text-xs font-semibold">Phone</p>
                                    <p>{line.phone}</p>
                                </div>
                                <EditHelpline helpline={line} trigger={
                                    <button className="absolute right-2 top-2 p-2 border-emerald-500 text-emerald-500 border rounded-full"><Edit  className="w-3 h-3"/></button>}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold">Bank Details</h3>
                    <AddBank trigger={
                        <button className="text-xs py-2 px-4 rounded-md bg-gray-200">Add Bank Details</button>}
                    />
                </div>
                <div className="flex flex-wrap">
                    {banks.data?.map(bank=>(
                        <div key={bank.id} className='p-1 w-full sm:p-2 md:w-1/3'>
                            <div className='relative flex flex-col bg-gradient-to-r from-white to-gray-300 rounded-lg p-4 border'>
                            <div className='flex absolute right-2 top-2 gap-2'>
                                <EditBank bank={bank} trigger={
                                <button className='p-2 rounded-full  bg-white  text-emerald-300 hover:text-emerald-700'>
                                    <Edit className='w-4 h-4' />
                                </button>} />

                                {/* <DeleteRate id={Number(rate.id)} rate={rate} trigger={<button className='p-2 rounded-full  bg-white  text-rose-300 hover:text-rose-700'>
                                    <Trash2 className='w-4 h-4' />
                                </button>} /> */}
                            </div>
                            <div className="">
                                <p className="text-sm text-gray-500"><span> Name:</span> {bank.name}</p>
                                <p className="text-sm text-gray-500"><span> Account No.:</span> {bank.accountNumber}</p>
                                <p className="text-sm text-gray-500"><span> Account Name:</span> {bank.accountName}</p>
                                <p className="text-sm text-gray-500"><span> Branch:</span> {bank.branch}</p>
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default InvoiceDetails

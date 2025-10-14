import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import useAxiosToken from "@/hooks/useAxiosToken"
import type { InvoiceAddressType, WarehouseType, HelplineType, Client, Package, BankType, Invoice } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CalendarIcon, ChevronDown, FileArchive } from "lucide-react"
import Tags from "./_components/Tags"
import { useEffect, useState } from "react"
import ShippingMarkPicker from "./_components/ShippingMarkPicker"
import { useRef } from "react"
import {useReactToPrint} from 'react-to-print'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import PackagesSelector from "./_components/PackagesSelector"
import InvoiceTable from "./_components/InvoiceTable"
import { toast } from "sonner"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useInvoicePackages } from "@/hooks/useInvoicePackages"

export const Status = {
    DRAFT: "DRAFT",
    OPEN: "OPEN",
    PAID: "PAID",
    PAST_DUE: "PAST_DUE",
} as const;

export type Status = typeof Status[keyof typeof Status];

const EditInvoice = () => {
    const {id} = useParams()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const componentRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [status, ] = useState<Status>("DRAFT");
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    // Company Details
    const [showDetails, setShowDetails] = useState(true)
    const [phone, setPhone] = useState<string[]>([])
    const [name, setName] = useState("");
    const [selectedWarehouses, setSelectedWarehouses] = useState<WarehouseType[]>([])
    // Client Details
    const [showClientDetails, setShowClientDetails] = useState(false)
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientLocation, setClientLocation] = useState("");
    // Invoice Details
    const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
    const [filter, setFilter] = useState("")
    const [totalCbm, setTotalCbm] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const [rate, setRate] = useState(0)
    const [total, setTotal] = useState(0)
    const [date,] = useState(Date.now())
    const [createDate, setcreatedDate] = useState<Date | undefined>(undefined)
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [selectedRows, setSelectedRows] = useState<Package[]>([])
    // Payment Details
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [selectedBanks, setSelectedBanks] = useState<BankType[]>([])

    const packagesQuery = useInvoicePackages(
        selectedClient?.id ?? 0,
        filter,
        createDate,
        !!selectedClient // only run if client exists
    )
    
    const statuses = Object.values(Status)

    const invoice = useQuery<Invoice>({
        queryKey: ["invoice", id],
        queryFn: async() => await axios_instance_token.get(`/invoices/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    useEffect(() => {
        if (invoice.data) {
            setName(invoice.data.companyName ?? "");
            setClientName(invoice.data.clientName ?? "");
            setClientEmail(invoice.data.client?.email ?? "");
            setClientPhone(invoice.data.client?.phone ?? "");
            setClientLocation(invoice.data.client?.clientDetails?.location ?? "");
            setcreatedDate(invoice.data.issuedDate ? new Date(invoice.data.issuedDate) : undefined);
            setDueDate(invoice.data.eta ? new Date(invoice.data.eta) : undefined);
            setRate(Number(invoice.data.rate) ?? 0)

            if (invoice.data.packages) {
                setSelectedRows(invoice.data.packages);
            }
        }
    }, [invoice.data]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleChange = (e: string[]) => {
        setPhone(e)
    }

    const toggleWarehouse = (warehouse: WarehouseType) => {
        setSelectedWarehouses((prev) => {
            const exists = prev.find((w) => w.id === warehouse.id);
            if (exists) {
            return prev.filter((w) => w.id !== warehouse.id);
            } else {
            return [...prev, warehouse];
            }
        });
    };

    const toggleBank = (bank: BankType) => {
        setSelectedBanks((prev) => {
            const exists = prev.find((b) => b.id === bank.id);
            if (exists) {
            return prev.filter((b) => b.id !== bank.id);
            } else {
            return [...prev, bank];
            }
        });
    }

    const invoiceAddress = useQuery<InvoiceAddressType>({
        queryKey: ["settings", "address"],
        queryFn: async() => await axios_instance_token.get(`/settings/address`).then(res => res.data)
    })

    useEffect(()=>{
            const totalQty = selectedRows.reduce((acc, row) => acc + row.quantity, 0)
            const totalCbm = selectedRows.reduce((acc, row) => acc + Number(row.cbm), 0)
            const total = selectedRows.reduce((acc, row) => acc + Number((Number(row.cbm) * Number(rate)).toFixed(2)), 0)
            setTotal(Number(total.toFixed(2)))
            setTotalCbm(Number(totalCbm.toFixed(2)))
            setTotalQty(Number(totalQty.toFixed(2)))
        }, [selectedRows, rate])

    // const { total, totalCbm, totalQty } = useMemo(() => {
    //     const totalQty = selectedRows.reduce((acc, row) => acc + row.quantity, 0)
    //     const totalCbm = selectedRows.reduce((acc, row) => acc + Number(row.cbm), 0)
    //     const total = selectedRows.reduce(
    //         (acc, row) => acc + Number(row.cbm) * Number(row.packageType?.rate ?? 0),
    //         0
    //     )
    //     return {
    //         total: Number(total.toFixed(2)),
    //         totalCbm: Number(totalCbm.toFixed(2)),
    //         totalQty: Number(totalQty.toFixed(2)),
    //     }
    // }, [selectedRows])

    // sync when invoiceAddress loads
    useEffect(() => {
        if (invoiceAddress.data?.name) {
            setName(invoiceAddress.data.name);
        }
    }, [invoiceAddress.data]);

    // sync when client details
    useEffect(() => {
        if (selectedClient?.name) setClientName(selectedClient?.name);
        if (selectedClient?.email) setClientEmail(selectedClient?.email);
        if (selectedClient?.phone) setClientPhone(selectedClient?.phone);
        if (selectedClient?.clientDetails?.location) setClientLocation(selectedClient?.clientDetails?.location);
        
    }, [selectedClient]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Invoice-${date}`,
    });
    
    const warehouses = useQuery<WarehouseType[]>({
        queryKey: ["settings", "warehouses"],
        queryFn: async() => await axios_instance_token.get(`/settings/warehouses`).then(res => res.data)
    })

    const helplines = useQuery<HelplineType[]>({
        queryKey: ["settings", "helplines"],
        queryFn: async() => await axios_instance_token.get(`/settings/helplines`).then(res => res.data)
    })

    useEffect(() => {
        if (helplines.data) {
            setPhone(helplines.data.map(line => line.phone))
        }
    }, [helplines.data])

    const banks = useQuery<BankType[]>({
        queryKey: ["settings", "banks"],
        queryFn: async() => await axios_instance_token.get(`/settings/banks`).then(res => res.data)
    })

    const editInvoice = async (data: Status)=>{
        const response = await axios_instance_token.patch(`/invoices/${id}`, {
            clientName, shippingMark: selectedClient?.shippingMark, companyName: name,
            issued: createDate, eta: dueDate, packages: selectedRows.map(row=> row.id),
            totalCbm, totalQty, total, status: data, invoiceId: date, rate
        })

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editInvoice,
        onSuccess: ()=>{
            toast.success("Invoice edited successfully", {
                id: "edit-invoice"
            })

            queryClient.invalidateQueries({queryKey: ["invoices"]})
            navigate(-1)

        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-invoice"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-invoice"
                })
            }
        }
    })

    const onSubmit = (data:Status)=>{
        toast.loading("Editing Invoice...", {
            id: "edit-invoice"
        })
        mutate(data)
    }

    return (
        <div className="container px-4 mx-auto">
            <Breadcrumb className="my-2">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="../invoices" className="text-xs">Invoices</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-xs"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs">edit</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-xs"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs">{id}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div>
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/3">
                        <h4 className="font-semibold text-lg">Edit Invoice</h4>
                        <p className="text-xs text-muted-foreground">You can save unfinished invoice as draft and complete later.</p>
                        <div className="pr-2 mt-4 space-y-2">
                            <div className="p-2 border rounded-md">
                                <div className="flex items-center justify-between my-2">
                                    <h5 className="text-sm font-bold">My Details</h5>
                                    <button
                                        type="button"
                                        onClick={() => setShowDetails((prev) => !prev)}
                                        className="p-1"
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transform transition-transform duration-200 ${
                                            showDetails ? "rotate-0" : "-rotate-90"
                                            }`}
                                        />
                                    </button>
                                </div>
                                {showDetails && (
                                <div className="transition-all duration-300 ease-in-out">
                                    <div>
                                        <h6 className="text-xs font-semibold">Name</h6>
                                        <input
                                            type="text"
                                            className="border w-full py-2 px-2 rounded-md text-sm"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="my-2">
                                        <h6 className="text-xs font-semibold">Address</h6>
                                        <div>
                                            <p className="text-sm">{invoiceAddress.data?.addressLine}</p>
                                            <p className="text-sm">{invoiceAddress.data?.streetAddress}</p>
                                            <p className="text-sm">{invoiceAddress.data?.box}.{invoiceAddress.data?.city}.{invoiceAddress.data?.state}</p>
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <h6 className="text-xs font-semibold">Helplines</h6>
                                        <Tags value={phone} defaultValue={helplines.data?.map(line=> line.phone)} onChange={handleChange} maxTags={5} />
                                    </div>
                                    <div className="my-2">
                                        <h6 className="text-xs font-semibold">Warehouses</h6>
                                        {warehouses?.data?.map((warehouse) => {
                                            const isSelected = selectedWarehouses.some((w) => w.id === warehouse.id);
                                            return (
                                            <label
                                                key={warehouse.id}
                                                className={`mb-2 flex items-center p-2 rounded-md cursor-pointer border ${
                                                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
                                                }`}
                                            >
                                                <input type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleWarehouse(warehouse)}
                                                    className="mt-1"
                                                />
                                                <div className="ml-2">
                                                    <p className="text-xs font-semibold">{warehouse.description}</p>
                                                    <p className="text-sm">{warehouse.name}</p>
                                                </div>
                                            </label>
                                            );
                                        })}
                                    </div>
                                </div>)}

                            </div>
                            <div className="p-2 border rounded-md">
                                <div className="flex items-center justify-between my-2">
                                    <h5 className="text-sm font-bold">Client Details</h5>
                                    <button
                                        type="button"
                                        onClick={() => setShowClientDetails((prev) => !prev)}
                                        className="p-1"
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transform transition-transform duration-200 ${
                                            showClientDetails ? "rotate-0" : "-rotate-90"
                                            }`}
                                        />
                                    </button>
                                </div>
                                {showClientDetails && (
                                    <div className="transition-all duration-300 ease-in-out">
                                        <div>
                                            <h6 className="text-xs font-semibold">Client Shipping Mark</h6>
                                            <ShippingMarkPicker
                                                defaultValue={invoice.data?.client.shippingMark}
                                                onChange={(client) => {
                                                    setSelectedClient(client)
                                                }}
                                            />
                                        </div>
                                        <div className="my-2">
                                            <h6 className="text-xs font-semibold">Client Name</h6>
                                            <input
                                                type="text"
                                                className="border w-full py-2 px-2 rounded-md text-xs"
                                                value={clientName}
                                                onChange={(e) => setClientName(e.target.value)}
                                            />
                                        </div>
                                        <div className="my-2">
                                            <h6 className="text-xs font-semibold">Client Email</h6>
                                            <input
                                                type="text"
                                                className="border w-full py-2 px-2 rounded-md text-xs"
                                                value={clientEmail}
                                                onChange={(e) => setClientEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="my-2">
                                            <h6 className="text-xs font-semibold">Client Phone</h6>
                                            <input
                                                type="text"
                                                className="border w-full py-2 px-2 rounded-md text-xs"
                                                value={clientPhone}
                                                onChange={(e) => setClientPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="my-2">
                                            <h6 className="text-xs font-semibold">Client Location</h6>
                                            <input
                                                type="text"
                                                className="border w-full py-2 px-2 rounded-md text-xs"
                                                value={clientLocation}
                                                onChange={(e) => setClientLocation(e.target.value)}
                                            />
                                        </div>
                                    </div> 
                                )}
                            </div>
                            <div className="p-2 border rounded-md">
                                <div className="flex items-center justify-between my-2">
                                    <h5 className="text-sm font-bold">Invoice Details</h5>
                                    <button
                                        type="button"
                                        onClick={() => setShowInvoiceDetails((prev) => !prev)}
                                        className="p-1"
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transform transition-transform duration-200 ${
                                            showInvoiceDetails  ? "rotate-0" : "-rotate-90"
                                            }`}
                                        />
                                    </button>
                                </div>
                                {showInvoiceDetails && (
                                    <div className="transition-all duration-300 ease-in-out">
                                        <div className="flex">
                                            <div className='w-full sm:w-1/2 px-1'>
                                                <div className='flex flex-col'>
                                                    <label className='my-1 text-xs font-semibold'>Loaded Date</label>
                                                    <Popover >
                                                        <PopoverTrigger asChild>
                                                            <Button 
                                                                variant={'outline'}
                                                                className={cn(
                                                                        "w-[186px] pl-3 text-xs text-left font-normal",
                                                                        !createDate && "text-muted-foreground"
                                                                    )}>
                                                                    {createDate ? (
                                                                        format(createDate, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='p-0 w-auto'>
                                                            <Calendar
                                                                mode="single"
                                                                selected={createDate}
                                                                onSelect={setcreatedDate}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <div className='w-full sm:w-1/2 px-1'>
                                                <div className='flex flex-col'>
                                                    <label className='my-1 text-xs font-semibold'>ETA</label>
                                                    <Popover >
                                                        <PopoverTrigger asChild>
                                                            <Button 
                                                                variant={'outline'}
                                                                className={cn(
                                                                        "w-[186px] pl-3 text-xs text-left font-normal",
                                                                        !dueDate && "text-muted-foreground"
                                                                    )}>
                                                                    {dueDate ? (
                                                                        format(dueDate, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='p-0 w-auto'>
                                                            <Calendar
                                                                mode="single"
                                                                selected={dueDate}
                                                                onSelect={setDueDate}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <h6 className="text-xs font-semibold">Rate</h6>
                                            <input
                                                type="number"
                                                className="border w-full py-2 px-2 rounded-md text-sm"
                                                value={rate}
                                                onChange={(e) => setRate(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="my-2">
                                            <h6 className="text-xs font-semibold">Packages</h6>
                                            <input
                                                type="text"
                                                className="border w-full py-2 px-2 rounded-md text-xs"
                                                placeholder="Tracking number"
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            {selectedClient && ( <PackagesSelector
                                                data={packagesQuery.data || []}   // 👈 pass data in
                                                selected={selectedRows}
                                                onSelectionChange={setSelectedRows}
                                            />)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border rounded-md">
                                <div className="flex items-center justify-between my-2">
                                    <h5 className="text-sm font-bold">Payment Details</h5>
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentDetails((prev) => !prev)}
                                        className="p-1"
                                    >
                                        <ChevronDown
                                            className={`w-4 h-4 transform transition-transform duration-200 ${
                                            showPaymentDetails  ? "rotate-0" : "-rotate-90"
                                            }`}
                                        />
                                    </button>
                                </div>
                                {showPaymentDetails && (
                                    <div className="my-2">
                                        <h6 className="text-xs font-semibold">Warehouses</h6>
                                        {banks?.data?.map((bank) => {
                                            const isSelected = selectedBanks.some((b) => b.id === bank.id);
                                            return (
                                                <label
                                                    key={bank.id}
                                                    className={`mb-2 flex gap-2 p-2 rounded-md cursor-pointer border ${
                                                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
                                                    }`}
                                                >
                                                    <div>
                                                        <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleBank(bank)}
                                                        className="mt-1"
                                                        />
                                                    </div>
                                                    <div className="ml-2">
                                                    <p className="text-sm">{bank.name}</p>
                                                    <p className="text-xs font-semibold">{bank.accountNumber}</p>
                                                    <p className="text-xs font-semibold">{bank.accountName}</p>
                                                    <p className="text-xs font-semibold">{bank.branch}</p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/3">
                        <div className="flex items-center justify-between px-2 pb-4">
                            <div className="flex items-center gap-2">
                                <p>Preview</p>
                                <button onClick={handlePrint} className="border py-2 px-2 rounded-md text-gray-500 text-xs flex items-center gap-2"><FileArchive className="w-4 h-4" /> PDF</button>
                            </div>
                            <div ref={dropdownRef} className="relative inline-flex">
                                {/* Main Button */}
                                <button
                                    type="button"
                                    onClick={() => onSubmit("DRAFT")}
                                    disabled={isPending}
                                    className="relative py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold 
                                    rounded-s-md border border-gray-200 bg-white text-gray-800 hover:bg-gray-50
                                    dark:bg-neutral-900 dark:border-neutral-700 dark:text-white disabled:opacity-50"
                                >
                                    {isPending ? (
                                    <svg
                                        className="animate-spin h-4 w-4 text-gray-600 dark:text-gray-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        ></circle>
                                        <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    ) : (
                                    <>Submit as {status}</>
                                    )}
                                </button>

                                {/* Toggle Dropdown */}
                                <button
                                    type="button"
                                    onClick={() => setOpen((prev) => !prev)}
                                    className="relative -ms-px py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold 
                                    rounded-e-md border border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200
                                    dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                >
                                    <svg
                                    className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {open && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-10 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                                    <div className="p-1 space-y-0.5">
                                        {statuses.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            disabled={s === status || isPending}
                                            onClick={() => onSubmit(s)}
                                            className="w-full text-left flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm 
                                            text-gray-800 hover:bg-gray-100
                                            disabled:opacity-50 disabled:pointer-events-none
                                            dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                                        >
                                            {isPending ? (
                                            <svg
                                                className="animate-spin h-4 w-4 text-gray-600 dark:text-gray-300"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                ></circle>
                                                <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                            ) : (
                                            <>Submit as {s}</>
                                            )}
                                        </button>
                                        ))}
                                    </div>
                                    </div>
                                )}
                                </div>
                        </div>
                        <div className="p-2 bg-gray-200">
                            <div className="bg-white relative font-garamond" ref={componentRef}>
                                <div className="bg-gray-50 py-20 px-16">
                                    <h4
                                    className="absolute left-6 font-bold m-0 text-xl text-blue-800 [writing-mode:vertical-rl] "
                                    >
                                    {name}
                                    </h4>
                                    <div className="flex justify-between">
                                        <div className="text-gray-700">
                                            <p className="text-sm">{name}</p>
                                            <p className="text-sm">{invoiceAddress.data?.addressLine}</p>
                                            <p className="text-sm">{invoiceAddress.data?.streetAddress}</p>
                                            <p className="text-sm">{invoiceAddress.data?.box}.{invoiceAddress.data?.city}.{invoiceAddress.data?.state}</p>
                                        </div>
                                        <h3 className="text-4xl text-blue-800 font-bold">Invoice</h3>
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-bold text-ms"><span>ID: </span><span>{date}</span></p>
                                    </div>
                                    <div className="mt-8 flex justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm">Bill to:</h4>
                                            <div className="text-gray-700">
                                                <p className="text-lg mt-2 mb-4 font-bold">{clientName}</p>
                                                <p className="text-sm"><span>Tel: </span>{clientPhone ? clientPhone : "-"}</p>
                                                <p className="text-sm"><span>E-mail: </span>{clientEmail}</p>
                                                <p className="text-sm"><span>Location: </span>{clientLocation}</p>
                                            </div>
                                        </div>
                                        <div className="w-[270px]">
                                            <h4 className="font-semibold text-sm">Invoice number:</h4>
                                            <p className="text-2xl mt-2 mb-4">{}</p>
                                            <div className="flex justify-between">
                                                <div>
                                                    <h6 className="text-sm text-gray-500">Loaded Date</h6>
                                                    <p className="text-sm">{createDate ? createDate.toDateString() : "-"}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-sm text-gray-500">ETA</h6>
                                                    <p className="text-sm">{dueDate ? dueDate.toDateString() : "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-10 px-16">
                                    <div>
                                        <InvoiceTable rate={rate} selected={selectedRows} totalCbm={totalCbm} totalQty={totalQty} total={total}/>
                                    </div>
                                </div>
                                <div className="page-break"></div>
                                <div className="pt-5 px-16">
                                    <h5 className="font-bold text-xs">Payment Information</h5>
                                    <p className="text-xs font-semibold text-blue-800">Cedis Account Details</p>
                                    <div className="flex gap-2">
                                        {selectedBanks.map((bank) => (
                                            <div key={bank.id} className="w-1/3 text-xs text-gray-700 p-2 rounded-md">
                                                <p className="text-blue-800">{bank.name === "BLU PAY DETAILS" || bank.name === "Blu Pay Details" ? bank.name : <><span className="font-semibold">Bank:</span> {bank.name}</>}</p>
                                                <p>{bank.name === "BLU PAY DETAILS" || bank.name === "Blu Pay Details" ? <><span className="font-semibold">Ussd Code: </span>Dial {bank.accountNumber}</> : <><span className="font-semibold">Account Number:</span> {bank.accountNumber}</>}</p>
                                                <p><span className="font-semibold">Account Name:</span> {bank.accountName}</p>
                                                <p>{bank.name === "BLU PAY DETAILS" || bank.name === "Blu Pay Details" ? <span className="text-blue-800">{bank.branch}</span> : <><span className="font-semibold">Branch:</span> {bank.branch}</>}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-gray-700">
                                        <h5 className="text-xs mb-2 font-semibold text-blue-800">USD($) Dollar Physical Payments</h5>
                                        <p className="text-xs">For those paying with USD, please take note of the following:</p>
                                        <p className="text-xs">- We can only accept USD50 or USD100 notes.</p>
                                        <p className="text-xs">- We can accept from series 2013 and above.</p>
                                        <p className="text-xs">- USD notes must not have oil, dust and any form of dents.</p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs mb-2 font-semibold text-blue-800">NB: Please confirm your payments with CSL Accounts Officer on Call/WhatsApp via 0244-699-122 only. You can also
                                            send payment slips to the front desk of CSL Freight at Tabora Junction.
                                        </p>
                                    </div>
                                </div>
                                <div className="py-2 px-16">
                                    <h5 className="font-bold text-xs">Our Warehouses</h5>
                                    <div className="flex gap-4">
                                        {
                                            selectedWarehouses.map(warehouse=>(
                                                <div>
                                                    <p className="text-xs"><span className="text-blue-800 font-bold">{warehouse.description}: </span> {warehouse.name}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="py-2 px-16">
                                    <h5 className="font-bold text-xs">Our Helplines</h5>
                                    <div className="flex gap-4">
                                        {
                                            phone.map((p, idx)=>(
                                                <div key={idx} >
                                                    <p className="text-xs"><span className="text-blue-800 font-bold">{p}</span></p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditInvoice

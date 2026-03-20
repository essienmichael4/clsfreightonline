import { Plus } from "lucide-react"
import CreatePackage from "./CreatePackage"
import { DatePickerSimple } from "@/components/ui/date-picker-simple"
import { useState } from "react"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import  { toast } from "sonner"
import PackageDateTable from "./_components/PackageDateTable"
import { Link } from "react-router-dom"
import InTransitModal from "./_components/InTransitModal"

const PackageDate = () => {
    const [inTransitModalOpen, setInTransitModalOpen] = useState(false)
    const [dateType, setDateType] = useState<"RECEIVED" | "LOADED" | null>(null)
    const [loadingDate, setLoadingDate] = useState<Date | undefined>()
    const [receivedDate, setReceivedDate] = useState<Date | undefined>()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)

    const updatePackage = async ({ status, loaded, eta, }: { status: string, loaded?: string, eta?: string } ) => {
        if (!loadingDate && !receivedDate) return;

        if(loadingDate){
            const loadedDate = loadingDate.toISOString().split("T")[0];
            const response = await axios_instance_token.patch("/packages/status",
                {
                    status,
                    loaded: loadedDate,
                }
            );
            return response.data

        }else if(receivedDate){

            const received = receivedDate.toISOString().split("T")[0];

            const response = await axios_instance_token.patch("/packages/status",
                {
                    status,
                    received,
                    loaded: loaded ? loaded : undefined,
                    eta: eta ? eta : undefined, 
                }
            );

            return response.data;
        }
    };

    const {mutate, isPending} = useMutation({
        mutationFn: updatePackage,
        onSuccess: ()=>{
            toast.success("Packages updated successfully", {
                id: "packages-update"
            })

            queryClient.invalidateQueries({queryKey: ["packages", loadingDate]})
            queryClient.invalidateQueries({queryKey: ["packages"]})
            
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "packages-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "packages-update"
                })
            }
        }
    })

    const onPackageUpdate = (status:string)=>{
        if (status === "IN_TRANSIT") {
            setInTransitModalOpen(true)   // open modal instead of mutating directly
            return
        }
        toast.loading("Updating Packages ...", {
            id: "packages-update"
        })
        mutate({status})
    }

     const onInTransitConfirm = (loaded: string, eta: string) => {
        // const ids = table.getSelectedRowModel().rows.map((row) => row.original.id)
        toast.loading("Updating Packages ...", { id: "packages-update" })
        mutate(
            { status: "IN_TRANSIT", loaded, eta },
            {
            onSuccess: () => setInTransitModalOpen(false),
            onError: () => setInTransitModalOpen(false),
            }
        )
    }

    return (
        <>
            <div className="container mx-auto">
                <div className="mt-2 flex items-center justify-between">
                    <h3 className="font-bold">Packages</h3>
                    <div className="flex gap-3">
                        <Link to={"../upload/excel"} className="py-2 px-2 md:px-4 text-emerald-400 border border-emerald-400 flex items-center rounded-md">
                            <Plus className="w-4 h-4 mr-2 "/> <span className="text-xs md:text-sm">Add Packages</span>
                        </Link>
                        <CreatePackage trigger={
                            <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                            <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Package</span>
                            </button>}
                        />
                        </div>
                </div>
                <div className="w-full mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDateType("RECEIVED")}
                                className={`px-3 py-1 rounded-md text-sm ${
                                dateType === "RECEIVED"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                                }`}
                            >
                                Received Date
                            </button>

                            <button
                                onClick={() => setDateType("LOADED")}
                                className={`px-3 py-1 rounded-md text-sm ${
                                dateType === "LOADED"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                                }`}
                            >
                                Loaded Date
                            </button>
                        </div>
                        <div>
                            {dateType === "RECEIVED" && (
                                <DatePickerSimple
                                    value={receivedDate}
                                    text="Set received date"
                                    onChange={(date) => {
                                        setReceivedDate(date)
                                        setLoadingDate(undefined) // clear other
                                    }}
                                />
                            )}

                            {dateType === "LOADED" && (
                                <DatePickerSimple
                                    value={loadingDate}
                                    text="Set loaded date"
                                    onChange={(date) => {
                                        setLoadingDate(date)
                                        setReceivedDate(undefined) // clear other
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {((dateType === "RECEIVED" && receivedDate) ||
                        (dateType === "LOADED" && loadingDate)) && (
                        <div>
                            <button  onClick={()=>{onPackageUpdate("YET_TO_LOAD")}} disabled={isPending} className={`border bg-gray-700 hover:bg-gray-500 text-white text-xs py-2 px-4 rounded-md`}>Yet to load</button>
                            <button  onClick={()=>{onPackageUpdate("IN_TRANSIT")}} disabled={isPending} className={`border bg-yellow-700 hover:bg-yellow-500 text-white text-xs py-2 px-4 rounded-md`}>In transit</button>
                            <button  onClick={()=>{onPackageUpdate("ARRIVED")}} disabled={isPending} className={`border bg-emerald-700 hover:bg-emerald-500 text-white text-xs py-2 px-4 rounded-md`}>Arrived</button>
                            <button  onClick={()=>{onPackageUpdate("DELIVERED")}} disabled={isPending} className={`border bg-blue-700 hover:bg-blue-500 text-white text-xs py-2 px-4 rounded-md`}>Delivered</button>
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <PackageDateTable page={page} limit={limit} loaded={loadingDate} received={receivedDate} setLimit={setLimit} setPage={setPage} />
                </div>
                <InTransitModal
                    open={inTransitModalOpen}
                    onClose={() => setInTransitModalOpen(false)}
                    onConfirm={onInTransitConfirm}
                    isPending={isPending}
                />
            </div>
        </>
    )
}

export default PackageDate

import { Link } from 'react-router-dom'
import { useState } from "react"
import { type RowSelectionState } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Package } from '@/lib/types'
import { DataTableColumnHeader } from './DataTable/ColumnHeader'
import { type ColumnDef, getCoreRowModel, flexRender, useReactTable, getPaginationRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2 } from 'lucide-react'
import EditPackage from '@/pages/Package/EditPackage'
import DeletePackage from '@/pages/Package/DeletePackage'
import { usePackages } from '@/hooks/usePackages'
import { toast } from 'sonner'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosToken from '@/hooks/useAxiosToken'
import type { DateFilter } from '@/pages/Package/_components/PackageFilters'
import InTransitModal from '@/pages/Package/_components/InTransitModal'

interface FilterProps{
    search:string,
    status:string,
    limit: number,
    page: number,
    filters: DateFilter,  
    setLimit: (value:number)=>void,
    setPage: (value:number)=>void
}

const emptyData: any[]= []

const AllPackages = ({page, limit, status, setLimit, setPage, search, filters}:FilterProps) => {
    const [inTransitModalOpen, setInTransitModalOpen] = useState(false)
    const packagesQuery = usePackages(page, limit, search, status, filters)
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()

    const updatePackages = async ({ status, ids, loaded, eta, vessel }: { status: string; ids: (number)[], loaded?: string, eta?: string, vessel?: string }) => {
        console.log(ids);
        
        const response = await axios_instance_token.patch("/packages/batch/statuses", {
            status,
            ids,
            ...(loaded && { loaded }),
            ...(eta && { eta }),
            ...(vessel && { vessel }),
        });
        return response.data;
    };

    const {mutate, isPending} = useMutation({
        mutationFn: updatePackages,
        onSuccess: ()=>{
            toast.success("Packages updated successfully", {
                id: "packages-update"
            })

            // queryClient.invalidateQueries({queryKey: ["packages", loadingDate]})
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

    const onPackagesUpdate = (status: string) => {
        if (status === "IN_TRANSIT") {
            setInTransitModalOpen(true)   // open modal instead of mutating directly
            return
        }
        const ids = table.getSelectedRowModel().rows.map((row) => Number(row.original.id))
        toast.loading("Updating Packages ...", { id: "packages-update" })
        mutate({ status, ids })
    }

    const onInTransitConfirm = (loaded: string, eta: string, vessel: string) => {
        const ids = table.getSelectedRowModel().rows.map((row) => Number(row.original.id))
        toast.loading("Updating Packages ...", { id: "packages-update" })
        mutate(
            { status: "IN_TRANSIT", ids, loaded, eta, vessel },
            {
            onSuccess: () => setInTransitModalOpen(false),
            onError: () => setInTransitModalOpen(false),
            }
        )
    }

    const columns:ColumnDef<Package>[] =[{
        id: "select",
        header: ({ table }) => (
            <Checkbox className="mx-4 accent-blue-700"
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <div className="mx-4">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
        cell:({row}) => <div>
            <Link to={`./${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "trackingNumber",
        header:({column})=>(<DataTableColumnHeader column={column} title='Tracking ID' />),
        cell:({row}) => <div>
                {row.original.trackingNumber}
        </div>
    },{
        accessorKey: "customer",
        header:({column})=>(<DataTableColumnHeader column={column} title='Customer' />),
        cell:({row}) => <div>
            {row.original.customer}
        </div>
    },{
        accessorKey: "received",
        header:({column})=>(<DataTableColumnHeader column={column} title='Received' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {new Date(row.original.received as string).toDateString()}
            </div>
        }
    },{
        accessorKey: "loaded",
        header:({column})=>(<DataTableColumnHeader column={column} title='Loaded' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.loaded ? new Date(row.original.loaded as string).toDateString() : "-"}
            </div>
        }
    },{
        accessorKey: "package",
        header:({column})=>(<DataTableColumnHeader column={column} title='Package' />),
        cell:({row}) => <div className='max-w-[300px] text-ellipsis overflow-hidden'>
            {row.original.package}
        </div>
    },{
        accessorKey: "packageType.description",
        header:({column})=>(<DataTableColumnHeader column={column} title='Package Type' />),
        cell:({row}) => <div className='max-w-[300px] text-ellipsis overflow-hidden'>
            {row.original.packageType?.description}
        </div>
    },{
        accessorKey: "quantity",
        header:({column})=>(<DataTableColumnHeader column={column} title='Quantity' />),
        cell:({row}) => {
            return <div>
                {row.original.quantity}
            </div>
        }
    },{
        accessorKey: "vessel",
        header:({column})=>(<DataTableColumnHeader column={column} title='Vessel' />),
        cell:({row}) => {
            return <div>
                {row.original.vessel}
            </div>
        }
    },{
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
        cell:({row}) => <div>
            <span className={`${row.original.status === "YET_TO_LOAD" && 'bg-gray-300'} ${row.original.status === "ARRIVED" && 'bg-emerald-300 text-emerald-700'} ${row.original.status === "IN_TRANSIT" && 'bg-yellow-300 text-yellow-700'} ${row.original.status === "DELIVERED" && 'bg-blue-300 text-blue-700'} py-2 px-4 rounded-full text-xs`}>{row.original.status}</span>
        </div>
    },{
        accessorKey: "cbm",
        header:({column})=>(<DataTableColumnHeader column={column} title='CBM' />),
        cell:({row}) => <div>
            {row.original.cbm}
        </div>
    },{
        accessorKey: "weight",
        header:({column})=>(<DataTableColumnHeader column={column} title='Weight' />),
        cell:({row}) => <div>
            {row.original?.weight}
        </div>
    },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
        cell:({row}) => <div>
            <span className="flex gap-2 items-center"  >
                <EditPackage page={page} limit={limit} search={search} item={row.original} status={status} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} /> 
            </span> 
        </div>
    }]

    const table = useReactTable({
        data: packagesQuery.data?.data || emptyData,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state:{
            pagination: {
                pageIndex: page - 1,
                pageSize: limit,
            },
            rowSelection
        },
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: packagesQuery.data?.meta?.pageCount,
    })

    return (
        <div className="my-2 p-2 md:px-0 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
                <div>
                    {Object.keys(rowSelection).length > 0 && (
                        <div className="mb-2 text-sm text-muted-foreground">
                            {table.getSelectedRowModel().rows.length} of{" "}
                            {table.getRowCount()} row(s) selected.
                        </div>
                    )}
                </div>
                {Object.keys(rowSelection).length > 0 && (
                    <div>
                        <button  onClick={()=>{onPackagesUpdate("YET_TO_LOAD")}} disabled={isPending} className={`border bg-gray-700 hover:bg-gray-500 text-white text-xs py-2 px-4 rounded-md`}>Yet to load</button>
                        <button  onClick={()=>{onPackagesUpdate("IN_TRANSIT")}} disabled={isPending} className={`border bg-yellow-700 hover:bg-yellow-500 text-white text-xs py-2 px-4 rounded-md`}>In transit</button>
                        <button  onClick={()=>{onPackagesUpdate("ARRIVED")}} disabled={isPending} className={`border bg-emerald-700 hover:bg-emerald-500 text-white text-xs py-2 px-4 rounded-md`}>Arrived</button>
                        <button  onClick={()=>{onPackagesUpdate("DELIVERED")}} disabled={isPending} className={`border bg-blue-700 hover:bg-blue-500 text-white text-xs py-2 px-4 rounded-md`}>Delivered</button>
                    </div>
                )}
            </div>
            <div className="w-full rounded-md  bg-white/75">
                <Table>
                    <TableHeader className="bg-gray-500 text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell className='py-6' key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4 mt-4">
                  <div>
                    <span className="mr-2">Items per page</span>
                    <select 
                      className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                      value={limit}
                      onChange={e=> {setLimit(Number(e.target.value))}} >

                      {[10,20,50,100].map((pageSize)=>(
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-2">
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(1)}
                        disabled={page === 1}>
                        <ChevronsLeft size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page - 1)}
                        disabled={page === 1}>
                        <ChevronLeft size={20} />
                      </button>

                      <span className="flex items-center">
                        <input 
                          className="w-16 p-2 rounded-md border border-gray-300 text-center"
                          min={1}
                          max={table.getPageCount()}
                          type="number"
                          value={table.getState().pagination.pageIndex + 1}
                          onChange={e=> {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            setPage(page)
                          }}
                        />
                        <span className="ml-1">of {packagesQuery.data?.meta.pageCount}</span>
                      </span>

                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page + 1)}
                        disabled={ page === Number(packagesQuery.data?.meta.pageCount) }>
                        <ChevronRight size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(Number(packagesQuery.data?.meta.pageCount))}
                        disabled={page === Number(packagesQuery.data?.meta.pageCount)}>
                        <ChevronsRight size={20} />
                      </button>
                  </div>
            </div>
            <InTransitModal
                open={inTransitModalOpen}
                onClose={() => setInTransitModalOpen(false)}
                onConfirm={onInTransitConfirm}
                isPending={isPending}
            />
        </div>
    )
}

export default AllPackages

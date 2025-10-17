import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeliveries } from "@/hooks/useDeliveries"
import { Delivery } from "@/lib/types"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const emptyData: any[]= []
const limit = 5

const Deliveries = () => {
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const deliveriesQuery = useDeliveries(page, limit)

    const columns:ColumnDef<Delivery>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='ID' />),
        cell:({row}) => <div className="text-xs">
            <Link to={`./${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
        },{
            accessorKey: "shippingMark",
            header:({column})=>(<DataTableColumnHeader column={column} title='Shipping Mark' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.client.shippingMark || '-'}</span>
            </div>
        },{
            accessorKey: "deliveryType",
            header:({column})=>(<DataTableColumnHeader column={column} title='Delivery Type' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500 capitalize'>{row.original.deliveryType || '-'}</span>
            </div>
        },{
            accessorKey: "pickupBy",
            header:({column})=>(<DataTableColumnHeader column={column} title='Pickup By' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500 capitalize'>{row.original.pickupBy || '-'}</span>
            </div>
        },{
            accessorKey: "thirdPartyName",
            header:({column})=>(<DataTableColumnHeader column={column} title='Third Party' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.thirdPartyName || '-'}</span>
            </div>
        },{
            accessorKey: "thirdPartyPhone",
            header:({column})=>(<DataTableColumnHeader column={column} title='Phone' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.thirdPartyPhone || '-'}</span>
            </div>
        },{
            accessorKey: "loaded",
            header:({column})=>(<DataTableColumnHeader column={column} title='Loaded' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.loaded || '-'}</span>
            </div>
        },{
            accessorKey: "location",
            header:({column})=>(<DataTableColumnHeader column={column} title='Location' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.location || '-'}</span>
            </div>
        },{
            accessorKey: "phone",
            header:({column})=>(<DataTableColumnHeader column={column} title='Phone' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.phone || '-'}</span>
            </div>
        }
    ]

    const table = useReactTable({
        data: deliveriesQuery.data?.data || emptyData,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(), 
    })

    const content = deliveriesQuery.isLoading ? <Skeleton>
      <div className="sm:h-72 md:h-80 lg:h-96 w-full">

      </div>
    </Skeleton> : deliveriesQuery.data?.data && deliveriesQuery.data?.data.length > 0 ? <>
        <div className="mt-2 mb-8 p-2 border rounded-2xl">
            <div className="w-full rounded-md  bg-white/75">
                <Table>
                    <TableHeader>
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
            <div className="flex items-center justify-end space-x-2 py-4 mt-4">
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
                        <span className="ml-1">of {deliveriesQuery.data?.meta.pageCount}</span>
                      </span>

                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page + 1)}
                        disabled={ page === Number(deliveriesQuery.data?.meta.pageCount) }>
                        <ChevronRight size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(Number(deliveriesQuery.data?.meta.pageCount))}
                        disabled={page === Number(deliveriesQuery.data?.meta.pageCount)}>
                        <ChevronsRight size={20} />
                      </button>
                  </div>
            </div>
        </div>
    </>: <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
        No deliveries yet...
        <p className="text-sm text-center text-muted-foreground">Create a delivery to view your summary.</p>
    </div>

    return (
        <div className="mt-4 min-h-screen container mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Deliveries</h2>
                <button onClick={() => navigate("create")} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                    Create Schedule
                </button>
            </div>
            {content}
        </div>
    )
}

export default Deliveries

import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeliveries } from "@/hooks/useDeliveries"
import type { Delivery } from "@/lib/types"
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { Link } from "react-router-dom"

interface FilterProps{
    status?: string,
    limit: number,
    page: number,
    setLimit: (value:number)=>void,
    setPage: (value:number)=>void
}

const emptyData: any[]= []

const DeliveryTable = ({status, page, limit, setLimit, setPage}:FilterProps) => {
    const ticketsQuery = useDeliveries(page, limit, status)

    const columns:ColumnDef<Delivery>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
        cell:({row}) => <div>
            <Link to={`./${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "clientName",
        header:({column})=>(<DataTableColumnHeader column={column} title='Client' />),
        cell:({row}) => <div className="lg:min-w-[150px] overflow-ellipsis">
                <p className="text-sm">{row.original.client.name}</p>
                <p className="text-xs text-gray-600">{row.original.client.shippingMark}</p>
        </div>
    },{
        accessorKey: "phone",
        header:({column})=>(<DataTableColumnHeader column={column} title='Phone' />),
        cell:({row}) => <div>
            {row.original.phone}
        </div>
    },{
        accessorKey: "deliverType",
        header:({column})=>(<DataTableColumnHeader column={column} title='Type' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.deliveryType}
            </div>
        }
    },{
        accessorKey: "pickupBy",
        header:({column})=>(<DataTableColumnHeader column={column} title='Pickup By' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.pickupBy}
            </div>
        }
    },{
        accessorKey: "thirdPartyName",
        header:({column})=>(<DataTableColumnHeader column={column} title='Party Name' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.thirdPartyName ? row.original.thirdPartyName : "-"}
            </div>
        }
    },{
        accessorKey: "thirdPartyPhone",
        header:({column})=>(<DataTableColumnHeader column={column} title='Party Phone' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.thirdPartyPhone ? row.original.thirdPartyPhone : "-"}
            </div>
        }
    },{
        accessorKey: "location",
        header:({column})=>(<DataTableColumnHeader column={column} title='Location' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.location}
            </div>
        }
    },{
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                <span className={`${row.original.status === "Completed" && "text-cyan-800 bg-cyan-100"} ${row.original.status === "Pending" && "text-emerald-800 bg-emerald-100"} py-2 px-4 rounded-md`}>
                    {row.original.status}
                </span>
            </div>
        }
    },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Ready for Pickup' />),
        cell:({row}) => <div>
            {/* <span className="flex gap-2 items-center"  > */}
                 <div className='text-muted-foreground text-nowrap'>
                <span className={`${row.original.isPickupReady === "True" && "text-cyan-800 bg-cyan-100"} ${row.original.isPickupReady === "False" && "text-emerald-800 bg-emerald-100"} py-2 px-4 rounded-md`}>
                    {row.original.status}
                </span>
            </div>
                {/* <Link to={`edit/${row.original.id}`}><Edit className="w-4 h-4 text-emerald-400"/></Link> */}
                {/* <EditPackage page={page} limit={limit} search={search} item={row.original} status={status} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />  */}
            {/* </span>  */}
        </div>
    }]

    const table = useReactTable({
        data: ticketsQuery.data?.data || emptyData,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        state:{
            pagination: {
                pageIndex: page - 1,
                pageSize: limit,
            }
        },
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: ticketsQuery.data?.meta?.pageCount,
    })

    return (
        <div className="my-8 p-2 md:px-0 rounded-2xl">
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
                            No deliveries added yet
                            <p className="text-sm text-center text-muted-foreground">Wait for clients to start adding some</p>
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
                        <span className="ml-1">of {ticketsQuery.data?.meta.pageCount}</span>
                      </span>

                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page + 1)}
                        disabled={ page === Number(ticketsQuery.data?.meta.pageCount) }>
                        <ChevronRight size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(Number(ticketsQuery.data?.meta.pageCount))}
                        disabled={page === Number(ticketsQuery.data?.meta.pageCount)}>
                        <ChevronsRight size={20} />
                      </button>
                  </div>
            </div>
        </div>
    )
}

export default DeliveryTable

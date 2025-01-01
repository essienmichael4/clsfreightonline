import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package } from '@/lib/types'
import { DataTableColumnHeader } from './DataTable/ColumnHeader'
import { ColumnDef, getCoreRowModel, flexRender, useReactTable, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Edit, Trash2 } from 'lucide-react'
import EditPackage from '@/pages/Package/EditPackage'
import { Button } from './ui/button'

interface FilterProps{
    filtering:string
}

const emptyData: any[]= []

const AllPackages = ({filtering}:FilterProps) => {
    const axios_instance_token = useAxiosToken()

    const orders = useQuery<Package[]>({
        queryKey: ["packages"],
        queryFn: async() => await axios_instance_token.get(`/packages`).then(res => res.data)
    })

    const columns:ColumnDef<Package>[] =[{
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
            {/* <Link to={`./${row.original.trackingNumber}`}> */}
                {row.original.trackingNumber}
            {/* </Link> */}
        </div>
    },{
        accessorKey: "customer",
        header:({column})=>(<DataTableColumnHeader column={column} title='Customer' />),
        cell:({row}) => <div>
            {row.original.customer}
        </div>
    },{
        accessorKey: "received",
        header:({column})=>(<DataTableColumnHeader column={column} title='Recceived' />),
        cell:({row}) => {
            // const date = new Date(row.original.received as string)
            // const formattedDate = FormattedDate(date)
            
            return <div className='text-muted-foreground text-nowrap'>
                {new Date(row.original.received as string).toDateString()}
            </div>
        }
    },{
        accessorKey: "loaded",
        header:({column})=>(<DataTableColumnHeader column={column} title='Loaded' />),
        cell:({row}) => {
            // const date = new Date(row.original.loaded as string)
            // const formattedDate = FormattedDate(date)
            
            return <div className='text-muted-foreground text-nowrap'>
                {new Date(row.original.loaded as string).toDateString()}
            </div>
        }
    },{
        accessorKey: "package",
        header:({column})=>(<DataTableColumnHeader column={column} title='Package' />),
        cell:({row}) => <div>
            {row.original.package}
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
            <span className={`${row.original.status === "ON_HOLD" && 'bg-gray-300'} ${row.original.status === "ARRIVED" && 'bg-emerald-300 text-emerald-700'} ${row.original.status === "EN_ROUTE" && 'bg-yellow-300 text-yellow-700'} ${row.original.status === "DELIVERED" && 'bg-blue-300 text-blue-700'} py-2 px-4 rounded-full text-xs`}>{row.original.status}</span>
        </div>
    },{
        accessorKey: "cbm",
        header:({column})=>(<DataTableColumnHeader column={column} title='CBM' />),
        cell:({row}) => <div>
            {row.original.cbm}
        </div>
    },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
        cell:({row}) => <div>
            <span className="flex gap-2 items-center"  >
                <EditPackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<Edit className="w-4 h-4 text-emerald-400"/>} />
                <Trash2 className="w-4 h-4 text-rose-400" /> 
            </span> 
        </div>
    }
    // ,{
    //     accessorKey: "status",
    //     header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
    //     cell:({row}) => <div>
    //         <span className={`${row.original.status === "HELD" && 'bg-gray-300'} ${row.original.status === "COMPLETED" && 'bg-emerald-300 text-emerald-700'} ${row.original.status === "CANCELLED" && 'bg-rose-300 text-rose-700'} ${row.original.status === "PENDING" && 'bg-blue-300 text-blue-700'} p-2 rounded-lg`}>
    //             {row.original.status}
    //         </span>
    //     </div>
    // }
    ]

    const table = useReactTable({
        data: orders.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 20
            }
        },
        state:{
            // sorting,
            globalFilter: filtering
        },
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                Previous
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                Next
                </Button>
            </div>
        </div>
    )
}

export default AllPackages

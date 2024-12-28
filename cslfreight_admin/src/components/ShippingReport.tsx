import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package } from '@/lib/types'
import { DataTableColumnHeader } from './DataTable/ColumnHeader'
import { ColumnDef, getCoreRowModel, flexRender, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useAxiosToken from '@/hooks/useAxiosToken'
import { FormattedDate } from '@/lib/helper'

const emptyData: any[]= []

const ShippingReport = () => {
    const axios_instance_token = useAxiosToken()

    const orders = useQuery<Package[]>({
        queryKey: ["summary-admin", "orders"],
        queryFn: async() => await axios_instance_token.get(`/recent-orders-admin`).then(res => res.data)
    })

    const columns:ColumnDef<Package>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='Order ID' />),
        cell:({row}) => <div>
            <Link to={`../co/administrator/orders/${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "createdAt",
        header:({column})=>(<DataTableColumnHeader column={column} title='Date' />),
        cell:({row}) => {
            const date = new Date(row.original.received as string)
            const formattedDate = FormattedDate(date)
            
            return <div className='text-muted-foreground'>
                {formattedDate}
            </div>
        }
    },{
        accessorKey: "product",
        header:({column})=>(<DataTableColumnHeader column={column} title='Product' />),
        cell:({row}) => <div>
            {row.original.cbm}
        </div>
    },{
        accessorKey: "amount",
        header:({column})=>(<DataTableColumnHeader column={column} title='Price' />),
        cell:({row}) => {
            return <div>
                {row.original.quantity}
            </div>
        }
    },{
        accessorKey: "recipient",
        header:({column})=>(<DataTableColumnHeader column={column} title='Recipient' />),
        cell:({row}) => <div>
            {row.original.vesselLine}
        </div>
    },{
        accessorKey: "account",
        header:({column})=>(<DataTableColumnHeader column={column} title='Account' />),
        cell:({row}) => <div>
            {row.original.quantity}
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
        
    })

    return (
        <div className="my-8 p-2 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">Package Report</h4>
            </div>
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
                            <TableCell key={cell.id}>
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
            </div>
    )
}

export default ShippingReport

import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { GetTierBadgeClass } from "@/lib/helper"
import { MembershipTier } from "@/lib/types"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Badge } from "lucide-react"

interface Props {
    membershipTiers?: MembershipTier[]
}

const emptyData: any[]= []

const Tiers = ({membershipTiers}:Props) => {

    const columns:ColumnDef<MembershipTier>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='ID' />),
        cell:({row}) => <div className="text-xs">
            {/* <Link to={`./${row.original.id}`}> */}
                <span className='text-gray-400'>#</span>{row.original.id}
            {/* </Link> */}
        </div>
        },{
            accessorKey: "name",
            header:({column})=>(<DataTableColumnHeader column={column} title='Name' />),
            cell:({row}) => <div className="flex gap-2 text-xs">
                <Badge className={`w-4 h-4 rounded-full ${GetTierBadgeClass(row.original.priority)}`} /><span className='text-gray-500'>{row.original.name}</span>
            </div>
        },{
            accessorKey: "minShipping",
            header:({column})=>(<DataTableColumnHeader column={column} title='Minimum Shipping' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.minShipping}</span>
            </div>
        },{
            accessorKey: "priority",
            header:({column})=>(<DataTableColumnHeader column={column} title='Priority' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.priority}</span>
            </div>
        }]
    
        const table = useReactTable({
            data: membershipTiers || emptyData,
            columns,
            manualPagination: true,
            getCoreRowModel: getCoreRowModel(), 
        })

    return (
        <div>
            <div className="w-full rounded-md border bg-white/75">
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
                            <TableCell className='py-4' key={cell.id}>
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

export default Tiers

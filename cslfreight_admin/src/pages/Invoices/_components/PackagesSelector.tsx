import { useMemo } from 'react'
import type { Package } from '@/lib/types'
import { DataTableColumnHeader } from '@/components/DataTable/ColumnHeader'
import {
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PackageSelectorProps {
  data: Package[]
  selected: Package[]
  onSelectionChange?: (rows: Package[]) => void
}

const AllPackages = ({ data, selected, onSelectionChange }: PackageSelectorProps) => {
  // Build rowSelection map from selected packages
  const rowSelection = useMemo(() => {
    return Object.fromEntries(selected.map((pkg) => [String(pkg.id), true]))
  }, [selected])

  const columns: ColumnDef<Package>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: 'trackingNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tracking ID" />
      ),
      cell: ({ row }) => <div>{row.original.trackingNumber}</div>,
    },
    {
      accessorKey: 'loaded',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Loaded" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground text-nowrap">
          {new Date(row.original.loaded as string).toDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'package',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Package" />
      ),
      cell: ({ row }) => <div>{row.original.package}</div>,
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => <div>{row.original.quantity}</div>,
    },
    {
      accessorKey: 'cbm',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CBM" />
      ),
      cell: ({ row }) => <div>{row.original.cbm}</div>,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    // When user changes selection → send new rows up
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater

      const selectedRows = Object.keys(newSelection)
        .filter((id) => newSelection[id])
        .map((id) => data.find((pkg) => String(pkg.id) === id))
        .filter(Boolean) as Package[]

      onSelectionChange?.(selectedRows)
    },
  })

  return (
    <div className="my-8 p-2 md:px-0 rounded-2xl">
      <div className="w-full rounded-md bg-white/75 h-96 overflow-y-scroll">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-3" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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

export default AllPackages

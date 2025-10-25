'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onChange: (value: "Public" | "Unlisted" | "Private" | "Scheduled") => void
  initialValue?: "Public" | "Unlisted" | "Private" | "Scheduled"
}

const PremierePicker = ({ onChange, initialValue = "Private" }: Props) => {
  const options: ("Public" | "Unlisted" | "Private" | "Scheduled")[] = ["Public", "Unlisted", "Private", "Scheduled"]
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<"Public" | "Unlisted" | "Private" | "Scheduled">(initialValue)

  // ✅ Notify parent on change
  useEffect(() => {
    if (!value) return
    onChange(value)
  }, [value, onChange])

  // ✅ Update picker if initialValue changes (e.g., after video data loads)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const selected = options.find(status => status === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full text-xs justify-between"
        >
          {selected ? <StatusRow status={selected} /> : "Select premiere"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={e => e.preventDefault()}>
          <CommandInput placeholder="Search premiere" />
          <CommandGroup>
            <CommandList>
              {options.map(status => (
                <CommandItem
                  key={status}
                  onSelect={() => {
                    setValue(status)
                    setOpen(false)
                  }}
                >
                  <StatusRow status={status} />
                  <Check
                    className={cn("ml-auto w-4 h-4 opacity-0", value === status && "opacity-100")}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function StatusRow({ status }: { status: "Public" | "Unlisted" | "Private" | "Scheduled" }) {
    const colors: Record<string, string> = {
        Public: "bg-green-100 text-green-700 border-green-200",
        Unlisted: "bg-blue-100 text-blue-700 border-blue-200",
        Private: "bg-gray-100 text-gray-700 border-gray-200",
        Scheduled: "bg-yellow-100 text-yellow-700 border-yellow-200",
    }

    return (
        <div
        className={cn(
            "flex items-center gap-2 px-2 py-1 rounded-md border text-xs font-medium",
            colors[status]
        )}
        >
        <span>{status}</span>
        </div>
    )
}

export default PremierePicker

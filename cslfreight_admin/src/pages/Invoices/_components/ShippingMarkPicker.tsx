import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { axios_instance_token } from '@/api/axios'
import type { Client } from '@/lib/types'

interface Props {
  onChange: (client: Client) => void
  defaultValue?: string
}

const ShippingMarkPicker = ({ onChange, defaultValue }: Props) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)

  const clientsQuery = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () =>
      await axios_instance_token
        .get('/users/clients/shipping-marks')
        .then((res) => res.data),
  })

  // set default from prop
  useEffect(() => {
    if (defaultValue && clientsQuery.data) {
      const client = clientsQuery.data.find(
        (c) => c.shippingMark === defaultValue
      )
      if (client) {
        setSelected(client)
      }
    }
  }, [defaultValue, clientsQuery.data])

  // notify parent when selection changes
  useEffect(() => {
    if (selected) {
      onChange(selected)
    }
  }, [selected, onChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full text-xs justify-between"
        >
          {selected ? (
            <StatusRow shippingMark={selected.shippingMark} />
          ) : (
            <span className="text-muted-foreground">Select shipping mark</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="Search shipping marks" />
          <CommandGroup>
            <CommandList>
              {clientsQuery.isLoading ? (
                <p className="p-2 text-xs text-muted-foreground">Loading...</p>
              ) : clientsQuery.data?.length === 0 ? (
                <p className="p-2 text-xs text-muted-foreground">
                  No shipping marks found
                </p>
              ) : (
                clientsQuery.data?.map((client) => (
                  <CommandItem
                    key={client.id}
                    aria-selected={selected?.id === client.id}
                    onSelect={() => {
                      setSelected(client)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 opacity-0',
                        selected?.id === client.id && 'opacity-100'
                      )}
                    />
                    <StatusRow shippingMark={client.shippingMark} />
                  </CommandItem>
                ))
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function StatusRow({ shippingMark }: { shippingMark: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span>{shippingMark}</span>
    </div>
  )
}

export default ShippingMarkPicker

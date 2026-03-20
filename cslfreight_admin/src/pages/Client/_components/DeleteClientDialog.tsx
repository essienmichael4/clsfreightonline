import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import type { Client } from '@/lib/types'

interface Props {
  trigger?: React.ReactNode
  client: Client
}

const HOLD_DURATION = 5 // seconds

const DeleteClient = ({ client, trigger }: Props) => {
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [countdown, setCountdown] = useState(HOLD_DURATION)
  const [isHolding, setIsHolding] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const axios_instance_token = useAxiosToken()
  const queryClient = useQueryClient()

  const REQUIRED_TEXT = client.shippingMark

  const isConfirmed =
    confirmation.trim().toLowerCase() === REQUIRED_TEXT.toLowerCase()

  const deleteClient = async () => {
    const response = await axios_instance_token.delete(
      `/users/clients/${client.id}`
    )
    return response.data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      toast.success('Client deleted successfully', { id: 'delete-client' })

      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['clients', client.id] })

      resetHold()
      setConfirmation('')
      setOpen(false)
    },
    onError: (err: any) => {
      resetHold()
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message, { id: 'delete-client' })
      } else {
        toast.error('Something went wrong', { id: 'delete-client' })
      }
    },
  })

  const startHold = () => {
    if (!isConfirmed || isPending) return

    setIsHolding(true)
    setCountdown(HOLD_DURATION)

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          toast.loading('Deleting client...', { id: 'delete-client' })
          mutate()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsHolding(false)
    setCountdown(HOLD_DURATION)
  }

  useEffect(() => {
    return () => resetHold()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="w-[90%] mx-auto rounded-2xl">
        <DialogHeader className="items-start">
          <DialogTitle>Delete Client</DialogTitle>
        </DialogHeader>

        <div className="text-sm space-y-4">
          <p>
            Are you sure you want to delete client with Shipping Mark:{' '}
            <span className="text-cyan-700 font-medium">
              {client.shippingMark}
            </span>{' '}
            and email:{' '}
            <span className="text-cyan-700 font-medium">{client.email}</span>?
          </p>

          <p className="text-rose-600 text-xs">
            This action is not reversible. Also, the record will have a waiting period of 15-30 days before it is permanently deleted from our servers to comply with data protection regulations.
          </p>

          <div className="space-y-1">
            <label className="text-xs font-medium">
              Type{' '}
              <span className="font-semibold text-rose-600">
                {REQUIRED_TEXT}
              </span>{' '}
              to confirm
            </label>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={`Type ${REQUIRED_TEXT}`}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={resetHold}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            onMouseDown={startHold}
            onMouseUp={resetHold}
            onMouseLeave={resetHold}
            onTouchStart={startHold}
            onTouchEnd={resetHold}
            disabled={!isConfirmed || isPending}
            className={`text-white transition-all ${
              isHolding
                ? 'bg-rose-800'
                : 'bg-gradient-to-r from-rose-500 to-rose-800'
            }`}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : isHolding ? (
              `Hold to delete (${countdown}s)`
            ) : (
              'Hold to delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteClient

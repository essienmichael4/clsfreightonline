// components/InTransitModal.tsx
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface InTransitModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (loaded: string, eta: string, vessel: string) => void
  isPending: boolean
}

const InTransitModal = ({ open, onClose, onConfirm, isPending }: InTransitModalProps) => {
  const [loaded, setLoaded] = useState("")
  const [eta, setEta] = useState("")
  const [vessel, setVessel] = useState("")

  const handleClose = () => {
    setLoaded("")
    setEta("")
    setVessel("")
    onClose()
  }

  const handleConfirm = () => {
    if (!loaded || !eta || !vessel) return
    onConfirm(loaded, eta, vessel)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Mark as In Transit</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the loading date and estimated arrival date for the selected packages.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Loaded Date</label>
            <input
              type="date"
              value={loaded}
              onChange={(e) => setLoaded(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">ETA Date</label>
            <input
              type="date"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vessel Name</label>
            <input
              type="text"
              value={vessel}
              onChange={(e) => setVessel(e.target.value)}
              placeholder="Enter vessel name"
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!loaded || !eta || !vessel || isPending}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InTransitModal

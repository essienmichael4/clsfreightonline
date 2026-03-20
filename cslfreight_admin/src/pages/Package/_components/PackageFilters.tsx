import { useRef, useEffect } from "react"
import { X, CalendarIcon } from "lucide-react"

export type DateFilter = {
  receivedFrom: string
  receivedTo: string
  loadedFrom: string
  loadedTo: string
}

const FilterPopup = ({
  filters,
  setFilters,
  onApply,
  onReset,
  onClose,
}: {
  filters: DateFilter
  setFilters: (f: DateFilter) => void
  onApply: () => void
  onReset: () => void
  onClose: () => void
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div className="absolute right-0 top-full mt-2 z-50" ref={popupRef}>
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Filter by Date</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Received Date Range */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Received Date
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6">From</span>
              <div className="relative flex-1">
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.receivedFrom}
                  onChange={(e) => setFilters({ ...filters, receivedFrom: e.target.value })}
                  className="w-full border border-gray-200 rounded-md pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6">To</span>
              <div className="relative flex-1">
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.receivedTo}
                  min={filters.receivedFrom}
                  onChange={(e) => setFilters({ ...filters, receivedTo: e.target.value })}
                  className="w-full border border-gray-200 rounded-md pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4" />

        {/* Loaded Date Range */}
        <div className="mb-5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Loaded Date
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6">From</span>
              <div className="relative flex-1">
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.loadedFrom}
                  onChange={(e) => setFilters({ ...filters, loadedFrom: e.target.value })}
                  className="w-full border border-gray-200 rounded-md pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-6">To</span>
              <div className="relative flex-1">
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.loadedTo}
                  min={filters.loadedFrom}
                  onChange={(e) => setFilters({ ...filters, loadedTo: e.target.value })}
                  className="w-full border border-gray-200 rounded-md pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-2 text-xs bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterPopup

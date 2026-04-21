import { useState, useRef, useEffect, useCallback } from "react"
import { Search, Plus, Pencil, Trash2, X, CloudUpload } from "lucide-react"
import useAxiosToken from "@/hooks/useAxiosToken"

type ProductStatus = "draft" | "active" | "archived"

type Product = {
  id: number
  productId?: string
  name: string
  price: number
  description?: string
  status?: ProductStatus
  imageUrls?: string[]
}

const emptyForm = {
  name: "",
  price: "",
  description: "",
  status: "active" as ProductStatus,
  imageFiles: [] as File[],
  imagePreviews: [] as string[],
}

const STATUS_LABELS: Record<ProductStatus, string> = {
  draft: "draft",
  active: "active",
  archived: "archived",
}

const STATUS_STYLES: Record<ProductStatus, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  archived: "bg-slate-100 text-slate-500",
}

const ShopProducts = () => {
  const axiosToken = useAxiosToken()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("active")
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      if (statusFilter === "all") {
        const [draftRes, activeRes, archivedRes] = await Promise.all([
          axiosToken.get("/stores/products", { params: { page: 1, limit: 50, status: "draft" } }),
          axiosToken.get("/stores/products", { params: { page: 1, limit: 50, status: "active" } }),
          axiosToken.get("/stores/products", { params: { page: 1, limit: 50, status: "archived" } }),
        ])
        const extract = (res: any) => { const d = res.data?.data ?? res.data; return Array.isArray(d) ? d : [] }
        setProducts([...extract(draftRes), ...extract(activeRes), ...extract(archivedRes)])
      } else {
        const apiStatus = statusFilter
        console.log("Fetching with status:", apiStatus)
        const res = await axiosToken.get("/stores/products", {
          params: { page: 1, limit: 50, status: apiStatus },
        })
        console.log("GET response:", res.data)
        const data = res.data?.data ?? res.data
        if (Array.isArray(data) && data.length > 0) console.log("First product sample:", data[0])
        setProducts(Array.isArray(data) ? data : [])
      }
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [axiosToken, statusFilter])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleImageFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (e) =>
        setForm((prev) => ({
          ...prev,
          imageFiles: [...prev.imageFiles, file],
          imagePreviews: [...prev.imagePreviews, e.target?.result as string],
        }))
      reader.readAsDataURL(file)
    })
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setError(null)
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description ?? "",
      status: (product.status as ProductStatus) ?? "active",
      imageFiles: [],
      imagePreviews: product.imageUrls ?? [],
    })
    setError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setForm(emptyForm)
    setError(null)
  }

  const uploadImages = async (productId: number | string, files: File[]) => {
    if (files.length === 0) return
    const formData = new FormData()
    files.forEach(file => formData.append("files", file))
    console.log("Uploading to:", `/stores/products/${productId}/uploads`)
    const uploadRes = await axiosToken.post(`/stores/products/${productId}/uploads`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    console.log("Upload response:", uploadRes.data)
  }

  const extractError = (err: any): string => {
    const msg = err?.response?.data?.message
    if (!msg) return "Something went wrong. Please try again."
    if (Array.isArray(msg)) return msg.join(", ")
    return String(msg)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const price = parseFloat(form.price)
    if (isNaN(price) || price < 0) {
      setError("Please enter a valid price.")
      return
    }

    setSubmitting(true)
    try {
      if (editingProduct) {
        const patchId = editingProduct.productId ?? editingProduct.id
        console.log("Editing product, patchId:", patchId, "new status:", form.status)
        const editRes = await axiosToken.patch(`/stores/products/${patchId}`, {
          name: form.name,
          price,
          description: form.description || undefined,
          status: form.status,
        })
        console.log("Edit PATCH response:", editRes.data)
        if (form.imageFiles.length > 0) {
          await uploadImages(patchId, form.imageFiles)
        }
      } else {
        console.log("Creating product with:", { name: form.name, category: form.category, price, description: form.description, status: form.status })
        const res = await axiosToken.post("/stores/products", {
          name: form.name,
          price,
          description: form.description || undefined,
        })
        console.log("Create response:", res.data)
        const newProductId = res.data?.productId ?? res.data?.data?.productId
        const newId = res.data?.id ?? res.data?.data?.id
        const patchId = newProductId ?? newId
        console.log("Using patchId (UUID preferred):", patchId, "status:", form.status)
        if (patchId) {
          const patchRes = await axiosToken.patch(`/stores/products/${patchId}`, { status: form.status })
          console.log("Status patch response:", patchRes.data)
          if (form.imageFiles.length > 0) {
            console.log("Uploading", form.imageFiles.length, "image(s)...")
            await uploadImages(patchId, form.imageFiles)
            console.log("Images uploaded successfully")
          }
        }
      }
      await fetchProducts()
      closeModal()
    } catch (err: any) {
      console.error("Submit error:", err?.response?.data ?? err.message)
      setError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (product: Product) => {
    const deleteId = product.productId ?? product.id
    try {
      console.log("Deleting product:", deleteId)
      await axiosToken.delete(`/stores/products/${deleteId}`)
      console.log("Deleted successfully")
      setProducts(prev => prev.filter(p => p.id !== product.id))
    } catch (err: any) {
      console.error("Delete failed:", err?.response?.data ?? err.message)
    }
    setDeleteConfirmId(null)
  }

  return (
    <div className="p-10 space-y-8">
      {/* Status Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "draft", "active", "archived"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${
              statusFilter === s
                ? "bg-[#00668a] text-white border-[#00668a]"
                : "bg-white text-slate-500 border-[#bdc8d0]/40 hover:border-[#00668a]/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full bg-white border border-[#bdc8d0]/30 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] transition-all"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-[#00668a] to-[#34b7f1] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#bdc8d0]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f0f4f9]">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Product</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Price</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bdc8d0]/10">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f0f4f9]" />
                        <div className="h-3 bg-[#f0f4f9] rounded w-32" />
                      </div>
                    </td>
                    <td className="px-8 py-5"><div className="h-3 bg-[#f0f4f9] rounded w-16" /></td>
                    <td className="px-8 py-5"><div className="h-3 bg-[#f0f4f9] rounded w-16" /></td>
                    <td className="px-8 py-5" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-sm text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f0f4f9] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#d6dadf] flex-shrink-0">
                          {product.imageUrls?.[0] && (
                            <img
                              alt={product.name}
                              className="w-full h-full object-cover"
                              src={product.imageUrls[0]}
                            />
                          )}
                        </div>
                        <span className="text-sm font-bold text-[#171c20]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-[#171c20]">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-8 py-5">
                      {product.status && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${STATUS_STYLES[product.status as ProductStatus] ?? "bg-slate-100 text-slate-500"}`}>
                          {STATUS_LABELS[product.status as ProductStatus] ?? product.status}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {deleteConfirmId === product.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-500">Delete?</span>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-slate-400 hover:text-[#00668a] transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#171c20]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-[#171c20] transition-colors">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Product Name</label>
                <input
                  className="w-full bg-[#f0f4f9] border-none rounded-lg py-3 px-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#34b7f1] transition-all"
                  placeholder="e.g. Minimalist Oak Chair"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Price ($)</label>
                <input
                  className="w-full bg-[#f0f4f9] border-none rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] transition-all"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Description</label>
                <textarea
                  className="w-full bg-[#f0f4f9] border-none rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] transition-all"
                  placeholder="Describe the product..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["draft", "active", "archived"] as ProductStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, status: s })}
                      className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide border-2 transition-all ${
                        form.status === s
                          ? s === "active"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : s === "draft"
                            ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                            : "border-slate-400 bg-slate-100 text-slate-600"
                          : "border-transparent bg-[#f0f4f9] text-slate-400 hover:border-[#bdc8d0]"
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Product Images</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  className="hidden"
                  onChange={(e) => { if (e.target.files) handleImageFiles(e.target.files); e.target.value = "" }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageFiles(e.dataTransfer.files) }}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer group ${isDragging ? "border-[#34b7f1] bg-[#e6f7ff]" : "border-[#bdc8d0]/30 bg-[#f0f4f9] hover:bg-[#eaeef3]"}`}
                >
                  <CloudUpload size={32} className="text-[#34b7f1] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-medium text-slate-500">
                    Drop files here or <span className="text-[#00668a] font-bold">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG or JPG — you can add multiple</p>
                </div>
                {form.imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {form.imagePreviews.map((src, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden bg-[#f0f4f9] aspect-square">
                        <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({
                            ...prev,
                            imageFiles: prev.imageFiles.filter((_, idx) => idx !== i),
                            imagePreviews: prev.imagePreviews.filter((_, idx) => idx !== i),
                          }))}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#00668a] to-[#34b7f1] text-white py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? "Saving..." : editingProduct ? "Save Changes" : `Save as ${STATUS_LABELS[form.status]}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopProducts

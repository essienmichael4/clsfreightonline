import { useState, useRef } from "react"
import { Search, Plus, Pencil, Trash2, X, CloudUpload } from "lucide-react"

type Product = {
  id: number
  name: string
  sku: string
  category: string
  price: string
  stock: number
  img: string
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "The Lunar Vessel",
    sku: "LV-2024-001",
    category: "Art",
    price: "$420.00",
    stock: 12,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIcmeiEyD87Ar56iHQP2sdtSkCVgEf5HuxfwMUTDlTLk2CZtzaNA3h5Ek_XtQAHtvegXobwwKsCZ7tJ9T8koA1Dh4wvI7jwT8R-MblBaODNZdC78IM8ravhO4kdUB39R7t2q9Uev9NBgawAiZz0ZQc4ZgkvSdHahR9Hy4GGeGU3wdqsn101LyhiafA7C5fJjaqhENjvleFdSOyt-_WLNGftnA0dW8hzTZAtWfBcWQim7gTZu0gsW7-9haaM9oCSQUB89LfZOwIfpQY",
  },
  {
    id: 2,
    name: "Nebula Desk Lamp",
    sku: "NL-449-B",
    category: "Lighting",
    price: "$185.00",
    stock: 34,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4L4nrn-Mwdu7Wita5fGbkEqbZkRVTx8-ZeY5jtijzuRBHf1Nz5ynWOTRe00aCyrD-tKIyCFMTGvPoWpkTtQUOFlivoJjKhd0gh-irrTEVrODYjUBTNEBIklEnBLXrn_b48MK4Qs6TWdmuObymof5osS3gcmWNp5g2T3cTvT-l-wc-4atZE6vU9DuflV4ZbXJzPP0yIz12h3aVgosfhQpq3ayBdF9a_21CG5F7GdP0fPuyDCMUjwoQww596DiUrYLY2rsggDRdTjKG",
  },
  {
    id: 3,
    name: "Ethereal Silk Chair",
    sku: "EC-012-S",
    category: "Furniture",
    price: "$1,290.00",
    stock: 7,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZEeeZjYt5YCMLUjF2bM-7wjr9YOGeUWZ5qOqhVfa6--B_INPsjprD0DKhZ4HPLS4Ca3cp9JAo8p3On41gfkwo8_XgV8waY_RxAETuGiDpwVKiQl1Na9NFHKDchBK-vWv9hE__CZGzA91VXhoKx1seGtD4g8t2foU1KLuYAbHWsKNP9euMiaP8K1uLKpnmUGcsCxu3WOx-N7sR9Q3x_2jlED1zdzac7pYD3lve770EOsME-lMRJ2_P_27F9jDlFXVDw23crrWjDR2M",
  },
  {
    id: 4,
    name: "Obsidian Coffee Table",
    sku: "OT-990-BLK",
    category: "Furniture",
    price: "$2,100.00",
    stock: 3,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEvHKpgycuA2gjY-pL-LjupkthjzfLdVH40I_NmGhoGM8ZqjU88EXDzHi-_HU-Kw33gl_DsKmJaMoI5KxdLic8CNfCMbgWGJ2n4pF12DrnZNasL13G4urdUBo4w2Csq2Cx3hP41SONbwB_bEwO8M2zz546SmC_cCDdEQ0SaL7SyPdHfR5OYkMqjTzzUmS4r5U64lp8ibM2uQeBif3Zo_taxcMjCXapD6TZvXtR9J-ayh5xivc3Evh2-oMyn6fb9lgXKzFtmqnPM2-Q",
  },
]


const emptyForm = { name: "", category: "Furniture", price: "", description: "", imagePreviews: [] as string[] }

const ShopProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (e) =>
        setForm((prev) => ({ ...prev, imagePreviews: [...prev.imagePreviews, e.target?.result as string] }))
      reader.readAsDataURL(file)
    })
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const openAddModal = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setForm({ name: product.name, category: product.category, price: product.price, description: "", imagePreviews: product.img ? [product.img] : [] })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setForm(emptyForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: form.name, category: form.category, price: form.price }
            : p
        )
      )
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: form.name,
        sku: `SKU-${Date.now()}`,
        category: form.category,
        price: `$${parseFloat(form.price || "0").toFixed(2)}`,
        stock: 0,
        img: form.imagePreviews[0] ?? "",
      }
      setProducts((prev) => [...prev, newProduct])
    }
    closeModal()
  }

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirmId(null)
  }

  return (
    <div className="p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full bg-white border border-[#bdc8d0]/30 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] transition-all"
            placeholder="Search by name or SKU..."
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
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">SKU</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Category</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Price</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Stock</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bdc8d0]/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-sm text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f0f4f9] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#d6dadf] flex-shrink-0">
                          {product.img && <img alt={product.name} className="w-full h-full object-cover" src={product.img} />}
                        </div>
                        <span className="text-sm font-bold text-[#171c20]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">{product.sku}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-[#bde5ff] text-[#40677d] rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-[#171c20]">{product.price}</td>
                    <td className="px-8 py-5">
                      <span className={`text-sm font-semibold ${product.stock <= 5 ? "text-red-500" : "text-[#171c20]"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {deleteConfirmId === product.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-500">Delete?</span>
                          <button
                            onClick={() => handleDelete(product.id)}
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
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#171c20] font-['Manrope',sans-serif]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-[#171c20] transition-colors">
                <X size={20} />
              </button>
            </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Category</label>
                  <select
                    className="w-full bg-[#f0f4f9] border-none rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] transition-all"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Furniture</option>
                    <option>Decor</option>
                    <option>Lighting</option>
                    <option>Art</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Price ($)</label>
                  <input
                    className="w-full bg-[#f0f4f9] border-none rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] transition-all"
                    placeholder="0.00"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Description</label>
                <textarea
                  className="w-full bg-[#f0f4f9] border-none rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] transition-all"
                  placeholder="Describe the editorial value..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#00668a]">Product Imagery</label>
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
                          onClick={() => setForm((prev) => ({ ...prev, imagePreviews: prev.imagePreviews.filter((_, idx) => idx !== i) }))}
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
                className="w-full bg-gradient-to-r from-[#00668a] to-[#34b7f1] text-white py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:opacity-90 transition-opacity"
              >
                {editingProduct ? "Save Changes" : "Publish to CslFreight"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopProducts

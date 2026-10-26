import { useMemo, useState } from "react";
import { useApp, catName } from "../store.jsx";
import { Btn, Icon, Img, Badge, Modal, Confirm } from "../ui.jsx";

const AVAILABILITY_OPTIONS = ["Available", "Limited", "On Request", "Unavailable"];

export function ProductsAdmin() {
  const { data, upsert, remove, notify } = useApp();
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState(null); // null or product object
  const [deleting, setDeleting] = useState(null); // null or product to delete
  const [err, setErr] = useState({});

  const categories = data.categories || [];
  const products = data.products || [];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = catFilter === "all" || p.category === catFilter;
      const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.short || "").toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, catFilter, q]);

  const openNew = () => {
    setEditing({
      id: "",
      name: "",
      category: categories[0]?.id || "premium",
      image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
      short: "",
      description: "",
      packaging: "",
      variants: "",
      storage: "",
      availability: "Available",
      featured: false,
      published: true,
    });
    setErr({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    const er = {};
    if (!editing.name.trim()) er.name = "Product name is required.";
    if (!editing.short.trim()) er.short = "Short description is required.";
    if (!editing.category) er.category = "Please select a category.";
    setErr(er);
    if (Object.keys(er).length) return;

    upsert("products", editing, "product");
    notify(`Product "${editing.name}" saved successfully.`);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("products", deleting.id, "product");
    notify(`Product "${deleting.name}" deleted.`);
    setDeleting(null);
  };

  const toggleFeatured = (p) => {
    upsert("products", { ...p, featured: !p.featured }, "product");
    notify(`Product "${p.name}" ${!p.featured ? "marked as featured" : "unfeatured"}.`);
  };

  const togglePublished = (p) => {
    upsert("products", { ...p, published: !p.published }, "product");
    notify(`Product "${p.name}" ${!p.published ? "published" : "hidden"}.`);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Products Management</h2>
          <p className="text-xs text-muted-foreground">
            Manage public catalogue items, packaging specs, availability, and featured status.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add New Product
        </Btn>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCatFilter("all")}
            className={`chip text-xs ${catFilter === "all" ? "chip-on" : ""}`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setCatFilter(c.id)}
                className={`chip text-xs ${catFilter === c.id ? "chip-on" : ""}`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-slate-50/70 text-ink/70">
            <tr>
              <th className="p-3.5 pl-4 font-semibold">Product</th>
              <th className="p-3.5 font-semibold">Category</th>
              <th className="p-3.5 font-semibold">Packaging / Variants</th>
              <th className="p-3.5 font-semibold">Availability</th>
              <th className="p-3.5 text-center font-semibold">Featured</th>
              <th className="p-3.5 text-center font-semibold">Status</th>
              <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition">
                <td className="p-3.5 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-sage">
                      <Img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-bold text-forest">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">{p.short}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-medium text-ink/80">{catName(data, p.category)}</td>
                <td className="p-3.5 text-[11px] text-muted-foreground">
                  <div>{p.packaging || "—"}</div>
                  <div className="text-[10px] text-ink/60">{p.variants || ""}</div>
                </td>
                <td className="p-3.5">
                  <Badge>{p.availability}</Badge>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => toggleFeatured(p)}
                    className={`inline-flex items-center justify-center rounded-lg p-1.5 transition ${
                      p.featured ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-slate-500"
                    }`}
                    title={p.featured ? "Featured on Home" : "Click to feature"}
                  >
                    <Icon name="star" className="h-4 w-4" />
                  </button>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => togglePublished(p)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                      p.published ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="p-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditing({ ...p })}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage hover:text-forest"
                      title="Edit Product"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(p)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete Product"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No products match the filter or search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Product Modal */}
      {editing && (
        <Modal
          open={true}
          onClose={() => setEditing(null)}
          title={editing.id ? `Edit Product: ${editing.name}` : "Add New Product"}
          wide
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Product Name <span className="text-terracotta">*</span>
                </label>
                <input
                  className="input mt-1"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Artisan Spice Blend Collection"
                />
                {err.name && <p className="mt-1 text-xs text-destructive">{err.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Category <span className="text-terracotta">*</span>
                </label>
                <select
                  className="input mt-1"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Availability Status
                </label>
                <select
                  className="input mt-1"
                  value={editing.availability}
                  onChange={(e) => setEditing({ ...editing, availability: e.target.value })}
                >
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Image URL
                </label>
                <input
                  className="input mt-1"
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
                {editing.image && (
                  <div className="mt-2 h-24 w-24 overflow-hidden rounded-xl border border-line">
                    <Img src={editing.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Short Description <span className="text-terracotta">*</span>
                </label>
                <input
                  className="input mt-1"
                  value={editing.short}
                  onChange={(e) => setEditing({ ...editing, short: e.target.value })}
                  placeholder="Brief summary for cards"
                />
                {err.short && <p className="mt-1 text-xs text-destructive">{err.short}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Detailed Product Description
                </label>
                <textarea
                  rows={3}
                  className="input mt-1"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Full description displayed on single product page"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Packaging Formats
                </label>
                <input
                  className="input mt-1"
                  value={editing.packaging}
                  onChange={(e) => setEditing({ ...editing, packaging: e.target.value })}
                  placeholder="e.g. Glass jars, Retort pouches"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Available Variants / Sizes
                </label>
                <input
                  className="input mt-1"
                  value={editing.variants}
                  onChange={(e) => setEditing({ ...editing, variants: e.target.value })}
                  placeholder="e.g. 250 g, 1 kg, 5 kg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Storage Instructions
                </label>
                <input
                  className="input mt-1"
                  value={editing.storage}
                  onChange={(e) => setEditing({ ...editing, storage: e.target.value })}
                  placeholder="e.g. Keep tightly closed, away from sunlight"
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="h-4 w-4 rounded text-forest focus:ring-forest"
                  />
                  <span className="text-xs font-medium text-ink">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="h-4 w-4 rounded text-forest focus:ring-forest"
                  />
                  <span className="text-xs font-medium text-ink">Published (Visible on site)</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">
                Save Product
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Product Confirm Dialog */}
      <Confirm
        open={!!deleting}
        title={`Delete "${deleting?.name}"?`}
        message="Are you sure you want to delete this product? This action will remove it from the catalogue and local storage."
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

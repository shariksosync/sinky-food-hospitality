import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Img, Modal, Confirm } from "../ui.jsx";

const SERVICE_CATEGORIES = ["Hospitality", "Manufacturing"];

export function ServicesAdmin() {
  const { data, upsert, remove, notify } = useApp();
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const services = data.services || [];

  const filtered = services.filter((s) => catFilter === "all" || s.category === catFilter);

  const openNew = () => {
    setEditing({
      id: `s-${Date.now().toString(36)}`,
      title: "",
      category: "Hospitality",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
      description: "",
      featured: false,
      visible: true,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.title.trim() || !editing.description.trim()) return;
    upsert("services", editing, "service");
    notify(`Service "${editing.title}" saved.`);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("services", deleting.id, "service");
    notify(`Service "${deleting.title}" removed.`);
    setDeleting(null);
  };

  const toggleVisible = (s) => {
    upsert("services", { ...s, visible: !s.visible }, "service");
    notify(`Service "${s.title}" ${!s.visible ? "visible" : "hidden"}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Services Management</h2>
          <p className="text-xs text-muted-foreground">
            Manage Hospitality solutions and Food Manufacturing capabilities.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Service
        </Btn>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCatFilter("all")}
          className={`chip text-xs ${catFilter === "all" ? "chip-on" : ""}`}
        >
          All Services ({services.length})
        </button>
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`chip text-xs ${catFilter === c ? "chip-on" : ""}`}
          >
            {c} ({services.filter((s) => s.category === c).length})
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.id} className="card overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-sage">
                <Img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2 rounded-full bg-forest-deep/80 px-2.5 py-0.5 text-[10px] font-bold text-cream backdrop-blur-xs">
                  {s.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-forest">{s.title}</h3>
                <p className="mt-1.5 text-xs text-ink/75 line-clamp-3">{s.description}</p>
              </div>
            </div>

            <div className="border-t border-line p-3 flex items-center justify-between bg-slate-50/50">
              <button
                onClick={() => toggleVisible(s)}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  s.visible ? "bg-emerald-50 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}
              >
                {s.visible ? "Visible" : "Hidden"}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing({ ...s })}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage hover:text-forest"
                  title="Edit Service"
                >
                  <Icon name="edit" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting(s)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Delete Service"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          open={true}
          onClose={() => setEditing(null)}
          title={editing.title ? `Edit Service: ${editing.title}` : "Add Service"}
          wide
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Service Title <span className="text-terracotta">*</span>
                </label>
                <input
                  className="input mt-1"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Commercial Hospitality Supply"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Category
                </label>
                <select
                  className="input mt-1"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Image URL
                </label>
                <input
                  className="input mt-1"
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Description <span className="text-terracotta">*</span>
                </label>
                <textarea
                  rows={3}
                  className="input mt-1"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="h-4 w-4 rounded text-forest"
                  />
                  <span className="text-xs font-medium text-ink">Feature on relevant sections</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.visible}
                    onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
                    className="h-4 w-4 rounded text-forest"
                  />
                  <span className="text-xs font-medium text-ink">Visible on Website</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Service</Btn>
            </div>
          </form>
        </Modal>
      )}

      <Confirm
        open={!!deleting}
        title={`Delete Service "${deleting?.title}"?`}
        message="Are you sure you want to remove this service from the website?"
        confirmLabel="Delete Service"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

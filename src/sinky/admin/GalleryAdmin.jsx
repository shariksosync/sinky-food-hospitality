import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Img, Modal, Confirm } from "../ui.jsx";

export function GalleryAdmin() {
  const { data, upsert, remove, reorder, notify } = useApp();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const gallery = [...(data.gallery || [])].sort((a, b) => a.order - b.order);

  const openNew = () => {
    setEditing({
      id: `g-${Date.now().toString(36)}`,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
      caption: "",
      order: gallery.length + 1,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.image.trim() || !editing.caption.trim()) return;
    upsert("gallery", editing, "gallery image");
    notify(`Gallery photo "${editing.caption}" saved.`);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("gallery", deleting.id, "gallery image");
    notify("Gallery photo removed.");
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Gallery Management</h2>
          <p className="text-xs text-muted-foreground">
            Manage food photography, kitchen preparations, and beverage styling images.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Photo
        </Btn>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.map((item, idx) => (
          <div key={item.id} className="card overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative aspect-square overflow-hidden bg-sage">
                <Img src={item.image} alt={item.caption} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2 rounded-full bg-forest-deep/80 px-2 py-0.5 text-[10px] font-mono font-bold text-cream">
                  #{idx + 1}
                </span>
              </div>
              <div className="p-3">
                <p className="font-medium text-xs text-ink">{item.caption}</p>
              </div>
            </div>

            <div className="border-t border-line p-2 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => reorder("gallery", item.id, "up")}
                  disabled={idx === 0}
                  className="rounded p-1 text-muted-foreground hover:bg-sage disabled:opacity-30"
                  title="Move Left/Up"
                >
                  <Icon name="up" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => reorder("gallery", item.id, "down")}
                  disabled={idx === gallery.length - 1}
                  className="rounded p-1 text-muted-foreground hover:bg-sage disabled:opacity-30"
                  title="Move Right/Down"
                >
                  <Icon name="down" className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing({ ...item })}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-sage hover:text-forest"
                >
                  <Icon name="edit" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting(item)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
          title={editing.caption ? `Edit Gallery Item: ${editing.caption}` : "Add Gallery Photo"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Image URL <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                required
              />
              {editing.image && (
                <div className="mt-2 h-28 w-28 overflow-hidden rounded-xl border border-line">
                  <Img src={editing.image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Caption / Description <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.caption}
                onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                placeholder="e.g. Plated dessert presentation"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Photo</Btn>
            </div>
          </form>
        </Modal>
      )}

      <Confirm
        open={!!deleting}
        title="Delete Gallery Photo?"
        message="Are you sure you want to remove this photo from the gallery?"
        confirmLabel="Delete Photo"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

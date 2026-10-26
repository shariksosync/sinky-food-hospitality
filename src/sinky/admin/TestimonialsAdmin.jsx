import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Modal, Confirm } from "../ui.jsx";

export function TestimonialsAdmin() {
  const { data, upsert, remove, notify } = useApp();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const testimonials = data.testimonials || [];

  const openNew = () => {
    setEditing({
      id: `t-${Date.now().toString(36)}`,
      name: "",
      role: "",
      quote: "",
      approved: false,
      sample: false,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.name.trim() || !editing.quote.trim()) return;
    upsert("testimonials", editing, "testimonial");
    notify(`Testimonial from "${editing.name}" saved.`);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("testimonials", deleting.id, "testimonial");
    notify("Testimonial removed.");
    setDeleting(null);
  };

  const toggleApproved = (t) => {
    upsert("testimonials", { ...t, approved: !t.approved }, "testimonial");
    notify(`Testimonial ${!t.approved ? "approved and live" : "hidden from public view"}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Testimonials Management</h2>
          <p className="text-xs text-muted-foreground">
            Manage customer feedback and endorsements. Only approved, genuine reviews appear publicly.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Testimonial
        </Btn>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
        <p className="font-semibold flex items-center gap-1.5">
          <Icon name="star" className="h-4 w-4 text-amber-700" />
          Demonstration Integrity Rule
        </p>
        <p className="mt-1 text-amber-800">
          Sample demonstration testimonials are flagged and will not appear on the live website. The public
          testimonial section only displays when approved, authentic customer reviews are published.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t.id} className="card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-xs font-bold text-cream">
                    {t.name[0]}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-forest">{t.name}</h3>
                    <p className="text-[11px] text-terracotta">{t.role}</p>
                  </div>
                </div>
                {t.sample && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                    Sample Content
                  </span>
                )}
              </div>

              <blockquote className="mt-4 italic text-xs leading-relaxed text-ink/80 border-l-2 border-wheat pl-3">
                "{t.quote}"
              </blockquote>
            </div>

            <div className="mt-5 border-t border-line pt-3 flex items-center justify-between">
              <button
                onClick={() => toggleApproved(t)}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition ${
                  t.approved
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {t.approved ? "Approved & Live" : "Hidden (Unapproved)"}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing({ ...t })}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage hover:text-forest"
                  title="Edit"
                >
                  <Icon name="edit" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting(t)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Delete"
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
          title={editing.name ? `Edit Testimonial: ${editing.name}` : "Add Testimonial"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Client / Reviewer Name <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Role / Designation
              </label>
              <input
                className="input mt-1"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                placeholder="e.g. Operations Head, Boutique Hotel Mumbai"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Testimonial Quote <span className="text-terracotta">*</span>
              </label>
              <textarea
                rows={4}
                className="input mt-1"
                value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                placeholder="Client endorsement text..."
                required
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.approved}
                  onChange={(e) => setEditing({ ...editing, approved: e.target.checked })}
                  className="h-4 w-4 rounded text-forest"
                />
                <span className="text-xs font-medium text-ink">Approved for public display</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.sample}
                  onChange={(e) => setEditing({ ...editing, sample: e.target.checked })}
                  className="h-4 w-4 rounded text-forest"
                />
                <span className="text-xs font-medium text-ink">Mark as Sample / Demonstration placeholder</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Testimonial</Btn>
            </div>
          </form>
        </Modal>
      )}

      <Confirm
        open={!!deleting}
        title="Delete Testimonial?"
        message="Are you sure you want to delete this testimonial?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

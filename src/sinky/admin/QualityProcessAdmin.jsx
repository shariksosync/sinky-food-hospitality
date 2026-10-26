import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Modal, Confirm } from "../ui.jsx";

export function QualityProcessAdmin() {
  const { data, upsert, remove, reorder, notify } = useApp();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const process = [...(data.process || [])].sort((a, b) => a.order - b.order);

  const openNew = () => {
    setEditing({
      id: `q-${Date.now().toString(36)}`,
      order: process.length + 1,
      title: "",
      text: "",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.title.trim() || !editing.text.trim()) return;
    upsert("process", editing, "process step");
    notify(`Workflow step "${editing.title}" saved.`);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("process", deleting.id, "process step");
    notify("Workflow step deleted.");
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Quality & Process Workflow</h2>
          <p className="text-xs text-muted-foreground">
            Manage the sequential service workflow stages presented across the website.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Step
        </Btn>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-slate-50/70 text-ink/70">
            <tr>
              <th className="p-3.5 pl-4 font-semibold w-16">Step</th>
              <th className="p-3.5 font-semibold">Title</th>
              <th className="p-3.5 font-semibold">Description</th>
              <th className="p-3.5 text-center font-semibold w-24">Order</th>
              <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {process.map((step, idx) => (
              <tr key={step.id} className="hover:bg-slate-50/50 transition">
                <td className="p-3.5 pl-4 font-serif text-lg font-bold text-wheat">
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td className="p-3.5 font-serif text-sm font-bold text-forest">{step.title}</td>
                <td className="p-3.5 text-ink/80 max-w-md">{step.text}</td>
                <td className="p-3.5 text-center">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => reorder("process", step.id, "up")}
                      disabled={idx === 0}
                      className="rounded p-1 text-muted-foreground hover:bg-sage disabled:opacity-30"
                    >
                      <Icon name="up" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => reorder("process", step.id, "down")}
                      disabled={idx === process.length - 1}
                      className="rounded p-1 text-muted-foreground hover:bg-sage disabled:opacity-30"
                    >
                      <Icon name="down" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="p-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditing({ ...step })}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage hover:text-forest"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(step)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal
          open={true}
          onClose={() => setEditing(null)}
          title={editing.title ? `Edit Workflow Step: ${editing.title}` : "Add Workflow Step"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Stage Title <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="e.g. Requirement Understanding"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Description <span className="text-terracotta">*</span>
              </label>
              <textarea
                rows={3}
                className="input mt-1"
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                placeholder="Describe how Sinky coordinates this phase..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Stage</Btn>
            </div>
          </form>
        </Modal>
      )}

      <Confirm
        open={!!deleting}
        title="Delete Workflow Step?"
        message={`Are you sure you want to remove "${deleting?.title}"?`}
        confirmLabel="Delete Step"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

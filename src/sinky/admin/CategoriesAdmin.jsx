import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Modal, Confirm } from "../ui.jsx";

export function CategoriesAdmin() {
  const { data, upsert, remove, reorder, canDeleteCategory, notify } = useApp();
  const [editing, setEditing] = useState(null); // null or category object
  const [deleting, setDeleting] = useState(null); // null or category object
  const [blockedAlert, setBlockedAlert] = useState(null);

  const categories = [...(data.categories || [])].sort((a, b) => a.order - b.order);
  const products = data.products || [];

  const openNew = () => {
    setEditing({
      id: `cat-${Date.now().toString(36)}`,
      name: "",
      order: categories.length + 1,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.name.trim()) return;
    upsert("categories", editing, "category");
    notify(`Category "${editing.name}" saved.`);
    setEditing(null);
  };

  const attemptDelete = (c) => {
    const { allowed, count } = canDeleteCategory(c.id);
    if (!allowed) {
      setBlockedAlert({
        name: c.name,
        count,
      });
      return;
    }
    setDeleting(c);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    remove("categories", deleting.id, "category");
    notify(`Category "${deleting.name}" removed.`);
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Product Categories</h2>
          <p className="text-xs text-muted-foreground">
            Manage catalogue classifications, order, and safeguards.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Category
        </Btn>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-slate-50/70 text-ink/70">
            <tr>
              <th className="p-3.5 pl-4 font-semibold w-16">Order</th>
              <th className="p-3.5 font-semibold">Category Name</th>
              <th className="p-3.5 font-semibold">Assigned Products</th>
              <th className="p-3.5 text-center font-semibold w-28">Reorder</th>
              <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {categories.map((c, idx) => {
              const assignedCount = products.filter((p) => p.category === c.id).length;
              return (
                <tr key={c.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3.5 pl-4 font-mono font-bold text-forest">{idx + 1}</td>
                  <td className="p-3.5 font-medium text-sm text-ink">{c.name}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        assignedCount > 0 ? "bg-sage text-forest" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {assignedCount} {assignedCount === 1 ? "product" : "products"}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => reorder("categories", c.id, "up")}
                        disabled={idx === 0}
                        className="rounded p-1 text-muted-foreground hover:bg-sage hover:text-forest disabled:opacity-30"
                        title="Move Up"
                      >
                        <Icon name="up" className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => reorder("categories", c.id, "down")}
                        disabled={idx === categories.length - 1}
                        className="rounded p-1 text-muted-foreground hover:bg-sage hover:text-forest disabled:opacity-30"
                        title="Move Down"
                      >
                        <Icon name="down" className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditing({ ...c })}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage hover:text-forest"
                        title="Edit Category"
                      >
                        <Icon name="edit" className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => attemptDelete(c)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Delete Category"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Category Modal */}
      {editing && (
        <Modal
          open={true}
          onClose={() => setEditing(null)}
          title={editing.name ? `Edit Category: ${editing.name}` : "Create Category"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Category Name <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Artisanal Breads & Confectionery"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Category</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Safeguard Alert Modal (When products are still assigned) */}
      {blockedAlert && (
        <Modal
          open={true}
          onClose={() => setBlockedAlert(null)}
          title="Cannot Delete Category"
        >
          <div className="space-y-3">
            <p className="text-sm text-ink/80">
              The category <strong>"{blockedAlert.name}"</strong> cannot be deleted because{" "}
              <strong>{blockedAlert.count} product{blockedAlert.count > 1 ? "s are" : " is"}</strong> currently
              assigned to it.
            </p>
            <p className="text-xs text-muted-foreground">
              To delete this category, please first reassign or delete the associated products in the Products
              Management module.
            </p>
            <div className="mt-5 flex justify-end">
              <Btn onClick={() => setBlockedAlert(null)}>Understood</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Confirm
        open={!!deleting}
        title={`Delete Category "${deleting?.name}"?`}
        message="This category has no products assigned and can safely be deleted."
        confirmLabel="Delete Category"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

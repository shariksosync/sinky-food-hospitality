import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Modal, Confirm } from "../ui.jsx";

const ESSENTIAL_PATHS = ["/", "/admin-login", "/admin"];

export function NavigationAdmin() {
  const { data, upsert, remove, notify } = useApp();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [blockedNotice, setBlockedNotice] = useState(null);

  const nav = data.nav || [];

  const openNew = () => {
    setEditing({
      id: `n-${Date.now().toString(36)}`,
      label: "",
      path: "/",
      visible: true,
      dropdown: false,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.label.trim() || !editing.path.trim()) return;
    upsert("nav", editing, "navigation item");
    notify(`Menu link "${editing.label}" saved.`);
    setEditing(null);
  };

  const attemptDelete = (item) => {
    if (ESSENTIAL_PATHS.includes(item.path) || item.label.toLowerCase() === "home") {
      setBlockedNotice(`"${item.label}" is an essential system route and cannot be deleted.`);
      return;
    }
    setDeleting(item);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    remove("nav", deleting.id, "navigation item");
    notify(`Menu link "${deleting.label}" removed.`);
    setDeleting(null);
  };

  const toggleVisibility = (item) => {
    upsert("nav", { ...item, visible: !item.visible }, "navigation item");
    notify(`Menu item "${item.label}" ${!item.visible ? "shown" : "hidden"} in header.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Navigation Management</h2>
          <p className="text-xs text-muted-foreground">
            Configure header menu links, dropdown flags, and route destinations.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Menu Item
        </Btn>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-slate-50/70 text-ink/70">
            <tr>
              <th className="p-3.5 pl-4 font-semibold">Menu Label</th>
              <th className="p-3.5 font-semibold">Destination URL</th>
              <th className="p-3.5 font-semibold">Dropdown Menu</th>
              <th className="p-3.5 font-semibold text-center">Header Display</th>
              <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {nav.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition">
                <td className="p-3.5 pl-4 font-bold text-forest">{item.label}</td>
                <td className="p-3.5 font-mono text-muted-foreground">{item.path}</td>
                <td className="p-3.5">
                  {item.dropdown ? (
                    <span className="rounded-full bg-wheat/30 px-2.5 py-0.5 text-[10px] font-semibold text-amber-900">
                      Products Dropdown
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => toggleVisibility(item)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                      item.visible ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.visible ? "Visible" : "Hidden"}
                  </button>
                </td>
                <td className="p-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditing({ ...item })}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage hover:text-forest"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => attemptDelete(item)}
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
          title={editing.label ? `Edit Menu Item: ${editing.label}` : "Add Menu Item"}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Display Label <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1"
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                placeholder="e.g. Products"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Target Route / URL <span className="text-terracotta">*</span>
              </label>
              <input
                className="input mt-1 font-mono text-xs"
                value={editing.path}
                onChange={(e) => setEditing({ ...editing, path: e.target.value })}
                placeholder="/products"
                required
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.visible}
                  onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
                  className="h-4 w-4 rounded text-forest"
                />
                <span className="text-xs font-medium text-ink">Show in Header Bar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.dropdown}
                  onChange={(e) => setEditing({ ...editing, dropdown: e.target.checked })}
                  className="h-4 w-4 rounded text-forest"
                />
                <span className="text-xs font-medium text-ink">Enable Subcategories Dropdown</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Menu Item</Btn>
            </div>
          </form>
        </Modal>
      )}

      {blockedNotice && (
        <Modal open={true} onClose={() => setBlockedNotice(null)} title="Essential Route Protection">
          <p className="text-sm text-ink/80">{blockedNotice}</p>
          <div className="mt-5 flex justify-end">
            <Btn onClick={() => setBlockedNotice(null)}>Understood</Btn>
          </div>
        </Modal>
      )}

      <Confirm
        open={!!deleting}
        title="Delete Menu Link?"
        message={`Are you sure you want to delete "${deleting?.label}"?`}
        confirmLabel="Delete Link"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

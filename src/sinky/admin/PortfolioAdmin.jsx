import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Img, Badge, Modal, Confirm } from "../ui.jsx";

const PORTFOLIO_CATEGORIES = [
  "Food Product Portfolio",
  "Beverage Solutions",
  "Hospitality Projects",
  "Customized Culinary Solutions",
  "Packaging & Presentation",
];

const STATUS_OPTIONS = ["Concept", "Sample", "In Development", "Completed"];

export function PortfolioAdmin() {
  const { data, upsert, remove, notify } = useApp();
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const projects = data.projects || [];

  const filtered = projects.filter((p) => {
    const matchCat = catFilter === "all" || p.category === catFilter;
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      (p.summary || "").toLowerCase().includes(q.toLowerCase()) ||
      (p.tags || "").toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  const openNew = () => {
    setEditing({
      id: `pr-${Date.now().toString(36)}`,
      title: "",
      category: PORTFOLIO_CATEGORIES[0],
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      summary: "",
      description: "",
      tags: "Concept, Food, Packaging",
      status: "Concept",
      featured: false,
      published: true,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editing.title.trim() || !editing.summary.trim()) return;
    upsert("projects", editing, "portfolio project");
    notify(`Project "${editing.title}" saved.`);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("projects", deleting.id, "portfolio project");
    notify(`Project "${deleting.title}" deleted.`);
    setDeleting(null);
  };

  const toggleFeatured = (p) => {
    upsert("projects", { ...p, featured: !p.featured }, "project");
    notify(`Project "${p.title}" ${!p.featured ? "featured" : "unfeatured"}.`);
  };

  const togglePublished = (p) => {
    upsert("projects", { ...p, published: !p.published }, "project");
    notify(`Project "${p.title}" ${!p.published ? "published" : "hidden"}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Portfolio & Projects</h2>
          <p className="text-xs text-muted-foreground">
            Manage illustrative case studies, hospitality concepts, and beverage menus.
          </p>
        </div>
        <Btn onClick={openNew} className="btn-sm">
          <Icon name="plus" className="h-4 w-4" />
          Add Project
        </Btn>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCatFilter("all")}
            className={`chip text-xs ${catFilter === "all" ? "chip-on" : ""}`}
          >
            All Projects ({projects.length})
          </button>
          {PORTFOLIO_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`chip text-xs ${catFilter === c ? "chip-on" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects..."
            className="input pl-9 text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-slate-50/70 text-ink/70">
            <tr>
              <th className="p-3.5 pl-4 font-semibold">Project Title</th>
              <th className="p-3.5 font-semibold">Category</th>
              <th className="p-3.5 font-semibold">Tags</th>
              <th className="p-3.5 font-semibold">Status</th>
              <th className="p-3.5 text-center font-semibold">Featured</th>
              <th className="p-3.5 text-center font-semibold">Visibility</th>
              <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition">
                <td className="p-3.5 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-line bg-sage">
                      <Img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-bold text-forest">{p.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">{p.summary}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-ink/80">{p.category}</td>
                <td className="p-3.5 text-muted-foreground font-mono text-[10px]">{p.tags || "—"}</td>
                <td className="p-3.5">
                  <Badge tone="badge-wheat">{p.status}</Badge>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => toggleFeatured(p)}
                    className={`inline-flex items-center justify-center rounded-lg p-1.5 transition ${
                      p.featured ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-slate-500"
                    }`}
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
                      title="Edit"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(p)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
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
          title={editing.title ? `Edit Project: ${editing.title}` : "Add Project"}
          wide
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Project Title <span className="text-terracotta">*</span>
                </label>
                <input
                  className="input mt-1"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Boutique Café Beverage Menu"
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
                  {PORTFOLIO_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Status Label
                </label>
                <select
                  className="input mt-1"
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Project Image URL
                </label>
                <input
                  className="input mt-1"
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Project Summary <span className="text-terracotta">*</span>
                </label>
                <input
                  className="input mt-1"
                  value={editing.summary}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  placeholder="Short concept explanation"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  className="input mt-1"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Detailed engagement background"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                  Tags (comma separated)
                </label>
                <input
                  className="input mt-1 font-mono text-xs"
                  value={editing.tags}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                  placeholder="Cold brew, Events, Buffet"
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
                  <span className="text-xs font-medium text-ink">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="h-4 w-4 rounded text-forest"
                  />
                  <span className="text-xs font-medium text-ink">Published (Visible on site)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
              <Btn type="submit">Save Project</Btn>
            </div>
          </form>
        </Modal>
      )}

      <Confirm
        open={!!deleting}
        title={`Delete "${deleting?.title}"?`}
        message="Are you sure you want to delete this portfolio project?"
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

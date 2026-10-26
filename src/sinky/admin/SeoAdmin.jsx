import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon } from "../ui.jsx";

export function SeoAdmin() {
  const { data, setSection, notify } = useApp();
  const [list, setList] = useState([...(data.seo || [])]);
  const [activeRoute, setActiveRoute] = useState(list[0]?.id || "/");
  const [dirty, setDirty] = useState(false);

  const current = list.find((s) => s.id === activeRoute) || list[0];

  const updateField = (field, val) => {
    setList((prev) =>
      prev.map((item) => (item.id === activeRoute ? { ...item, [field]: val } : item))
    );
    setDirty(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSection("seo", list, "Updated SEO Metadata");
    setDirty(false);
    notify(`SEO metadata updated for ${current.page}.`);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">SEO & Page Metadata</h2>
          <p className="text-xs text-muted-foreground">
            Configure client-side page titles, meta descriptions, search keywords, and OpenGraph sharing tags.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-amber-700 font-medium">● Unsaved changes</span>}
          <Btn type="submit" disabled={!dirty} className="btn-sm">
            <Icon name="check" className="h-4 w-4" />
            Save Metadata
          </Btn>
        </div>
      </div>

      {/* Route Switcher Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-line pb-3">
        {list.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveRoute(item.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeRoute === item.id
                ? "bg-forest text-cream shadow-xs"
                : "bg-card text-ink/75 hover:bg-sage border border-line"
            }`}
          >
            {item.page} <span className="opacity-60 text-[10px]">({item.id})</span>
          </button>
        ))}
      </div>

      {/* SERP Search Result Simulator */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
          <Icon name="search" className="h-3.5 w-3.5 text-forest" />
          Google Search Result Preview
        </p>
        <div className="rounded-xl border border-line/80 bg-slate-50/70 p-4 font-sans max-w-xl">
          <p className="text-xs text-slate-600 truncate">
            https://sinkyindustries.com{current.id === "/" ? "" : current.id}
          </p>
          <h3 className="text-base text-blue-800 font-medium hover:underline cursor-pointer truncate mt-0.5">
            {current.title || "Sinky Industries Private Limited"}
          </h3>
          <p className="text-xs text-slate-700 line-clamp-2 mt-1 leading-relaxed">
            {current.description ||
              "Sinky Industries operates in the field of food and beverage service activities, premium food products, and customized hospitality supply."}
          </p>
        </div>
      </div>

      {/* Editor Fields */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">
          Metadata for {current.page} ({current.id})
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Page Document Title
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {(current.title || "").length} / 65 recommended
              </span>
            </div>
            <input
              className="input mt-1"
              value={current.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Products — Sinky Industries"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Meta Description
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {(current.description || "").length} / 160 recommended
              </span>
            </div>
            <textarea
              rows={3}
              className="input mt-1"
              value={current.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Concise summary for search engine snippet..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Keywords (comma-separated)
            </label>
            <input
              className="input mt-1 font-mono text-xs"
              value={current.keywords || ""}
              onChange={(e) => updateField("keywords", e.target.value)}
              placeholder="food manufacturing, packaged beverages, hospitality supply, Mumbai"
            />
          </div>

          <div className="border-t border-line pt-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Social Media OpenGraph Sharing (Optional)
            </h4>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                OpenGraph Title
              </label>
              <input
                className="input mt-1"
                value={current.ogTitle || ""}
                onChange={(e) => updateField("ogTitle", e.target.value)}
                placeholder="Defaults to Page Title if left empty"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                OpenGraph Description
              </label>
              <textarea
                rows={2}
                className="input mt-1"
                value={current.ogDescription || ""}
                onChange={(e) => updateField("ogDescription", e.target.value)}
                placeholder="Defaults to Meta Description if left empty"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                Social Sharing Banner Image URL
              </label>
              <input
                className="input mt-1"
                value={current.image || ""}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-8">
        <Btn type="submit" disabled={!dirty}>
          Save All SEO Changes
        </Btn>
      </div>
    </form>
  );
}

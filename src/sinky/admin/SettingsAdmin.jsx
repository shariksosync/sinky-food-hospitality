import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Img, Confirm } from "../ui.jsx";

const BRAND_PALETTE = [
  { name: "Forest Green", hex: "#174C3C", role: "Primary brand, headings, navigation" },
  { name: "Deep Green", hex: "#10382D", role: "Footer & hero veil backgrounds" },
  { name: "Warm Cream", hex: "#FFF8EE", role: "Primary website background" },
  { name: "Terracotta", hex: "#C96F45", role: "Highlights & CTA accent buttons" },
  { name: "Golden Wheat", hex: "#D8B56D", role: "Quality badges & subtle accents" },
  { name: "Charcoal Ink", hex: "#292D29", role: "Readable body typography" },
  { name: "Soft Sage", hex: "#E7EEE5", role: "Card backgrounds & filter chips" },
  { name: "Light Border", hex: "#E8E3DA", role: "Subtle card & section dividers" },
];

export function SettingsAdmin() {
  const { data, setSection, reset, notify } = useApp();
  const [s, setS] = useState({ ...data.settings });
  const [dirty, setDirty] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (k) => (e) => {
    setS((prev) => ({ ...prev, [k]: e.target.value }));
    setDirty(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSection("settings", s, "Updated Website Settings");
    setDirty(false);
    notify("Website settings saved successfully.");
  };

  const handleReset = () => {
    reset();
    setConfirmReset(false);
    notify("All website data restored to initial demo state.");
    setS({ ...data.settings });
    setDirty(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Website Settings</h2>
          <p className="text-xs text-muted-foreground">
            Configure branding wordmark, announcements, default fallback media, and demo reset.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-amber-700 font-medium">● Unsaved changes</span>}
          <Btn type="submit" disabled={!dirty} className="btn-sm">
            <Icon name="check" className="h-4 w-4" />
            Save Settings
          </Btn>
        </div>
      </div>

      {/* Wordmark & Brand Identity */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Wordmark & Brand Text</h3>
        <p className="text-xs text-muted-foreground">
          Tasteful editorial wordmark displayed in the header and footer navigation.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Top Line (Primary Brand Mark)
            </label>
            <input
              className="input mt-1 tracking-widest font-serif font-bold"
              value={s.wordmarkTop}
              onChange={set("wordmarkTop")}
              placeholder="SINKY INDUSTRIES"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Subtitle Line (Secondary Legal Form)
            </label>
            <input
              className="input mt-1 tracking-widest text-xs font-mono"
              value={s.wordmarkSub}
              onChange={set("wordmarkSub")}
              placeholder="PRIVATE LIMITED"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Site Title
            </label>
            <input className="input mt-1" value={s.siteName} onChange={set("siteName")} />
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-forest">Top Announcement Bar</h3>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-forest">
            <input
              type="checkbox"
              checked={s.showAnnouncement}
              onChange={(e) => {
                setS({ ...s, showAnnouncement: e.target.checked });
                setDirty(true);
              }}
              className="h-4 w-4 rounded text-forest"
            />
            <span>Enable Announcement Banner</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
            Announcement Message
          </label>
          <input
            className="input mt-1 text-xs"
            value={s.announcement}
            onChange={set("announcement")}
            placeholder="Demo website — catalogue items and projects shown are illustrative samples."
          />
        </div>
      </div>

      {/* Brand Color System (Inspection / Reference) */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Brand Color System</h3>
        <p className="text-xs text-muted-foreground">
          Defined according to Sinky Industries specification. Cohesive food manufacturing & hospitality palette.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND_PALETTE.map((color) => (
            <div key={color.hex} className="rounded-xl border border-line p-3 flex items-center gap-3">
              <span
                className="h-10 w-10 shrink-0 rounded-lg border border-black/10 shadow-xs"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink truncate">{color.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{color.hex}</p>
                <p className="text-[9px] text-ink/60 truncate">{color.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Default Media & Demo Messages */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Fallback Media & Demo Notices</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Default Banner Fallback Image URL
            </label>
            <input className="input mt-1" value={s.defaultBanner} onChange={set("defaultBanner")} />
            {s.defaultBanner && (
              <div className="mt-2 h-24 w-48 overflow-hidden rounded-xl border border-line">
                <Img src={s.defaultBanner} alt="Default banner preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Demo Notice Disclaimer
            </label>
            <textarea
              rows={2}
              className="input mt-1 text-xs"
              value={s.demoInfo}
              onChange={set("demoInfo")}
            />
          </div>
        </div>
      </div>

      {/* Destructive Factory Reset */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-destructive font-bold text-sm">
          <Icon name="refresh" className="h-4 w-4" />
          <span>Reset All Website Demo Data</span>
        </div>
        <p className="text-xs text-ink/75 max-w-2xl">
          Restores all products, categories, portfolio entries, enquiries, process stages, and content
          back to the initial sample dataset. Any modifications saved in your browser will be overwritten.
        </p>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="rounded-xl border border-destructive bg-destructive px-4 py-2 text-xs font-semibold text-white transition hover:bg-destructive/90"
        >
          Reset to Default Demo Data
        </button>
      </div>

      <div className="flex justify-end pb-8">
        <Btn type="submit" disabled={!dirty}>
          Save Settings
        </Btn>
      </div>

      <Confirm
        open={confirmReset}
        title="Reset All Website Demo Data?"
        message="Are you sure you want to restore the entire website and all 15 modules back to factory initial data? This cannot be undone."
        confirmLabel="Confirm Full Reset"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </form>
  );
}

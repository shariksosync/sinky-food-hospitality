import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon } from "../ui.jsx";

export function CompanyProfileAdmin() {
  const { data, setSection, notify } = useApp();
  const [c, setC] = useState({ ...data.company });
  const [dirty, setDirty] = useState(false);

  const set = (k) => (e) => {
    setC((prev) => ({ ...prev, [k]: e.target.value }));
    setDirty(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSection("company", c, "Updated Company Profile");
    setDirty(false);
    notify("Company profile updated successfully.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Company Profile</h2>
          <p className="text-xs text-muted-foreground">
            Manage legal name, contact details, positioning, and narrative.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-amber-700 font-medium">● Unsaved changes</span>}
          <Btn type="submit" disabled={!dirty} className="btn-sm">
            <Icon name="check" className="h-4 w-4" />
            Save Profile Changes
          </Btn>
        </div>
      </div>

      {/* Basic Company Identity */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">General Identity</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Registered Company Name
            </label>
            <input className="input mt-1" value={c.name} onChange={set("name")} required />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Brand Positioning Statement
            </label>
            <input className="input mt-1" value={c.positioning} onChange={set("positioning")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Business Description
            </label>
            <textarea rows={3} className="input mt-1" value={c.description} onChange={set("description")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Contact Phone
            </label>
            <input className="input mt-1" value={c.phone} onChange={set("phone")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Contact Email
            </label>
            <input className="input mt-1" value={c.email} onChange={set("email")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Official Business Address
            </label>
            <textarea rows={2} className="input mt-1" value={c.address} onChange={set("address")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Directors / Promoters Summary
            </label>
            <input className="input mt-1" value={c.directors} onChange={set("directors")} />
          </div>
        </div>
      </div>

      {/* Strategic Vision & Values */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Mission, Vision & Core Values</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Mission Statement
            </label>
            <textarea rows={2} className="input mt-1" value={c.mission} onChange={set("mission")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Vision Statement
            </label>
            <textarea rows={2} className="input mt-1" value={c.vision} onChange={set("vision")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Core Values (One per line)
            </label>
            <textarea rows={4} className="input mt-1 font-mono text-xs" value={c.values} onChange={set("values")} />
            <p className="mt-1 text-[11px] text-muted-foreground">Each line represents a distinct core value pill on the About page.</p>
          </div>
        </div>
      </div>

      {/* About Us Page Narrative Blocks */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">About Page Narrative</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Company Overview Narrative
            </label>
            <textarea rows={3} className="input mt-1" value={c.overview} onChange={set("overview")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Business Philosophy
            </label>
            <textarea rows={3} className="input mt-1" value={c.philosophy} onChange={set("philosophy")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Our Approach to Quality
            </label>
            <textarea rows={3} className="input mt-1" value={c.qualityApproach} onChange={set("qualityApproach")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Hospitality & Commercial Supply Focus
            </label>
            <textarea rows={3} className="input mt-1" value={c.hospitalityFocus} onChange={set("hospitalityFocus")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-8">
        <Btn type="submit" disabled={!dirty}>
          Save All Changes
        </Btn>
      </div>
    </form>
  );
}

import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Img } from "../ui.jsx";

export function HomepageAdmin() {
  const { data, setSection, notify } = useApp();
  const [h, setH] = useState({ ...data.home });
  const [dirty, setDirty] = useState(false);

  const set = (k) => (e) => {
    setH((prev) => ({ ...prev, [k]: e.target.value }));
    setDirty(true);
  };

  const setCap = (index, field, value) => {
    const nextCaps = [...h.capabilities];
    nextCaps[index] = { ...nextCaps[index], [field]: value };
    setH((prev) => ({ ...prev, capabilities: nextCaps }));
    setDirty(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSection("home", h, "Updated Homepage Content");
    setDirty(false);
    notify("Homepage content saved.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Homepage Content</h2>
          <p className="text-xs text-muted-foreground">
            Edit hero messaging, banner imagery, capabilities, and trust labels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-amber-700 font-medium">● Unsaved changes</span>}
          <Btn type="submit" disabled={!dirty} className="btn-sm">
            <Icon name="check" className="h-4 w-4" />
            Save Homepage
          </Btn>
        </div>
      </div>

      {/* Hero Section */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Hero Banner Section</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Eyebrow Label
            </label>
            <input className="input mt-1" value={h.eyebrow} onChange={set("eyebrow")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Hero Headline
            </label>
            <input className="input mt-1" value={h.heroHeading} onChange={set("heroHeading")} required />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Hero Supporting Text
            </label>
            <textarea rows={2} className="input mt-1" value={h.heroText} onChange={set("heroText")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Hero Banner Image URL
            </label>
            <input className="input mt-1" value={h.heroImage} onChange={set("heroImage")} />
            {h.heroImage && (
              <div className="mt-2 h-36 w-full max-w-md overflow-hidden rounded-xl border border-line">
                <Img src={h.heroImage} alt="Hero preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Primary CTA Label
            </label>
            <input className="input mt-1" value={h.cta1Label} onChange={set("cta1Label")} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Primary CTA Link Destination
            </label>
            <input className="input mt-1" value={h.cta1Link} onChange={set("cta1Link")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Secondary CTA Label
            </label>
            <input className="input mt-1" value={h.cta2Label} onChange={set("cta2Label")} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Secondary CTA Link Destination
            </label>
            <input className="input mt-1" value={h.cta2Link} onChange={set("cta2Link")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Trust Badges (One per line)
            </label>
            <textarea rows={3} className="input mt-1 font-mono text-xs" value={h.trust} onChange={set("trust")} />
            <p className="mt-1 text-[11px] text-muted-foreground">Appears as pill badges directly below hero CTA buttons.</p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Company Intro Section</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Intro Headline
            </label>
            <input className="input mt-1" value={h.introHeading} onChange={set("introHeading")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Intro Paragraph
            </label>
            <textarea rows={3} className="input mt-1" value={h.introText} onChange={set("introText")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Intro Image URL
            </label>
            <input className="input mt-1" value={h.introImage} onChange={set("introImage")} />
            {h.introImage && (
              <div className="mt-2 h-32 w-48 overflow-hidden rounded-xl border border-line">
                <Img src={h.introImage} alt="Intro preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Capabilities Cards */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Capabilities Cards (4 Elements)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(h.capabilities || []).map((cap, i) => (
            <div key={cap.id || i} className="rounded-xl border border-line bg-slate-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest">Capability #{i + 1}</span>
                <span className="text-xs text-muted-foreground font-mono">Icon: {cap.icon}</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink/75">Title</label>
                <input
                  className="input mt-1 text-sm"
                  value={cap.title}
                  onChange={(e) => setCap(i, "title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-ink/75">Description</label>
                <textarea
                  rows={2}
                  className="input mt-1 text-sm"
                  value={cap.text}
                  onChange={(e) => setCap(i, "text", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner & Previews */}
      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Banners & Section Headings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Consultation Banner Heading
            </label>
            <input className="input mt-1" value={h.bannerHeading} onChange={set("bannerHeading")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Consultation Banner Text
            </label>
            <input className="input mt-1" value={h.bannerText} onChange={set("bannerText")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Contact Preview Heading
            </label>
            <input className="input mt-1" value={h.contactHeading} onChange={set("contactHeading")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-8">
        <Btn type="submit" disabled={!dirty}>
          Save Homepage
        </Btn>
      </div>
    </form>
  );
}

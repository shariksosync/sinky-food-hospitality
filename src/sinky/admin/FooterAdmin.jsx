import { useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon } from "../ui.jsx";

export function FooterAdmin() {
  const { data, setSection, notify } = useApp();
  const [f, setF] = useState({ ...data.footer });
  const [dirty, setDirty] = useState(false);

  const set = (k) => (e) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    setDirty(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSection("footer", f, "Updated Footer Configuration");
    setDirty(false);
    notify("Footer settings saved successfully.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Footer Management</h2>
          <p className="text-xs text-muted-foreground">
            Configure dark green footer column content, copyright statement, social media, and admin link.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-amber-700 font-medium">● Unsaved changes</span>}
          <Btn type="submit" disabled={!dirty} className="btn-sm">
            <Icon name="check" className="h-4 w-4" />
            Save Footer
          </Btn>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Brand & Legal Text</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Footer Description (Column 1)
            </label>
            <textarea
              rows={3}
              className="input mt-1"
              value={f.description}
              onChange={set("description")}
              placeholder="Short statement summarizing Sinky Industries..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Copyright Notice
            </label>
            <input
              className="input mt-1"
              value={f.copyright}
              onChange={set("copyright")}
              placeholder="Sinky Industries Private Limited. All rights reserved."
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Social Media Profiles (Optional)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Instagram Profile URL
            </label>
            <input
              className="input mt-1 text-xs font-mono"
              value={f.instagram || ""}
              onChange={set("instagram")}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              Facebook Page URL
            </label>
            <input
              className="input mt-1 text-xs font-mono"
              value={f.facebook || ""}
              onChange={set("facebook")}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
              LinkedIn Profile URL
            </label>
            <input
              className="input mt-1 text-xs font-mono"
              value={f.linkedin || ""}
              onChange={set("linkedin")}
              placeholder="https://linkedin.com/company/..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-forest">Admin Access Link</h3>
        <div className="max-w-md">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
            Admin Link Anchor Label
          </label>
          <input
            className="input mt-1"
            value={f.adminLabel || "Admin Login"}
            onChange={set("adminLabel")}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Per system requirements, this link always points to <code>/admin-login</code> in the bottom sub-footer.
          </p>
        </div>
      </div>

      <div className="flex justify-end pb-8">
        <Btn type="submit" disabled={!dirty}>
          Save Footer Settings
        </Btn>
      </div>
    </form>
  );
}

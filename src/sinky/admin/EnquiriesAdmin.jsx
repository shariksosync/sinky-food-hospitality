import { useMemo, useState } from "react";
import { useApp } from "../store.jsx";
import { Btn, Icon, Badge, Modal, Confirm } from "../ui.jsx";

const ENQUIRY_STATUSES = ["New", "In Progress", "Contacted", "Completed", "Archived"];

const statusBadgeTone = {
  New: "badge-terra",
  "In Progress": "badge-wheat",
  Contacted: "badge-green",
  Completed: "badge-green",
  Archived: "badge-gray",
};

export function EnquiriesAdmin() {
  const { data, patch, remove, notify } = useApp();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [viewing, setViewing] = useState(null); // enquiry object for detail modal
  const [deleting, setDeleting] = useState(null); // enquiry object to delete

  const enquiries = data.enquiries || [];

  const categories = useMemo(() => {
    return Array.from(new Set(enquiries.map((e) => e.category).filter(Boolean)));
  }, [enquiries]);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      const matchCat = catFilter === "all" || e.category === catFilter;
      const matchQ =
        !q ||
        (e.id || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.name || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.company || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.email || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.subject || "").toLowerCase().includes(q.toLowerCase()) ||
        (e.message || "").toLowerCase().includes(q.toLowerCase());
      return matchStatus && matchCat && matchQ;
    });
  }, [enquiries, statusFilter, catFilter, q]);

  const updateStatus = (id, newStatus) => {
    patch("enquiries", id, { status: newStatus });
    notify(`Enquiry status updated to ${newStatus}.`);
    if (viewing && viewing.id === id) {
      setViewing({ ...viewing, status: newStatus });
    }
  };

  const handleDelete = () => {
    if (!deleting) return;
    remove("enquiries", deleting.id, "enquiry");
    notify(`Enquiry ${deleting.id} deleted.`);
    setDeleting(null);
    if (viewing && viewing.id === deleting.id) {
      setViewing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest">Enquiry Management</h2>
          <p className="text-xs text-muted-foreground">
            Review and track customer requests submitted through public forms. Stored in browser.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`chip text-xs ${statusFilter === "all" ? "chip-on" : ""}`}
          >
            All ({enquiries.length})
          </button>
          {ENQUIRY_STATUSES.map((st) => {
            const count = enquiries.filter((e) => e.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`chip text-xs ${statusFilter === st ? "chip-on" : ""}`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {categories.length > 1 && (
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="input text-xs sm:w-44"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full sm:w-60">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search enquiries..."
              className="input pl-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-line bg-slate-50/70 text-ink/70">
            <tr>
              <th className="p-3.5 pl-4 font-semibold">ID & Date</th>
              <th className="p-3.5 font-semibold">Contact Person</th>
              <th className="p-3.5 font-semibold">Category</th>
              <th className="p-3.5 font-semibold">Subject & Message</th>
              <th className="p-3.5 font-semibold">Status</th>
              <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {filtered.map((enq) => (
              <tr key={enq.id} className="hover:bg-slate-50/50 transition">
                <td className="p-3.5 pl-4 font-mono">
                  <div className="font-bold text-forest">{enq.id}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(enq.date).toLocaleDateString()}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-ink">{enq.name}</div>
                  {enq.company && <div className="text-[11px] text-ink/75">{enq.company}</div>}
                  <div className="text-[11px] text-muted-foreground">
                    {enq.email && enq.email !== "Not provided" ? (
                      <a href={`mailto:${enq.email}`} className="hover:text-forest hover:underline">
                        {enq.email}
                      </a>
                    ) : (
                      <a href={`tel:${(enq.phone || "").replace(/\s/g, "")}`} className="hover:text-forest hover:underline">
                        {enq.phone}
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="rounded-full bg-sage px-2 py-0.5 text-[10px] font-semibold text-forest">
                    {enq.category}
                  </span>
                </td>
                <td className="p-3.5 max-w-xs">
                  <div className="font-medium text-ink truncate">{enq.subject}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2">{enq.message}</div>
                </td>
                <td className="p-3.5">
                  <select
                    value={enq.status}
                    onChange={(e) => updateStatus(enq.id, e.target.value)}
                    className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-forest"
                  >
                    {ENQUIRY_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setViewing(enq)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage hover:text-forest"
                      title="View Details"
                    >
                      <Icon name="eye" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(enq)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  No enquiries match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enquiry Details Modal */}
      {viewing && (
        <Modal
          open={true}
          onClose={() => setViewing(null)}
          title={`Enquiry: ${viewing.id}`}
          wide
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="text-xs text-muted-foreground">Status:</span>{" "}
                <Badge tone={statusBadgeTone[viewing.status]}>{viewing.status}</Badge>
                {viewing.sample && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-muted-foreground">
                    Demo Seed
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {new Date(viewing.date).toLocaleString()}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 rounded-xl bg-slate-50/80 p-4 border border-line">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Person
                </span>
                <span className="font-serif text-base font-bold text-forest">{viewing.name}</span>
                {viewing.company && <p className="text-xs text-ink/75 font-medium">{viewing.company}</p>}
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </span>
                <span className="text-xs font-semibold text-ink">{viewing.category}</span>
                {viewing.product && (
                  <p className="text-xs text-terracotta">Product: {viewing.product}</p>
                )}
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </span>
                <a
                  href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-forest hover:underline font-medium"
                >
                  <Icon name="mail" className="h-3.5 w-3.5 text-terracotta" />
                  {viewing.email}
                </a>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </span>
                <a
                  href={`tel:${viewing.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-forest hover:underline font-medium"
                >
                  <Icon name="phone" className="h-3.5 w-3.5 text-terracotta" />
                  {viewing.phone}
                </a>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-ink/75 mb-1">
                Subject
              </span>
              <p className="font-serif text-lg text-forest">{viewing.subject}</p>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-ink/75 mb-1">
                Message Content
              </span>
              <div className="whitespace-pre-wrap rounded-xl border border-line bg-card p-4 text-xs leading-relaxed text-ink/90 font-sans">
                {viewing.message}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-line pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Update Status:</span>
                <select
                  value={viewing.status}
                  onChange={(e) => updateStatus(viewing.id, e.target.value)}
                  className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-semibold"
                >
                  {ENQUIRY_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Btn
                  variant="outline"
                  className="btn-sm"
                  onClick={() => window.open(`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`)}
                >
                  <Icon name="mail" className="h-3.5 w-3.5" />
                  Compose Email
                </Btn>
                <Btn variant="ghost" className="btn-sm" onClick={() => setViewing(null)}>
                  Close
                </Btn>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <Confirm
        open={!!deleting}
        title={`Delete Enquiry ${deleting?.id}?`}
        message={`Are you sure you want to delete the enquiry from ${deleting?.name}?`}
        confirmLabel="Delete Enquiry"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

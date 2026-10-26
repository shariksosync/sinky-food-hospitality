import { useApp, useRouter, catName } from "../store.jsx";
import { Icon, Badge, Btn } from "../ui.jsx";

export function AdminDashboard() {
  const { data } = useApp();
  const { navigate } = useRouter();

  const products = data.products || [];
  const publishedProducts = products.filter((p) => p.published).length;
  const projects = data.projects || [];
  const publishedProjects = projects.filter((p) => p.published).length;
  const enquiries = data.enquiries || [];
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const testimonials = data.testimonials || [];
  const approvedTestimonials = testimonials.filter((t) => t.approved).length;
  const activity = data.activity || [];

  const statCards = [
    {
      title: "Total Products",
      value: products.length,
      sub: `${publishedProducts} active on site`,
      icon: "box",
      color: "text-forest",
      bg: "bg-sage/50",
      link: "/admin/products",
    },
    {
      title: "Portfolio Projects",
      value: projects.length,
      sub: `${publishedProjects} published concepts`,
      icon: "file",
      color: "text-terracotta",
      bg: "bg-amber-50",
      link: "/admin/portfolio",
    },
    {
      title: "Business Enquiries",
      value: enquiries.length,
      sub: `${newEnquiries} pending review`,
      icon: "inbox",
      color: newEnquiries > 0 ? "text-amber-700" : "text-forest",
      bg: newEnquiries > 0 ? "bg-amber-100/70" : "bg-sage/50",
      badge: newEnquiries > 0 ? `${newEnquiries} NEW` : null,
      link: "/admin/enquiries",
    },
    {
      title: "Testimonials",
      value: testimonials.length,
      sub: `${approvedTestimonials} live on website`,
      icon: "star",
      color: "text-wheat",
      bg: "bg-amber-50/50",
      link: "/admin/testimonials",
    },
    {
      title: "Product Categories",
      value: (data.categories || []).length,
      sub: "Organizing catalogue",
      icon: "tag",
      color: "text-forest-deep",
      bg: "bg-emerald-50",
      link: "/admin/categories",
    },
    {
      title: "Workflow Steps",
      value: (data.process || []).length,
      sub: "Quality & Process stages",
      icon: "check",
      color: "text-forest",
      bg: "bg-slate-100",
      link: "/admin/quality-process",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Demo Banner Notice */}
      <div className="rounded-2xl border border-line bg-gradient-to-r from-cream via-white to-sage p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest text-cream">
              <Icon name="tag" className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-serif text-base font-bold text-forest">
                Frontend Demonstration Control Center
              </h2>
              <p className="mt-0.5 text-xs text-ink/75">
                {data.settings.demoInfo ||
                  "All modifications are saved in your browser's local storage and reflect immediately across the public website."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn to="/" variant="outline" className="btn-sm">
              <Icon name="eye" className="h-3.5 w-3.5" />
              View Public Site
            </Btn>
            <Btn to="/admin/products" className="btn-sm">
              <Icon name="plus" className="h-3.5 w-3.5" />
              Add Product
            </Btn>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.link)}
            className="card cursor-pointer p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
              {card.badge && (
                <span className="rounded-full bg-terracotta px-2.5 py-0.5 text-[10px] font-bold text-cream">
                  {card.badge}
                </span>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</h3>
              <p className="mt-1 font-serif text-3xl font-bold text-forest">{card.value}</p>
              <p className="mt-1 text-xs text-ink/70">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-2xl border border-line bg-card p-6">
        <h3 className="font-serif text-lg font-bold text-forest">Quick Actions</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-3 rounded-xl border border-line p-3 text-left transition hover:bg-sage"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
              <Icon name="plus" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-forest">Manage Catalogue</p>
              <p className="text-[11px] text-muted-foreground">Add or edit products</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/enquiries")}
            className="flex items-center gap-3 rounded-xl border border-line p-3 text-left transition hover:bg-sage"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Icon name="inbox" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-forest">Customer Enquiries</p>
              <p className="text-[11px] text-muted-foreground">{newEnquiries} need attention</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/homepage")}
            className="flex items-center gap-3 rounded-xl border border-line p-3 text-left transition hover:bg-sage"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
              <Icon name="edit" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-forest">Edit Homepage</p>
              <p className="text-[11px] text-muted-foreground">Banners, copy & CTAs</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/settings")}
            className="flex items-center gap-3 rounded-xl border border-line p-3 text-left transition hover:bg-sage"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
              <Icon name="settings" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-forest">Website Settings</p>
              <p className="text-[11px] text-muted-foreground">Wordmark & announcements</p>
            </div>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Enquiries & Activity Feed */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Enquiries Preview */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest">Recent Enquiries</h3>
              <p className="text-xs text-muted-foreground">Submissions saved locally</p>
            </div>
            <button
              onClick={() => navigate("/admin/enquiries")}
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              View All ({enquiries.length})
            </button>
          </div>

          <div className="mt-4 divide-y divide-line">
            {enquiries.slice(0, 4).map((enq) => (
              <div key={enq.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-forest truncate">{enq.name}</p>
                    {enq.company && <span className="text-[10px] text-muted-foreground truncate">({enq.company})</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-ink/75 truncate">{enq.subject}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{new Date(enq.date).toLocaleDateString()}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge tone={enq.status === "New" ? "badge-terra" : "badge-green"}>{enq.status}</Badge>
                </div>
              </div>
            ))}
            {enquiries.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">No enquiries received yet.</p>
            )}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest">Recent Activity</h3>
              <p className="text-xs text-muted-foreground">Audit log of modifications</p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {activity.length} entries
            </span>
          </div>

          <div className="mt-4 max-h-[300px] overflow-y-auto space-y-3 pr-1">
            {activity.slice(0, 10).map((act) => (
              <div key={act.id} className="flex items-start gap-3 rounded-lg border border-line/60 bg-slate-50/70 p-2.5 text-xs">
                <Icon name="check" className="h-4 w-4 shrink-0 text-forest mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink/90 leading-tight">{act.text}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground font-mono">
                    {new Date(act.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                    {new Date(act.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

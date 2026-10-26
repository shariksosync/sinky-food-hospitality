import { useState } from "react";
import { useApp, useRouter } from "../store.jsx";
import { Icon, Wordmark, Confirm } from "../ui.jsx";

export const ADMIN_SECTIONS = [
  { id: "dashboard", label: "Dashboard", path: "/admin", icon: "grid", group: "Overview" },
  { id: "products", label: "Products", path: "/admin/products", icon: "box", group: "Catalogue" },
  { id: "categories", label: "Product Categories", path: "/admin/categories", icon: "tag", group: "Catalogue" },
  { id: "services", label: "Services", path: "/admin/services", icon: "leaf", group: "Catalogue" },
  { id: "portfolio", label: "Portfolio / Projects", path: "/admin/portfolio", icon: "file", group: "Catalogue" },
  { id: "gallery", label: "Gallery", path: "/admin/gallery", icon: "image", group: "Catalogue" },
  { id: "enquiries", label: "Enquiries", path: "/admin/enquiries", icon: "inbox", group: "Operations" },
  { id: "testimonials", label: "Testimonials", path: "/admin/testimonials", icon: "star", group: "Operations" },
  { id: "team", label: "Team & Directors", path: "/admin/team", icon: "users", group: "Operations" },
  { id: "quality-process", label: "Quality & Process", path: "/admin/quality-process", icon: "check", group: "Operations" },
  { id: "company", label: "Company Profile", path: "/admin/company", icon: "home", group: "Content & Site" },
  { id: "homepage", label: "Homepage Content", path: "/admin/homepage", icon: "edit", group: "Content & Site" },
  { id: "navigation", label: "Navigation Menu", path: "/admin/navigation", icon: "menu", group: "Content & Site" },
  { id: "footer", label: "Footer Management", path: "/admin/footer", icon: "chevron", group: "Content & Site" },
  { id: "seo", label: "SEO & Metadata", path: "/admin/seo", icon: "search", group: "Content & Site" },
  { id: "settings", label: "Website Settings", path: "/admin/settings", icon: "settings", group: "Content & Site" },
];

export function AdminLayout({ activeSection = "dashboard", children }) {
  const { logout, reset, notify, data } = useApp();
  const { path, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const pendingEnquiries = (data.enquiries || []).filter((e) => e.status === "New").length;

  const currentNav = ADMIN_SECTIONS.find((s) => s.id === activeSection) || ADMIN_SECTIONS[0];

  const handleReset = () => {
    reset();
    setConfirmReset(false);
    notify("Demo data has been restored to factory defaults.");
  };

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const navGroups = ["Overview", "Catalogue", "Operations", "Content & Site"];

  return (
    <div className="flex min-h-screen bg-slate-50 text-ink">
      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-line px-6">
          <Wordmark />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sage lg:hidden"
            aria-label="Close menu"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navGroups.map((group) => {
            const items = ADMIN_SECTIONS.filter((s) => s.group === group);
            return (
              <div key={group}>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                <div className="mt-2 space-y-1">
                  {items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          navigate(item.path);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-forest text-cream font-semibold shadow-xs"
                            : "text-ink/80 hover:bg-sage hover:text-forest"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon name={item.icon} className={`h-4 w-4 ${isActive ? "text-cream" : "text-muted-foreground"}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.id === "enquiries" && pendingEnquiries > 0 && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              isActive ? "bg-terracotta text-cream" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {pendingEnquiries}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="border-t border-line p-4 space-y-2">
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-2.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
          >
            <Icon name="refresh" className="h-4 w-4" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-sage hover:text-forest transition"
          >
            <Icon name="logout" className="h-4 w-4" />
            <span>Logout Administrator</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-line bg-card/90 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-sage lg:hidden"
              aria-label="Open sidebar"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="cursor-pointer hover:text-forest" onClick={() => navigate("/admin")}>
                  Admin
                </span>
                <span>/</span>
                <span className="font-medium text-ink">{currentNav.label}</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-forest">{currentNav.label}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-xs font-medium text-forest hover:bg-sage transition shadow-xs"
            >
              <Icon name="eye" className="h-4 w-4 text-terracotta" />
              <span>Preview Website</span>
            </button>

            <div className="flex items-center gap-2.5 rounded-full border border-line bg-sage/60 px-3.5 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-cream">
                A
              </span>
              <div className="hidden text-left md:block">
                <p className="text-xs font-bold leading-tight text-forest">Demo Admin</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Sinky Industries</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Confirm Reset Dialog */}
      <Confirm
        open={confirmReset}
        title="Restore Factory Demo Data?"
        message="This will reset all products, projects, services, enquiries, and settings back to their initial state. Any changes saved in your browser will be overwritten."
        confirmLabel="Reset Everything"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

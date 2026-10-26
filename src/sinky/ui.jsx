import { useEffect, useRef, useState } from "react";
import { Link, useApp, useRouter, lines } from "./store.jsx";

/* ---------------- Icons (inline SVG) ---------------- */
const paths = {
  leaf: "M5 21c0-9 6-15 16-16-1 10-7 16-16 16Zm0 0 8-8",
  pot: "M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6Zm-2 0h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2",
  bottle: "M10 2h4v4l2 3v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3V2Zm-2 11h8",
  truck: "M2 6h12v10H2zM14 10h4l4 4v2h-8M6 19a2 2 0 1 0 0-.01M18 19a2 2 0 1 0 0-.01",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m6 9 6 6 6-6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  phone: "M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  pin: "M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
  check: "m5 12 5 5L20 7",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  star: "m12 3 2.7 5.6 6.3.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.3-.9L12 3Z",
  grid: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  box: "M3 7l9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10",
  tag: "M3 3h8l10 10-8 8L3 11V3Zm4 4h.01",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6",
  inbox: "M3 13h5l2 3h4l2-3h5M3 13l3-8h12l3 8v6H3v-6Z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3 2-1-2-4-2 1-2-1V5h-4l-.5 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1 .5 2h4l.5-2 2-1 2 1 2-4-2-1v-2Z",
  file: "M6 2h9l5 5v15H6zM14 2v6h6",
  image: "M3 4h18v16H3zM3 16l5-5 5 5 3-3 5 5M15 9h.01",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11",
  home: "M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z",
  refresh: "M20 11a8 8 0 1 0-2 6M20 4v7h-7",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3",
  edit: "M4 20h4L19 9l-4-4L4 16v4Z",
  plus: "M12 5v14M5 12h14",
  up: "m6 15 6-6 6 6",
  down: "m6 9 6 6 6-6",
};
export function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name] || paths.box} />
    </svg>
  );
}

/* ---------------- Image with fallback ---------------- */
export function Img({ src, alt, className = "", eager }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);
  if (failed)
    return (
      <div role="img" aria-label={alt} className={`img-fallback flex items-center justify-center ${className}`}>
        <span className="font-serif text-lg italic opacity-70">Sinky</span>
      </div>
    );
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

/* ---------------- Buttons ---------------- */
export function Btn({ to, variant = "primary", className = "", children, ...rest }) {
  const cls = `btn btn-${variant} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}

/* ---------------- Modal & Confirm ---------------- */
export function Modal({ open, onClose, title, children, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 sm:p-8" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} rounded-2xl bg-card shadow-soft outline-none`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-serif text-xl text-forest">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-sage"><Icon name="close" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Confirm({ open, title = "Are you sure?", message, onConfirm, onCancel, confirmLabel = "Delete" }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-ink/80">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
      </div>
    </Modal>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div role="status" className={`fixed bottom-5 right-5 z-[200] max-w-sm rounded-xl px-5 py-3 text-sm shadow-soft ${toast.type === "error" ? "bg-destructive text-cream" : "bg-forest text-cream"}`}>
      {toast.msg}
    </div>
  );
}

/* ---------------- Form fields ---------------- */
export function Field({ label, error, required, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}{required && <span className="text-terracotta"> *</span>}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
export const inputCls = "input";

export const validate = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  phone: (v) => /^\+?[0-9\s-]{8,16}$/.test(v.trim()),
};

/* ---------------- Enquiry form ---------------- */
const CATS = ["General Business Enquiry", "Product Enquiry", "Hospitality Project", "Packaged Beverages", "Bulk Requirement"];

export function EnquiryForm({ defaultCategory = "General Business Enquiry", product, compact }) {
  const { addEnquiry, notify } = useApp();
  const blank = { name: "", company: "", email: "", phone: "", category: defaultCategory, subject: product ? `Enquiry about ${product}` : "", message: "" };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);
  const last = useRef("");

  useEffect(() => setF((x) => ({ ...x, category: defaultCategory, subject: product ? `Enquiry about ${product}` : x.subject })), [defaultCategory, product]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Please enter your full name.";
    if (!f.email.trim()) er.email = "Email is required.";
    else if (!validate.email(f.email)) er.email = "Please enter a valid email address.";
    if (!f.phone.trim()) er.phone = "Phone is required.";
    else if (!validate.phone(f.phone)) er.phone = "Enter a valid phone number (8–16 digits).";
    if (!f.subject.trim()) er.subject = "Subject is required.";
    if (f.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setErr(er);
    if (Object.keys(er).length) return;
    const sig = JSON.stringify(f);
    if (sig === last.current) { notify("This enquiry was already saved.", "error"); return; }
    setBusy(true);
    setTimeout(() => {
      const item = addEnquiry({ ...f, product: product || "" });
      last.current = sig;
      setDone(item.id);
      setBusy(false);
      setF(blank);
    }, 400);
  };

  if (done)
    return (
      <div className="rounded-2xl border border-line bg-sage p-6">
        <div className="flex items-center gap-2 text-forest"><Icon name="check" /> <strong>Enquiry saved — reference {done}</strong></div>
        <p className="mt-2 text-sm text-ink/80">Demo mode: your enquiry is stored locally in this browser and has not been sent to the company's email inbox. For a real enquiry, please call or email us directly.</p>
        <Btn variant="ghost" className="mt-4" onClick={() => setDone(null)}>Submit another enquiry</Btn>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="Full name" required error={err.name}><input className="input" value={f.name} onChange={set("name")} /></Field>
        <Field label="Company name"><input className="input" value={f.company} onChange={set("company")} /></Field>
        <Field label="Email" required error={err.email}><input type="email" className="input" value={f.email} onChange={set("email")} /></Field>
        <Field label="Phone" required error={err.phone}><input type="tel" className="input" value={f.phone} onChange={set("phone")} /></Field>
        <Field label="Enquiry category">
          <select className="input" value={f.category} onChange={set("category")}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field label="Subject" required error={err.subject}><input className="input" value={f.subject} onChange={set("subject")} /></Field>
      </div>
      <Field label="Message" required error={err.message}><textarea rows={4} className="input" value={f.message} onChange={set("message")} /></Field>
      <p className="text-xs text-muted-foreground">Demo website: submissions are stored only in this browser and are not emailed.</p>
      <Btn type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? "Saving…" : "Submit Enquiry"}</Btn>
    </form>
  );
}

/* ---------------- Wordmark ---------------- */
export function Wordmark({ light }) {
  const { data } = useApp();
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Sinky Industries home">
      <span className={`flex h-10 w-10 items-center justify-center rounded-full font-serif text-xl ${light ? "bg-cream text-forest" : "bg-forest text-cream"}`}>S</span>
      <span className="leading-none">
        <span className={`block font-serif text-lg tracking-[0.14em] ${light ? "text-cream" : "text-forest"}`}>{data.settings.wordmarkTop}</span>
        <span className={`block text-[10px] tracking-[0.35em] ${light ? "text-wheat" : "text-terracotta"}`}>{data.settings.wordmarkSub}</span>
      </span>
    </Link>
  );
}

/* ---------------- Header ---------------- */
export function Header() {
  const { data } = useApp();
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  useEffect(() => { setOpen(false); setDd(false); }, [path]);
  const sub = [
    { label: "All Products", to: "/products" },
    { label: "Food Products", to: "/products?cat=premium" },
    { label: "Packaged Beverages", to: "/beverages" },
    { label: "Customized Culinary Solutions", to: "/products?cat=culinary" },
    { label: "Manufacturing & Processing", to: "/manufacturing" },
  ];
  const nav = data.nav.filter((n) => n.visible);
  const active = (p) => (p === "/" ? path === "/" : path.startsWith(p));
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur">
      {data.settings.showAnnouncement && data.settings.announcement && (
        <div className="bg-forest-deep px-4 py-1.5 text-center text-xs text-cream/90">{data.settings.announcement}</div>
      )}
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Wordmark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((n) =>
            n.dropdown ? (
              <div key={n.id} className="relative" onMouseEnter={() => setDd(true)} onMouseLeave={() => setDd(false)}>
                <button onClick={() => setDd(!dd)} aria-expanded={dd} className={`nav-link flex items-center gap-1 ${active(n.path) ? "nav-active" : ""}`}>
                  {n.label} <Icon name="chevron" className="h-4 w-4" />
                </button>
                {dd && (
                  <div className="absolute left-0 top-full w-72 pt-2">
                    <div className="rounded-xl border border-line bg-card p-2 shadow-soft">
                      {sub.map((s) => <Link key={s.to} to={s.to} className="block rounded-lg px-4 py-2.5 text-sm hover:bg-sage">{s.label}</Link>)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={n.id} to={n.path} className={`nav-link ${active(n.path) ? "nav-active" : ""}`}>{n.label}</Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Btn to="/contact#enquiry" className="hidden sm:inline-flex">Business Enquiry</Btn>
          <button className="rounded-lg p-2 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-cream px-4 pb-6 lg:hidden" aria-label="Mobile">
          {nav.map((n) => (
            <div key={n.id}>
              <Link to={n.path} className="block border-b border-line py-3 font-medium">{n.label}</Link>
              {n.dropdown && sub.slice(1).map((s) => <Link key={s.to} to={s.to} className="block py-2 pl-4 text-sm text-muted-foreground">{s.label}</Link>)}
            </div>
          ))}
          <Btn to="/contact#enquiry" className="mt-4 w-full">Business Enquiry</Btn>
        </nav>
      )}
    </header>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const { data } = useApp();
  const c = data.company;
  const [modal, setModal] = useState(null);
  const col = "space-y-2.5 text-sm text-cream/75";
  const social = [["Instagram", data.footer.instagram], ["Facebook", data.footer.facebook], ["LinkedIn", data.footer.linkedin]].filter((s) => s[1]);
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark light />
          <p className="mt-5 text-sm leading-relaxed text-cream/70">{data.footer.description}</p>
          {social.length > 0 && <div className="mt-4 flex gap-4 text-sm">{social.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer" className="text-wheat hover:underline">{n}</a>)}</div>}
        </div>
        <div>
          <h3 className="footer-h">Explore</h3>
          <ul className={col}>
            {[["About Us", "/about"], ["Products", "/products"], ["Manufacturing & Processing", "/manufacturing"], ["Packaged Beverages", "/beverages"], ["Portfolio", "/portfolio"]].map(([l, t]) => <li key={t}><Link to={t} className="hover:text-cream">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="footer-h">Services</h3>
          <ul className={col}>
            {[["Hospitality Solutions", "/hospitality"], ["Customized Culinary Solutions", "/products?cat=culinary"], ["Business Enquiries", "/contact#enquiry"], ["Contact Us", "/contact"]].map(([l, t]) => <li key={l}><Link to={t} className="hover:text-cream">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="footer-h">Contact</h3>
          <ul className={col}>
            <li><a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-cream">{c.phone}</a></li>
            <li><a href={`mailto:${c.email}`} className="hover:text-cream">{c.email}</a></li>
            <li className="leading-relaxed">{c.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {data.footer.copyright}</p>
          <div className="flex items-center gap-5">
            <button onClick={() => setModal("privacy")} className="hover:text-cream">Privacy Policy</button>
            <button onClick={() => setModal("terms")} className="hover:text-cream">Terms & Conditions</button>
            <Link to="/admin-login" className="text-cream/45 hover:text-terracotta">{data.footer.adminLabel || "Admin Login"}</Link>
          </div>
        </div>
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}>
        <p className="text-sm leading-relaxed text-ink/80">
          Placeholder: this {modal === "privacy" ? "privacy policy" : "terms and conditions"} page will be provided by {c.name}. This demonstration website stores enquiries only in your own browser's local storage and does not transmit them to any server.
        </p>
      </Modal>
    </footer>
  );
}

/* ---------------- Page pieces ---------------- */
export function PageHero({ eyebrow, title, text, image }) {
  return (
    <section className="relative overflow-hidden bg-forest-deep text-cream">
      {image && <Img src={image} alt="" eager className="absolute inset-0 h-full w-full opacity-35" />}
      <div className="hero-veil absolute inset-0" />
      <div className="container-x relative py-20 md:py-28">
        {eyebrow && <p className="eyebrow text-wheat">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-cream/80">{text}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center }) {
  return (
    <div className={`mb-12 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 font-serif text-3xl leading-tight text-forest md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-ink/70">{text}</p>}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input pl-9" />
    </div>
  );
}

export function Chips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} aria-pressed={value === o.id} className={`chip ${value === o.id ? "chip-on" : ""}`}>{o.name}</button>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-card px-6 py-16 text-center">
      <Icon name="search" className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="mt-3 font-serif text-xl text-forest">{title}</h3>
      {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const availCls = { Available: "badge-green", Limited: "badge-wheat", "On Request": "badge-terra", Unavailable: "badge-gray" };
export function Badge({ children, tone }) {
  return <span className={`badge ${tone || availCls[children] || "badge-gray"}`}>{children}</span>;
}

export function ProductCard({ p, category }) {
  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link to={`/products/${p.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <Img src={p.image} alt={p.name} className="h-full w-full transition duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3"><Badge>{p.availability}</Badge></span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-[10px]">{category}</p>
        <h3 className="mt-2 font-serif text-xl text-forest">{p.name}</h3>
        <p className="mt-2 flex-1 text-sm text-ink/70">{p.short}</p>
        {p.packaging && <p className="mt-3 text-xs text-muted-foreground"><strong className="text-ink/80">Packaging:</strong> {p.packaging}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <Btn to={`/products/${p.id}`} variant="outline" className="btn-sm">View Details</Btn>
          <Btn to={`/products/${p.id}#enquire`} variant="link" className="btn-sm">Enquire</Btn>
        </div>
      </div>
    </article>
  );
}

export function ProjectCard({ p }) {
  return (
    <article className="card group overflow-hidden">
      <Link to={`/portfolio/${p.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Img src={p.image} alt={p.title} className="h-full w-full transition duration-700 group-hover:scale-105" />
          <span className="absolute left-3 top-3"><Badge tone="badge-wheat">{p.status}</Badge></span>
        </div>
        <div className="p-5">
          <p className="eyebrow text-[10px]">{p.category}</p>
          <h3 className="mt-2 font-serif text-xl text-forest">{p.title}</h3>
          <p className="mt-2 text-sm text-ink/70">{p.summary}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-terracotta">View project <Icon name="arrow" className="h-4 w-4" /></span>
        </div>
      </Link>
    </article>
  );
}

export function ProcessSteps({ steps }) {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[...steps].sort((a, b) => a.order - b.order).map((s, i) => (
        <li key={s.id} className="card p-6">
          <span className="font-serif text-4xl text-wheat">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 font-serif text-xl text-forest">{s.title}</h3>
          <p className="mt-2 text-sm text-ink/70">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function ContactDetails() {
  const { data } = useApp();
  const c = data.company;
  const row = "flex gap-4 rounded-xl border border-line bg-card p-4";
  return (
    <div className="space-y-3">
      <a href={`tel:${c.phone.replace(/\s/g, "")}`} className={row}><Icon name="phone" className="h-5 w-5 shrink-0 text-terracotta" /><span><span className="block text-xs text-muted-foreground">Phone</span>{c.phone}</span></a>
      <a href={`mailto:${c.email}`} className={row}><Icon name="mail" className="h-5 w-5 shrink-0 text-terracotta" /><span><span className="block text-xs text-muted-foreground">Email</span>{c.email}</span></a>
      <div className={row}><Icon name="pin" className="h-5 w-5 shrink-0 text-terracotta" /><span><span className="block text-xs text-muted-foreground">Address</span>{c.address}</span></div>
    </div>
  );
}

export { lines };

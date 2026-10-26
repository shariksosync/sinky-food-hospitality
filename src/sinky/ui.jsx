import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

/* ---------------- Modal & Confirm (Fixed with React Portal) ---------------- */
export function Modal({ open, onClose, title, children, wide, size }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    ref.current?.focus();

    const prevOverflow = typeof document !== "undefined" ? document.body.style.overflow : "";
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", k);
      if (typeof document !== "undefined") {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxWidthCls = size === "sm" ? "max-w-[360px] sm:max-w-sm" : wide ? "max-w-3xl" : "max-w-lg";

  const content = (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-4 backdrop-blur-xs"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative my-auto flex max-h-[92vh] w-full flex-col rounded-2xl bg-card shadow-2xl border border-line outline-none ${maxWidthCls}`}
      >
        <div className={`flex items-center justify-between border-b border-line shrink-0 bg-card rounded-t-2xl ${size === "sm" ? "px-4 py-2.5 sm:py-3" : "px-5 py-4"}`}>
          <h2 className={`font-serif font-bold text-forest ${size === "sm" ? "text-base sm:text-lg" : "text-lg sm:text-xl"}`}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-sage hover:text-ink transition"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className={`overflow-y-auto flex-1 ${size === "sm" ? "p-3 sm:p-4" : "p-4 sm:p-6"}`}>{children}</div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }
  return content;
}

export function Confirm({ open, title = "Are you sure?", message, onConfirm, onCancel, confirmLabel = "Delete" }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-ink/80 text-sm">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Btn variant="ghost" className="btn-sm" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" className="btn-sm" onClick={onConfirm}>{confirmLabel}</Btn>
      </div>
    </Modal>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div role="status" className={`fixed bottom-24 right-4 sm:right-6 z-[1000] max-w-sm rounded-xl px-5 py-3 text-sm shadow-soft ${toast.type === "error" ? "bg-destructive text-cream" : "bg-forest text-cream"}`}>
      {toast.msg}
    </div>
  );
}

/* ---------------- Floating Contact Buttons (WhatsApp & Phone) ---------------- */
export function FloatingActions() {
  const { path } = useRouter();
  const { data } = useApp();

  // Hide in admin area
  if (path.startsWith("/admin")) return null;

  const rawPhone = (data?.company?.phone || "+91 9876543210").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    "Hello Sinky Industries, I would like to enquire about your products and services."
  )}`;
  const telUrl = `tel:+${rawPhone}`;

  return (
    <div
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3"
      role="region"
      aria-label="Quick contact"
    >
      {/* WhatsApp Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <span className="pointer-events-none absolute right-full mr-2.5 hidden rounded-lg bg-forest-deep px-2.5 py-1 text-xs font-medium text-cream shadow-md whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 sm:inline-block">
          WhatsApp Us
        </span>
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 fill-current" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.84 7.35C8.64 7.35 8.35 7.42 8.1 7.69C7.86 7.96 7.17 8.6 7.17 9.91C7.17 11.22 8.13 12.48 8.26 12.65C8.4 12.83 10.14 15.52 12.82 16.67C13.45 16.95 13.95 17.11 14.34 17.23C15 17.44 15.61 17.41 16.08 17.34C16.61 17.26 17.7 16.68 17.93 16.04C18.16 15.39 18.16 14.84 18.09 14.73C18.03 14.61 17.85 14.54 17.58 14.41C17.31 14.27 15.98 13.62 15.74 13.53C15.49 13.44 15.31 13.4 15.13 13.67C14.95 13.94 14.43 14.54 14.28 14.71C14.12 14.89 13.96 14.91 13.69 14.77C13.42 14.64 12.56 14.36 11.53 13.44C10.73 12.73 10.18 11.85 10.02 11.58C9.87 11.31 10 11.16 10.14 11.02C10.26 10.9 10.41 10.7 10.55 10.54C10.69 10.37 10.73 10.25 10.82 10.07C10.91 9.9 10.87 9.74 10.8 9.61C10.73 9.47 10.2 8.18 9.98 7.65C9.76 7.14 9.54 7.21 9.38 7.2C9.22 7.2 9.04 7.2 8.84 7.2L8.84 7.35Z" />
        </svg>
      </a>

      {/* Phone Floating Button */}
      <a
        href={telUrl}
        aria-label={`Call Sinky Industries: ${data.company.phone}`}
        className="group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-forest text-wheat border border-cream/20 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <span className="pointer-events-none absolute right-full mr-2.5 hidden rounded-lg bg-forest-deep px-2.5 py-1 text-xs font-medium text-cream shadow-md whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 sm:inline-block">
          Direct Call
        </span>
        <Icon name="phone" className="h-4 w-4 sm:h-5 sm:w-5" />
      </a>
    </div>
  );
}

/* ---------------- Form fields ---------------- */
export function Field({ label, error, required, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs sm:text-sm font-medium text-ink">{label}{required && <span className="text-terracotta"> *</span>}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
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
    if (!f.name.trim()) er.name = "Full name is required.";
    if (!f.phone.trim()) er.phone = "Phone is required.";
    else if (!validate.phone(f.phone)) er.phone = "Enter a valid phone number (8–16 digits).";

    if (!compact) {
      if (!f.email.trim()) er.email = "Email is required.";
      else if (!validate.email(f.email)) er.email = "Please enter a valid email address.";
      if (!f.subject.trim()) er.subject = "Subject is required.";
    }

    if (!f.message.trim() || f.message.trim().length < (compact ? 3 : 10)) {
      er.message = compact ? "Please share your requirement." : "Please write at least 10 characters.";
    }

    setErr(er);
    if (Object.keys(er).length) return;
    const sig = JSON.stringify(f);
    if (sig === last.current) { notify("This enquiry was already saved.", "error"); return; }
    setBusy(true);
    setTimeout(() => {
      const item = addEnquiry({
        ...f,
        email: f.email.trim() || "Not provided",
        subject: f.subject.trim() || (product ? `Enquiry about ${product}` : "Quick Business Enquiry"),
        category: f.category || defaultCategory || "General Business Enquiry",
        company: f.company || "",
        product: product || "",
      });
      last.current = sig;
      setDone(item.id);
      setBusy(false);
      setF(blank);
    }, 350);
  };

  if (done)
    return (
      <div className="rounded-xl border border-line bg-sage p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-forest text-sm font-semibold">
          <Icon name="check" className="h-4 w-4" /> <span>Enquiry saved — ref {done}</span>
        </div>
        <p className="mt-1.5 text-xs text-ink/75 leading-relaxed">
          Stored locally in demo mode. We'll be in touch shortly!
        </p>
        <Btn variant="ghost" className="btn-sm mt-3 w-full" onClick={() => setDone(null)}>
          Submit another
        </Btn>
      </div>
    );

  if (compact) {
    return (
      <form onSubmit={submit} noValidate className="space-y-2.5">
        <Field label="Full name" required error={err.name}>
          <input className="input !py-1.5 text-xs sm:text-sm" value={f.name} onChange={set("name")} placeholder="Your name" />
        </Field>
        <Field label="Phone" required error={err.phone}>
          <input type="tel" className="input !py-1.5 text-xs sm:text-sm" value={f.phone} onChange={set("phone")} placeholder="+91 9000000000" />
        </Field>
        <Field label="Message" required error={err.message}>
          <textarea rows={2} className="input !py-1.5 text-xs sm:text-sm resize-none" value={f.message} onChange={set("message")} placeholder="What products or service do you need?" />
        </Field>
        <p className="text-[10px] text-muted-foreground text-center">
          Demo mode: stored locally in browser
        </p>
        <Btn type="submit" disabled={busy} className="w-full btn-sm">
          {busy ? "Saving…" : "Submit Enquiry"}
        </Btn>
      </form>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3.5 sm:space-y-4">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={err.name}><input className="input" value={f.name} onChange={set("name")} placeholder="Your name" /></Field>
        <Field label="Company name"><input className="input" value={f.company} onChange={set("company")} placeholder="Organization (optional)" /></Field>
        <Field label="Email" required error={err.email}><input type="email" className="input" value={f.email} onChange={set("email")} placeholder="name@example.com" /></Field>
        <Field label="Phone" required error={err.phone}><input type="tel" className="input" value={f.phone} onChange={set("phone")} placeholder="+91 9000000000" /></Field>
        <Field label="Enquiry category">
          <select className="input" value={f.category} onChange={set("category")}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field label="Subject" required error={err.subject}><input className="input" value={f.subject} onChange={set("subject")} placeholder="Enquiry topic" /></Field>
      </div>
      <Field label="Message" required error={err.message}><textarea rows={3} className="input" value={f.message} onChange={set("message")} placeholder="Please share requirements or volumes..." /></Field>
      <p className="text-[11px] text-muted-foreground">Demo website: submissions are stored only in this browser and are not emailed.</p>
      <Btn type="submit" disabled={busy} className="w-full sm:w-auto">{busy ? "Saving…" : "Submit Enquiry"}</Btn>
    </form>
  );
}

/* ---------------- Wordmark ---------------- */
export function Wordmark({ light }) {
  const { data } = useApp();
  return (
    <Link to="/" className="group flex items-center gap-2.5 sm:gap-3" aria-label="Sinky Industries home">
      <span className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full font-serif text-lg sm:text-xl font-bold ${light ? "bg-cream text-forest" : "bg-forest text-cream"}`}>S</span>
      <span className="leading-tight">
        <span className={`block font-serif text-base sm:text-lg tracking-[0.12em] sm:tracking-[0.14em] font-bold ${light ? "text-cream" : "text-forest"}`}>{data.settings.wordmarkTop}</span>
        <span className={`block text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.35em] ${light ? "text-wheat" : "text-terracotta"}`}>{data.settings.wordmarkSub}</span>
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
  const [enquiryOpen, setEnquiryOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
        <div className="container-x flex h-16 sm:h-20 items-center justify-between gap-3">
          <Wordmark />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((n) =>
              n.dropdown ? (
                <div key={n.id} className="relative" onMouseEnter={() => setDd(true)} onMouseLeave={() => setDd(false)}>
                  <Link
                    to={n.path}
                    onClick={() => setDd(false)}
                    className={`nav-link flex items-center gap-1 ${active(n.path) ? "nav-active" : ""}`}
                  >
                    {n.label} <Icon name="chevron" className="h-4 w-4" />
                  </Link>
                  {dd && (
                    <div className="absolute left-0 top-full w-72 pt-2">
                      <div className="rounded-xl border border-line bg-card p-2 shadow-soft">
                        {sub.map((s) => (
                          <Link
                            key={s.to}
                            to={s.to}
                            onClick={() => setDd(false)}
                            className="block rounded-lg px-4 py-2.5 text-sm hover:bg-sage"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={n.id} to={n.path} className={`nav-link ${active(n.path) ? "nav-active" : ""}`}>{n.label}</Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Pill Button */}
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="btn btn-primary rounded-full hidden sm:inline-flex items-center gap-2 px-5 py-2 text-xs lg:text-sm font-semibold shadow-xs hover:scale-[1.02] transition"
              aria-label={`Call or enquire with Sinky Industries: ${data.company.phone}`}
            >
              <Icon name="phone" className="h-4 w-4 text-wheat" />
              <span>{data.company.phone}</span>
            </button>

            {/* Mobile Direct Dial Button */}
            <a
              href={`tel:${data.company.phone.replace(/\s/g, "")}`}
              className="flex sm:hidden h-9 w-9 items-center justify-center rounded-full bg-forest text-wheat shadow-xs"
              aria-label="Direct call"
            >
              <Icon name="phone" className="h-4 w-4" />
            </a>

            {/* Hamburger Toggle */}
            <button
              className="rounded-lg p-2 lg:hidden text-ink hover:bg-sage"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {open && (
          <nav className="border-t border-line bg-cream px-4 pb-6 lg:hidden max-h-[80vh] overflow-y-auto" aria-label="Mobile">
            <div className="divide-y divide-line">
              {nav.map((n) => (
                <div key={n.id} className="py-1">
                  <div className="flex items-center justify-between py-2.5">
                    <Link
                      to={n.path}
                      onClick={() => setOpen(false)}
                      className={`font-serif text-base font-bold transition hover:text-terracotta ${
                        active(n.path) ? "text-terracotta" : "text-forest"
                      }`}
                    >
                      {n.label}
                    </Link>
                    {n.dropdown && (
                      <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                        Catalogue
                      </span>
                    )}
                  </div>
                  {n.dropdown && (
                    <div className="mb-2 mt-1 space-y-1 rounded-xl bg-sage/75 p-2 border border-forest/15 shadow-2xs">
                      {sub.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-forest hover:bg-forest hover:text-cream transition"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
                            <span>{s.label}</span>
                          </span>
                          <Icon name="arrow" className="h-3.5 w-3.5 opacity-60" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEnquiryOpen(true);
              }}
              className="btn btn-primary rounded-full mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold shadow-xs"
            >
              <Icon name="phone" className="h-4 w-4 text-wheat" />
              <span>{data.company.phone}</span>
            </button>
          </nav>
        )}
      </header>

      {/* Business Enquiry Popup Modal (Hoisted via createPortal outside header, ultra-compact) */}
      <Modal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} title="Business Enquiry" size="sm">
        <div className="mb-2.5 flex items-center justify-between rounded-xl bg-sage/70 px-3 py-1.5 text-xs text-forest border border-line">
          <div className="flex items-center gap-1.5 font-medium">
            <Icon name="phone" className="h-3.5 w-3.5 text-terracotta" />
            <span>Direct Line:</span>
            <a href={`tel:${data.company.phone.replace(/\s/g, "")}`} className="font-bold hover:underline">
              {data.company.phone}
            </a>
          </div>
          <span className="text-[10px] text-muted-foreground">or message below</span>
        </div>
        <EnquiryForm compact />
      </Modal>
    </>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const { data } = useApp();
  const c = data.company;
  const [modal, setModal] = useState(null);
  const col = "space-y-2.5 text-xs sm:text-sm text-cream/75";
  const social = [["Instagram", data.footer.instagram], ["Facebook", data.footer.facebook], ["LinkedIn", data.footer.linkedin]].filter((s) => s[1]);
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="container-x grid gap-8 sm:gap-10 py-12 sm:py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark light />
          <p className="mt-4 sm:mt-5 text-xs sm:text-sm leading-relaxed text-cream/70">{data.footer.description}</p>
          {social.length > 0 && <div className="mt-4 flex gap-4 text-xs sm:text-sm">{social.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer" className="text-wheat hover:underline">{n}</a>)}</div>}
        </div>
        <div>
          <h3 className="footer-h">Explore</h3>
          <ul className={col}>
            {[["About Us", "/about"], ["Products", "/products"], ["Manufacturing & Processing", "/manufacturing"], ["Packaged Beverages", "/beverages"], ["Portfolio", "/portfolio"]].map(([l, t]) => <li key={t}><Link to={t} className="hover:text-cream py-0.5 inline-block">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="footer-h">Services</h3>
          <ul className={col}>
            {[["Hospitality Solutions", "/hospitality"], ["Customized Culinary Solutions", "/products?cat=culinary"], ["Business Enquiries", "/contact#enquiry"], ["Contact Us", "/contact"]].map(([l, t]) => <li key={l}><Link to={t} className="hover:text-cream py-0.5 inline-block">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="footer-h">Contact</h3>
          <ul className={col}>
            <li><a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-cream py-0.5 inline-block">{c.phone}</a></li>
            <li><a href={`mailto:${c.email}`} className="hover:text-cream py-0.5 inline-block">{c.email}</a></li>
            <li className="leading-relaxed">{c.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/60 sm:flex-row text-center sm:text-left">
          <p>© {new Date().getFullYear()} {data.footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <button onClick={() => setModal("privacy")} className="hover:text-cream py-1">Privacy Policy</button>
            <button onClick={() => setModal("terms")} className="hover:text-cream py-1">Terms & Conditions</button>
            <Link to="/admin-login" className="text-cream/45 hover:text-terracotta py-1">{data.footer.adminLabel || "Admin Login"}</Link>
          </div>
        </div>
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}>
        <p className="text-xs sm:text-sm leading-relaxed text-ink/80">
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
      {image && <Img src={image} alt="" eager className="absolute inset-0 h-full w-full opacity-35 object-cover" />}
      <div className="hero-veil absolute inset-0" />
      <div className="container-x relative py-12 sm:py-16 md:py-24">
        {eyebrow && <p className="eyebrow text-wheat">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl font-serif text-3xl sm:text-4xl md:text-6xl leading-tight">{title}</h1>
        {text && <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-lg text-cream/80 leading-relaxed">{text}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center }) {
  return (
    <div className={`mb-8 sm:mb-12 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2.5 sm:mt-3 font-serif text-2xl sm:text-3xl md:text-5xl leading-tight text-forest">{title}</h2>
      {text && <p className="mt-3 sm:mt-4 text-xs sm:text-base text-ink/70 leading-relaxed">{text}</p>}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input aria-label={placeholder} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input pl-9 text-xs sm:text-sm" />
    </div>
  );
}

export function Chips({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none sm:flex-wrap" role="group" aria-label="Filter by category">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} aria-pressed={value === o.id} className={`chip text-xs sm:text-sm ${value === o.id ? "chip-on" : ""}`}>{o.name}</button>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-card px-4 py-12 sm:px-6 sm:py-16 text-center">
      <Icon name="search" className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="mt-3 font-serif text-lg sm:text-xl text-forest">{title}</h3>
      {text && <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{text}</p>}
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
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="eyebrow text-[10px]">{category}</p>
        <h3 className="mt-1.5 font-serif text-lg sm:text-xl text-forest">{p.name}</h3>
        <p className="mt-2 flex-1 text-xs sm:text-sm text-ink/70 leading-relaxed">{p.short}</p>
        {p.packaging && <p className="mt-3 text-[11px] sm:text-xs text-muted-foreground"><strong className="text-ink/80">Packaging:</strong> {p.packaging}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn to={`/products/${p.id}`} variant="outline" className="btn-sm flex-1 sm:flex-initial">View Details</Btn>
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
        <div className="p-4 sm:p-5">
          <p className="eyebrow text-[10px]">{p.category}</p>
          <h3 className="mt-1.5 font-serif text-lg sm:text-xl text-forest">{p.title}</h3>
          <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">{p.summary}</p>
          <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-terracotta">View project <Icon name="arrow" className="h-4 w-4" /></span>
        </div>
      </Link>
    </article>
  );
}

export function ProcessSteps({ steps }) {
  return (
    <ol className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[...steps].sort((a, b) => a.order - b.order).map((s, i) => (
        <li key={s.id} className="card p-5 sm:p-6">
          <span className="font-serif text-3xl sm:text-4xl text-wheat">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-2.5 sm:mt-3 font-serif text-lg sm:text-xl text-forest">{s.title}</h3>
          <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function ContactDetails() {
  const { data } = useApp();
  const c = data.company;
  const row = "flex gap-3 sm:gap-4 rounded-xl border border-line bg-card p-3.5 sm:p-4 text-xs sm:text-sm";
  return (
    <div className="space-y-3">
      <a href={`tel:${c.phone.replace(/\s/g, "")}`} className={row}><Icon name="phone" className="h-5 w-5 shrink-0 text-terracotta" /><span><span className="block text-[11px] text-muted-foreground">Phone</span>{c.phone}</span></a>
      <a href={`mailto:${c.email}`} className={row}><Icon name="mail" className="h-5 w-5 shrink-0 text-terracotta" /><span><span className="block text-[11px] text-muted-foreground">Email</span>{c.email}</span></a>
      <div className={row}><Icon name="pin" className="h-5 w-5 shrink-0 text-terracotta" /><span><span className="block text-[11px] text-muted-foreground">Address</span>{c.address}</span></div>
    </div>
  );
}

export { lines };

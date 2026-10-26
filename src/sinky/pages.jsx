import { useMemo, useState } from "react";
import { useApp, useRouter, catName, lines, Link } from "./store.jsx";
import { IMG } from "./data.js";
import {
  Btn, Icon, Img, PageHero, SectionHead, SearchBar, Chips, EmptyState, Badge,
  ProductCard, ProjectCard, ProcessSteps, ContactDetails, EnquiryForm,
} from "./ui.jsx";

const published = (data) => data.products.filter((p) => p.published);

/* ================= HOME ================= */
export function Home() {
  const { data } = useApp();
  const h = data.home;
  const featured = published(data).filter((p) => p.featured).slice(0, 6);
  const projects = data.projects.filter((p) => p.published && p.featured).slice(0, 3);
  const testimonials = data.testimonials.filter((t) => t.approved && !t.sample);
  const cats = [
    { title: "Premium Food Products", img: data.products.find((p) => p.id === "p1")?.image || IMG.spices, text: "Carefully selected staples, blends and specialty foods.", to: "/products?cat=premium" },
    { title: "Food Manufacturing & Processing", img: IMG.kitchen, text: "Preparation and processing coordinated around your needs.", to: "/manufacturing" },
    { title: "Packaged Beverages", img: IMG.drinks, text: "Ready-to-serve drinks for homes, cafés and venues.", to: "/beverages" },
    { title: "Customized Culinary Solutions", img: IMG.dining, text: "Menus and products shaped for your occasion or project.", to: "/products?cat=culinary" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-deep text-cream">
        <Img src={h.heroImage || data.settings.defaultBanner} alt="Premium plated food presentation" eager className="absolute inset-0 h-full w-full" />
        <div className="hero-veil absolute inset-0" />
        <div className="container-x relative flex min-h-[78vh] flex-col justify-center py-24">
          <p className="eyebrow text-wheat">{h.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.05] md:text-7xl">{h.heroHeading}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">{h.heroText}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Btn to={h.cta1Link} variant="accent">{h.cta1Label} <Icon name="arrow" className="h-4 w-4" /></Btn>
            <Btn to={h.cta2Link} variant="ghost-light">{h.cta2Label}</Btn>
          </div>
          <ul className="mt-12 flex flex-wrap gap-3">
            {lines(h.trust).map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-cream/20 bg-forest-deep/40 px-4 py-2 text-sm backdrop-blur">
                <Icon name="check" className="h-4 w-4 text-wheat" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Intro */}
      <section className="container-x grid items-center gap-12 py-24 md:grid-cols-2">
        <div className="relative">
          <Img src={h.introImage} alt="Chef preparing food in a professional kitchen" className="aspect-[4/5] w-full rounded-3xl" />
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-terracotta px-6 py-5 text-cream shadow-soft md:block">
            <p className="font-serif text-2xl">Mumbai</p><p className="text-xs tracking-widest">ANDHERI · MAHARASHTRA</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">About the company</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-forest md:text-5xl">{h.introHeading}</h2>
          <p className="mt-6 leading-relaxed text-ink/75">{h.introText}</p>
          <p className="mt-4 text-sm text-muted-foreground">{data.company.positioning}</p>
          <Btn to="/about" className="mt-8">Discover Our Company</Btn>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-sage py-24">
        <div className="container-x">
          <SectionHead eyebrow="What we do" title="Four ways we serve food & hospitality" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map((c) => (
              <article key={c.title} className="card group flex flex-col overflow-hidden">
                <Img src={c.img} alt={c.title} className="aspect-[4/3] w-full" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-xl text-forest">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink/70">{c.text}</p>
                  <Btn to={c.to} variant="link" className="mt-4 self-start !px-0">Learn more <Icon name="arrow" className="h-4 w-4" /></Btn>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container-x py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Featured catalogue" title="Featured Products" text="Sample catalogue items for demonstration — confirm availability with our team." />
          <Btn to="/products" variant="outline" className="mb-12 self-start md:self-auto">View All Products</Btn>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProductCard key={p.id} p={p} category={catName(data, p.category)} />)}
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-forest text-cream">
        <div className="container-x py-24">
          <p className="eyebrow text-wheat">Capabilities</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl md:text-5xl">From selection to supply, handled with care</h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {h.capabilities.map((c) => (
              <div key={c.id} className="bg-forest p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-wheat"><Icon name={c.icon} className="h-6 w-6" /></span>
                <h3 className="mt-5 font-serif text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-cream/70">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="container-x py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Portfolio" title="Featured Projects" text="Illustrative project concepts showing how we approach food, beverage and hospitality engagements." />
          <Btn to="/portfolio" variant="outline" className="mb-12 self-start md:self-auto">View Portfolio</Btn>
        </div>
        <div className="grid gap-6 md:grid-cols-3">{projects.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </section>

      {/* Process */}
      <section className="bg-sage py-24">
        <div className="container-x">
          <SectionHead eyebrow="Quality & process" title="A proposed service workflow" text="An outline of how we intend to work with customers — not a certification or guaranteed procedure." />
          <ProcessSteps steps={data.process} />
        </div>
      </section>

      {/* Banner */}
      <section className="container-x py-24">
        <div className="relative overflow-hidden rounded-3xl bg-terracotta px-8 py-16 text-cream md:px-16">
          <h2 className="max-w-2xl font-serif text-3xl md:text-5xl">{h.bannerHeading}</h2>
          <p className="mt-4 max-w-xl text-cream/90">{h.bannerText}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Btn to="/hospitality#requirements" variant="light">Request a Business Consultation</Btn>
            <Btn to="/contact" variant="ghost-light">Contact Our Team</Btn>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="container-x pb-24">
          <SectionHead eyebrow="Testimonials" title="What customers say" center />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="card p-7">
                <blockquote className="font-serif text-lg text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">{t.name} · {t.role}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Contact preview */}
      <section className="bg-card py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 font-serif text-4xl text-forest">{h.contactHeading}</h2>
            <p className="mt-4 mb-8 text-ink/70">{data.company.name}</p>
            <ContactDetails />
          </div>
          <div className="card p-6 md:p-8"><EnquiryForm /></div>
        </div>
      </section>
    </>
  );
}

/* ================= ABOUT ================= */
export function About() {
  const { data } = useApp();
  const c = data.company;
  return (
    <>
      <PageHero eyebrow="About Us" title={c.name} text={c.positioning} image={IMG.restaurant} />
      <section className="container-x grid gap-12 py-20 md:grid-cols-2">
        <div>
          <SectionHead eyebrow="Company overview" title="Who we are" />
          <p className="leading-relaxed text-ink/75">{c.description}</p>
          <p className="mt-4 leading-relaxed text-ink/75">{c.overview}</p>
        </div>
        <Img src={IMG.kitchen} alt="Food preparation" className="aspect-[4/3] w-full rounded-3xl" />
      </section>
      <section className="bg-sage py-20">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {[["Business philosophy", c.philosophy], ["Mission", c.mission], ["Vision", c.vision]].map(([t, x]) => (
            <div key={t} className="card p-8"><p className="eyebrow">{t}</p><p className="mt-4 font-serif text-xl leading-snug text-forest">{x}</p></div>
          ))}
        </div>
      </section>
      <section className="container-x py-20">
        <SectionHead eyebrow="Core values" title="What guides our work" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lines(c.values).map((v, i) => (
            <div key={v} className="flex items-center gap-4 rounded-2xl border border-line bg-card p-5">
              <span className="font-serif text-2xl text-wheat">{String(i + 1).padStart(2, "0")}</span><span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-card py-20">
        <div className="container-x">
          <SectionHead eyebrow="Business categories" title="Our areas of focus" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[...data.categories].sort((a, b) => a.order - b.order).map((cat) => (
              <Link key={cat.id} to={`/products?cat=${cat.id}`} className="rounded-2xl bg-sage p-5 font-serif text-lg text-forest hover:bg-forest hover:text-cream">{cat.name}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container-x py-20">
        <SectionHead eyebrow="Directors / Promoters" title="Leadership" />
        <div className="grid gap-6 md:grid-cols-2">
          {data.team.map((t) => (
            <div key={t.id} className="card flex gap-5 p-6">
              {t.image ? <Img src={t.image} alt={t.name} className="h-20 w-20 shrink-0 rounded-full" /> : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-forest font-serif text-3xl text-cream">{t.name[0]}</span>
              )}
              <div><h3 className="font-serif text-xl text-forest">{t.name}</h3><p className="text-sm text-terracotta">{t.role}</p><p className="mt-2 text-sm text-ink/70">{t.bio}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-sage py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="card p-8"><p className="eyebrow">Our approach to quality</p><p className="mt-4 leading-relaxed text-ink/75">{c.qualityApproach}</p></div>
          <div className="card p-8"><p className="eyebrow">Hospitality & commercial supply</p><p className="mt-4 leading-relaxed text-ink/75">{c.hospitalityFocus}</p></div>
        </div>
      </section>
      <CtaStrip />
    </>
  );
}

function CtaStrip() {
  return (
    <section className="container-x py-20 text-center">
      <h2 className="font-serif text-3xl text-forest md:text-4xl">Have a food or beverage requirement?</h2>
      <p className="mt-3 text-ink/70">Tell us what you need and we'll get back to you.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Btn to="/contact">Contact Us</Btn><Btn to="/products" variant="outline">Browse Products</Btn></div>
    </section>
  );
}

/* ================= PRODUCTS ================= */
function Catalogue({ base, lockedCats, title }) {
  const { data } = useApp();
  const { search } = useRouter();
  const allCats = [...data.categories].sort((a, b) => a.order - b.order).filter((c) => !lockedCats || lockedCats.includes(c.id));
  const [cat, setCat] = useState(search.get("cat") || "all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("az");
  const list = useMemo(() => {
    let l = base.filter((p) => (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
    l = [...l].sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    return l;
  }, [base, cat, q, sort]);
  const clear = () => { setCat("all"); setQ(""); setSort("az"); };
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {allCats.length > 1 && <Chips value={cat} onChange={setCat} options={[{ id: "all", name: "All" }, ...allCats]} />}
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBar value={q} onChange={setQ} placeholder={`Search ${title}`} />
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-40">
            <option value="az">Name A–Z</option><option value="za">Name Z–A</option>
          </select>
        </div>
      </div>
      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} category={catName(data, p.category)} />)}</div>
      ) : (
        <EmptyState title="No products found" text="Try a different search or category." action={<Btn variant="outline" onClick={clear}>Clear filters</Btn>} />
      )}
    </div>
  );
}

export function Products() {
  const { data } = useApp();
  const { search } = useRouter();
  const all = published(data);
  return (
    <>
      <PageHero eyebrow="Products" title="Our Product Catalogue" text="Premium food products, processed items, packaged beverages and culinary solutions. Items shown are sample catalogue entries." image={IMG.spices} />
      <section className="container-x py-16">
        <h2 className="mb-6 font-serif text-2xl text-forest">Featured</h2>
        <div className="mb-16 flex gap-4 overflow-x-auto pb-2">
          {all.filter((p) => p.featured).map((p) => (
            <Link key={p.id} to={`/products/${p.id}`} className="card flex w-72 shrink-0 items-center gap-3 p-3">
              <Img src={p.image} alt={p.name} className="h-16 w-16 rounded-lg" /><span className="font-serif text-forest">{p.name}</span>
            </Link>
          ))}
        </div>
        <Catalogue key={search.get("cat") || "all"} base={all} title="products" />
      </section>
    </>
  );
}

export function ProductDetails({ id }) {
  const { data } = useApp();
  const p = data.products.find((x) => x.id === id && x.published);
  if (!p) return <NotFound />;
  const related = published(data).filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const rows = [["Packaging", p.packaging], ["Available variants", p.variants], ["Storage", p.storage]].filter((r) => r[1]);
  return (
    <>
      <section className="container-x py-12">
        <Link to="/products" className="text-sm text-muted-foreground hover:text-forest">← All products</Link>
        <div className="mt-6 grid gap-12 lg:grid-cols-2">
          <Img src={p.image} alt={p.name} eager className="aspect-square w-full rounded-3xl" />
          <div>
            <p className="eyebrow">{catName(data, p.category)}</p>
            <h1 className="mt-3 font-serif text-4xl text-forest md:text-5xl">{p.name}</h1>
            <div className="mt-4"><Badge>{p.availability}</Badge></div>
            <p className="mt-6 leading-relaxed text-ink/75">{p.description}</p>
            {rows.length > 0 && (
              <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-card">
                {rows.map(([k, v]) => <div key={k} className="grid grid-cols-3 gap-4 p-4 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="col-span-2">{v}</dd></div>)}
              </dl>
            )}
            <p className="mt-4 text-xs text-muted-foreground">Sample catalogue data — please confirm specifications with our team.</p>
            <Btn to="#enquire" className="mt-6" onClick={(e) => { e.preventDefault(); document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" }); }}>Enquire About This Product</Btn>
          </div>
        </div>
      </section>
      <section id="enquire" className="bg-sage py-16">
        <div className="container-x max-w-3xl">
          <h2 className="mb-6 font-serif text-3xl text-forest">Product enquiry</h2>
          <div className="card p-6 md:p-8"><EnquiryForm defaultCategory="Product Enquiry" product={p.name} /></div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="container-x py-16">
          <h2 className="mb-8 font-serif text-3xl text-forest">Related products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ProductCard key={r.id} p={r} category={catName(data, r.category)} />)}</div>
        </section>
      )}
    </>
  );
}

/* ================= MANUFACTURING ================= */
export function Manufacturing() {
  const { data } = useApp();
  const blocks = data.services.filter((s) => s.category === "Manufacturing" && s.visible);
  return (
    <>
      <PageHero eyebrow="Food Manufacturing & Processing" title="Thoughtful preparation, from ingredient to package" text="Our manufacturing and processing focus is built around understanding each product and the people it serves." image={IMG.kitchen} />
      <section className="container-x space-y-20 py-20">
        {blocks.map((b, i) => (
          <div key={b.id} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <Img src={b.image} alt={b.title} className="aspect-[4/3] w-full rounded-3xl" />
            <div>
              <span className="font-serif text-5xl text-wheat">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-2 font-serif text-3xl text-forest">{b.title}</h2>
              <p className="mt-4 leading-relaxed text-ink/75">{b.description}</p>
              <Btn to="/contact#enquiry" variant="link" className="mt-4 !px-0">Enquire about this <Icon name="arrow" className="h-4 w-4" /></Btn>
            </div>
          </div>
        ))}
      </section>
      <CtaStrip />
    </>
  );
}

/* ================= BEVERAGES ================= */
export function Beverages() {
  const { data } = useApp();
  const bev = published(data).filter((p) => p.category === "beverages");
  const groups = ["Ready-to-Serve Beverages", "Packaged Drinks", "Customized Beverage Requirements", "Hospitality Beverage Supply"];
  return (
    <>
      <PageHero eyebrow="Packaged Beverages" title="Refreshing beverages, thoughtfully packaged" text="Demonstration catalogue — sample beverage products shown for illustration." image={IMG.drinks} />
      <section className="container-x py-16">
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => <div key={g} className="rounded-2xl bg-sage p-6"><Icon name="bottle" className="h-6 w-6 text-terracotta" /><h3 className="mt-3 font-serif text-lg text-forest">{g}</h3></div>)}
        </div>
        <Catalogue base={bev} lockedCats={["beverages"]} title="beverages" />
      </section>
      <section className="bg-sage py-16">
        <div className="container-x max-w-3xl"><h2 className="mb-6 font-serif text-3xl text-forest">Beverage enquiry</h2><div className="card p-6 md:p-8"><EnquiryForm defaultCategory="Packaged Beverages" /></div></div>
      </section>
    </>
  );
}

/* ================= HOSPITALITY ================= */
export function Hospitality() {
  const { data } = useApp();
  const services = data.services.filter((s) => s.category === "Hospitality" && s.visible);
  return (
    <>
      <PageHero eyebrow="Hospitality Solutions" title="Food & beverage support for homes and hospitality" text="Residential and commercial culinary requirements, coordinated end to end." image={IMG.dining} />
      <section className="container-x py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.id} className="card overflow-hidden">
              <Img src={s.image} alt={s.title} className="aspect-[16/10] w-full" />
              <div className="p-6"><h3 className="font-serif text-xl text-forest">{s.title}</h3><p className="mt-2 text-sm text-ink/70">{s.description}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section id="requirements" className="bg-sage py-20">
        <div className="container-x max-w-4xl">
          <SectionHead eyebrow="Business requirement form" title="Tell us about your project" />
          <div className="card p-6 md:p-8"><RequirementForm /></div>
        </div>
      </section>
    </>
  );
}

function RequirementForm() {
  const { addEnquiry } = useApp();
  const blank = { name: "", company: "", email: "", phone: "", projectType: "Commercial Hospitality", needs: "", quantity: "", timeline: "", extra: "" };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Contact person is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) er.email = "Enter a valid email.";
    if (!/^\+?[0-9\s-]{8,16}$/.test(f.phone.trim())) er.phone = "Enter a valid phone number.";
    if (!f.needs.trim()) er.needs = "Please describe required products or services.";
    setErr(er);
    if (Object.keys(er).length) return;
    const item = addEnquiry({
      name: f.name, company: f.company, email: f.email, phone: f.phone, category: "Hospitality Project",
      subject: `${f.projectType} requirement`,
      message: `Needs: ${f.needs}\nQuantity: ${f.quantity || "-"}\nTimeline: ${f.timeline || "-"}\nNotes: ${f.extra || "-"}`,
    });
    setDone(item.id); setF(blank);
  };
  if (done) return (
    <div><p className="flex items-center gap-2 font-semibold text-forest"><Icon name="check" /> Requirement saved — reference {done}</p>
      <p className="mt-2 text-sm text-ink/70">Demo mode: stored locally in this browser only; not sent to the company inbox.</p>
      <Btn variant="ghost" className="mt-4" onClick={() => setDone(null)}>Submit another</Btn></div>
  );
  const F = ({ k, label, req, type = "text" }) => null;
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      {[["name", "Contact person", true], ["company", "Company / organization"], ["email", "Email", true], ["phone", "Phone", true]].map(([k, l, r]) => (
        <label key={k} className="block"><span className="mb-1.5 block text-sm font-medium">{l}{r && <span className="text-terracotta"> *</span>}</span>
          <input className="input" value={f[k]} onChange={set(k)} />{err[k] && <span className="mt-1 block text-xs text-destructive">{err[k]}</span>}</label>
      ))}
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Project type</span>
        <select className="input" value={f.projectType} onChange={set("projectType")}>
          {["Residential Culinary", "Commercial Hospitality", "Event / Catering", "Bulk Supply", "Beverage Supply", "Other"].map((o) => <option key={o}>{o}</option>)}
        </select></label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Approximate quantity</span><input className="input" value={f.quantity} onChange={set("quantity")} /></label>
      <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium">Required products or services <span className="text-terracotta">*</span></span>
        <input className="input" value={f.needs} onChange={set("needs")} />{err.needs && <span className="mt-1 block text-xs text-destructive">{err.needs}</span>}</label>
      <label className="block"><span className="mb-1.5 block text-sm font-medium">Required timeline</span><input className="input" value={f.timeline} onChange={set("timeline")} placeholder="e.g. within 4 weeks" /></label>
      <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium">Additional requirements</span><textarea rows={3} className="input" value={f.extra} onChange={set("extra")} /></label>
      <p className="text-xs text-muted-foreground sm:col-span-2">Demo website: submissions are stored only in this browser.</p>
      <Btn type="submit" className="sm:col-span-2 sm:justify-self-start">Submit Requirement</Btn>
    </form>
  );
}

/* ================= PORTFOLIO ================= */
const PCATS = ["Food Product Portfolio", "Beverage Solutions", "Hospitality Projects", "Customized Culinary Solutions", "Packaging & Presentation"];
export function Portfolio() {
  const { data } = useApp();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const all = data.projects.filter((p) => p.published);
  const list = all.filter((p) => (cat === "all" || p.category === cat) && (p.title + p.tags + p.summary).toLowerCase().includes(q.toLowerCase()));
  const featured = all.find((p) => p.featured);
  return (
    <>
      <PageHero eyebrow="Portfolio" title="Projects & concepts" text="Illustrative sample projects — they do not represent named real clients." image={IMG.buffet} />
      <section className="container-x py-16">
        {featured && (
          <Link to={`/portfolio/${featured.id}`} className="card mb-14 grid overflow-hidden md:grid-cols-2">
            <Img src={featured.image} alt={featured.title} className="aspect-[4/3] h-full w-full" />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="eyebrow">Featured · {featured.category}</p>
              <h2 className="mt-3 font-serif text-3xl text-forest">{featured.title}</h2>
              <p className="mt-3 text-ink/70">{featured.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1 font-medium text-terracotta">View project <Icon name="arrow" className="h-4 w-4" /></span>
            </div>
          </Link>
        )}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips value={cat} onChange={setCat} options={[{ id: "all", name: "All" }, ...PCATS.map((c) => ({ id: c, name: c }))]} />
          <SearchBar value={q} onChange={setQ} placeholder="Search projects" />
        </div>
        {list.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
          : <EmptyState title="No projects found" action={<Btn variant="outline" onClick={() => { setCat("all"); setQ(""); }}>Clear filters</Btn>} />}
      </section>
    </>
  );
}
export { PCATS };

export function ProjectDetails({ id }) {
  const { data } = useApp();
  const p = data.projects.find((x) => x.id === id && x.published);
  if (!p) return <NotFound />;
  const related = data.projects.filter((x) => x.published && x.id !== p.id && x.category === p.category).concat(data.projects.filter((x) => x.published && x.id !== p.id && x.category !== p.category)).slice(0, 3);
  return (
    <>
      <section className="container-x py-12">
        <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-forest">← Portfolio</Link>
        <p className="eyebrow mt-8">{p.category}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-forest md:text-6xl">{p.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2"><Badge tone="badge-wheat">{p.status}</Badge>{lines((p.tags || "").replace(/,/g, "\n")).map((t) => <Badge key={t} tone="badge-green">{t}</Badge>)}</div>
        <Img src={p.image} alt={p.title} eager className="mt-10 aspect-[21/9] w-full rounded-3xl" />
        <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
          <div><p className="text-lg leading-relaxed text-ink/80">{p.description}</p>
            <p className="mt-6 rounded-xl bg-sage p-4 text-sm text-ink/70">This is an illustrative/sample project for demonstration and does not represent a specific real client.</p></div>
          <div className="card h-fit p-6"><h3 className="font-serif text-xl text-forest">Planning something similar?</h3><Btn to="/contact#enquiry" className="mt-4 w-full">Contact Us</Btn></div>
        </div>
      </section>
      {related.length > 0 && <section className="container-x pb-20"><h2 className="mb-8 font-serif text-3xl text-forest">Related projects</h2><div className="grid gap-6 md:grid-cols-3">{related.map((r) => <ProjectCard key={r.id} p={r} />)}</div></section>}
    </>
  );
}

/* ================= QUALITY ================= */
export function QualityProcess() {
  const { data } = useApp();
  return (
    <>
      <PageHero eyebrow="Quality & Process" title="How we intend to work with you" text="A proposed service workflow describing our approach — not an independently verified certification." image={IMG.intro} />
      <section className="container-x py-20"><ProcessSteps steps={data.process} /></section>
      <section className="bg-sage py-20"><div className="container-x max-w-3xl text-center"><p className="eyebrow">Our approach</p><p className="mt-4 font-serif text-2xl leading-snug text-forest">{data.company.qualityApproach}</p></div></section>
      <CtaStrip />
    </>
  );
}

/* ================= CONTACT ================= */
export function Contact() {
  const { data } = useApp();
  const [tab, setTab] = useState("General Business Enquiry");
  const tabs = [["General Business Enquiry", "General"], ["Product Enquiry", "Product"], ["Hospitality Project", "Hospitality Project"]];
  return (
    <>
      <PageHero eyebrow="Contact Us" title="Let's discuss your requirements" text={data.company.name} image={IMG.restaurant} />
      <section id="enquiry" className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="font-serif text-3xl text-forest">{data.company.name}</h2>
          <p className="mt-3 mb-8 text-ink/70">Directors: {data.company.directors}</p>
          <ContactDetails />
          <div className="mt-6 rounded-xl border border-wheat/60 bg-card p-4 text-sm text-ink/70">Demo notice: enquiries submitted here are stored locally in this browser and are <strong>not</strong> sent to the company's email inbox.</div>
        </div>
        <div className="card p-6 md:p-8">
          <div className="mb-6 flex flex-wrap gap-2" role="tablist">
            {tabs.map(([v, l]) => <button key={v} role="tab" aria-selected={tab === v} onClick={() => setTab(v)} className={`chip ${tab === v ? "chip-on" : ""}`}>{l} enquiry</button>)}
          </div>
          <EnquiryForm defaultCategory={tab} />
        </div>
      </section>
    </>
  );
}

/* ================= 404 ================= */
export function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-8xl text-wheat">404</p>
      <h1 className="mt-4 font-serif text-3xl text-forest">This page isn't on the menu</h1>
      <p className="mt-2 text-ink/70">The page you're looking for doesn't exist or has been moved.</p>
      <div className="mt-8 flex gap-3"><Btn to="/">Go home</Btn><Btn to="/products" variant="outline">Browse products</Btn></div>
    </section>
  );
}

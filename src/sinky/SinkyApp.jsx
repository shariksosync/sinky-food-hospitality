import { useEffect } from "react";
import { AppProvider, RouterProvider, useApp, useRouter, matchPath } from "./store.jsx";
import { Header, Footer, Toast, FloatingActions } from "./ui.jsx";
import {
  Home,
  About,
  Products,
  ProductDetails,
  Manufacturing,
  Beverages,
  Hospitality,
  Portfolio,
  ProjectDetails,
  QualityProcess,
  Contact,
  NotFound,
} from "./pages.jsx";

import { AdminLogin } from "./admin/AdminLogin.jsx";
import { AdminLayout } from "./admin/AdminLayout.jsx";
import { AdminDashboard } from "./admin/AdminDashboard.jsx";
import { CompanyProfileAdmin } from "./admin/CompanyProfileAdmin.jsx";
import { HomepageAdmin } from "./admin/HomepageAdmin.jsx";
import { ProductsAdmin } from "./admin/ProductsAdmin.jsx";
import { CategoriesAdmin } from "./admin/CategoriesAdmin.jsx";
import { ServicesAdmin } from "./admin/ServicesAdmin.jsx";
import { PortfolioAdmin } from "./admin/PortfolioAdmin.jsx";
import { GalleryAdmin } from "./admin/GalleryAdmin.jsx";
import { EnquiriesAdmin } from "./admin/EnquiriesAdmin.jsx";
import { TestimonialsAdmin } from "./admin/TestimonialsAdmin.jsx";
import { TeamAdmin } from "./admin/TeamAdmin.jsx";
import { QualityProcessAdmin } from "./admin/QualityProcessAdmin.jsx";
import { NavigationAdmin } from "./admin/NavigationAdmin.jsx";
import { FooterAdmin } from "./admin/FooterAdmin.jsx";
import { SeoAdmin } from "./admin/SeoAdmin.jsx";
import { SettingsAdmin } from "./admin/SettingsAdmin.jsx";

function SeoUpdater() {
  const { path } = useRouter();
  const { data } = useApp();

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Find closest matching SEO metadata
    const seoList = data.seo || [];
    let match = seoList.find((s) => s.id === path);
    if (!match && path.startsWith("/products/")) match = seoList.find((s) => s.id === "/products");
    if (!match && path.startsWith("/portfolio/")) match = seoList.find((s) => s.id === "/portfolio");
    if (!match && path.startsWith("/admin")) {
      document.title = "Admin Portal — Sinky Industries";
      return;
    }

    const defaultTitle = `${data.company.name} — Premium Food & Beverage Solutions`;
    const defaultDesc = data.company.description;

    const title = match?.title || defaultTitle;
    const desc = match?.description || defaultDesc;
    const keywords = match?.keywords || "food manufacturing, beverages, hospitality supply, Mumbai";
    const ogTitle = match?.ogTitle || title;
    const ogDesc = match?.ogDescription || desc;
    const ogImage = match?.image || data.settings.defaultBanner;

    document.title = title;

    const setMeta = (name, val, isProp) => {
      if (!val) return;
      const attr = isProp ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("description", desc, false);
    setMeta("keywords", keywords, false);
    setMeta("og:title", ogTitle, true);
    setMeta("og:description", ogDesc, true);
    setMeta("og:image", ogImage, true);
  }, [path, data.seo, data.company, data.settings]);

  return null;
}

function AdminRouter({ subpath }) {
  const section = subpath.replace(/^\/+/, "") || "dashboard";

  let content = <AdminDashboard />;
  switch (section) {
    case "dashboard":
      content = <AdminDashboard />;
      break;
    case "company":
      content = <CompanyProfileAdmin />;
      break;
    case "homepage":
      content = <HomepageAdmin />;
      break;
    case "products":
      content = <ProductsAdmin />;
      break;
    case "categories":
      content = <CategoriesAdmin />;
      break;
    case "services":
      content = <ServicesAdmin />;
      break;
    case "portfolio":
      content = <PortfolioAdmin />;
      break;
    case "gallery":
      content = <GalleryAdmin />;
      break;
    case "enquiries":
      content = <EnquiriesAdmin />;
      break;
    case "testimonials":
      content = <TestimonialsAdmin />;
      break;
    case "team":
      content = <TeamAdmin />;
      break;
    case "quality-process":
      content = <QualityProcessAdmin />;
      break;
    case "navigation":
      content = <NavigationAdmin />;
      break;
    case "footer":
      content = <FooterAdmin />;
      break;
    case "seo":
      content = <SeoAdmin />;
      break;
    case "settings":
      content = <SettingsAdmin />;
      break;
    default:
      content = <AdminDashboard />;
      break;
  }

  return <AdminLayout activeSection={section}>{content}</AdminLayout>;
}

function SinkyRouter() {
  const { path } = useRouter();
  const { authed } = useApp();

  // Admin Login route
  if (path === "/admin-login") {
    return <AdminLogin />;
  }

  // Admin routes
  if (path === "/admin" || path.startsWith("/admin/")) {
    if (!authed) {
      return <AdminLogin />;
    }
    const subpath = path.slice("/admin".length);
    return <AdminRouter subpath={subpath} />;
  }

  // Public Dynamic Param Routes
  const prodMatch = matchPath("/products/:id", path);
  if (prodMatch) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">
          <ProductDetails id={prodMatch.id} />
        </main>
        <Footer />
      </div>
    );
  }

  const projMatch = matchPath("/portfolio/:id", path);
  if (projMatch) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">
          <ProjectDetails id={projMatch.id} />
        </main>
        <Footer />
      </div>
    );
  }

  // Public Static Pages
  let PageComponent = NotFound;
  switch (path) {
    case "/":
      PageComponent = Home;
      break;
    case "/about":
      PageComponent = About;
      break;
    case "/products":
      PageComponent = Products;
      break;
    case "/manufacturing":
      PageComponent = Manufacturing;
      break;
    case "/beverages":
      PageComponent = Beverages;
      break;
    case "/hospitality":
      PageComponent = Hospitality;
      break;
    case "/portfolio":
      PageComponent = Portfolio;
      break;
    case "/quality-process":
      PageComponent = QualityProcess;
      break;
    case "/contact":
      PageComponent = Contact;
      break;
    default:
      PageComponent = NotFound;
      break;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1">
        <PageComponent />
      </main>
      <Footer />
    </div>
  );
}

export function SinkyApp() {
  return (
    <AppProvider>
      <RouterProvider>
        <SeoUpdater />
        <SinkyRouter />
        <FloatingActions />
        <Toast />
      </RouterProvider>
    </AppProvider>
  );
}

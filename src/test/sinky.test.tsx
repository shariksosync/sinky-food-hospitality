import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { initialData } from "../sinky/data.js";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../sinky/store.jsx";
import { SinkyApp } from "../sinky/SinkyApp.jsx";
import { ADMIN_SECTIONS } from "../sinky/admin/AdminLayout.jsx";

describe("Sinky Industries Data Integrity", () => {
  it("has realistic preloaded mock data conforming to specifications", () => {
    expect(initialData.company.name).toBe("Sinky Industries Private Limited");
    expect(initialData.company.directors).toContain("Akhilesh Harsh Pandey");
    expect(initialData.company.directors).toContain("Sinky");

    expect(initialData.products.length).toBeGreaterThanOrEqual(12);
    expect(initialData.projects.length).toBeGreaterThanOrEqual(7);
    expect(initialData.process.length).toBe(6);
    expect(initialData.categories.length).toBeGreaterThanOrEqual(5);
    expect(initialData.seo.length).toBeGreaterThanOrEqual(9);
    expect(initialData.nav.some((n) => n.path === "/products" && n.dropdown)).toBe(true);
  });

  it("verifies demo credentials match requirements", () => {
    expect(DEMO_EMAIL).toBe("admin@sinkyindustries.local");
    expect(DEMO_PASSWORD).toBe("SinkyDemo@2026");
  });

  it("contains all 16 required admin management sections", () => {
    const sectionIds = ADMIN_SECTIONS.map((s) => s.id);
    expect(sectionIds).toContain("dashboard");
    expect(sectionIds).toContain("company");
    expect(sectionIds).toContain("homepage");
    expect(sectionIds).toContain("products");
    expect(sectionIds).toContain("categories");
    expect(sectionIds).toContain("services");
    expect(sectionIds).toContain("portfolio");
    expect(sectionIds).toContain("gallery");
    expect(sectionIds).toContain("enquiries");
    expect(sectionIds).toContain("testimonials");
    expect(sectionIds).toContain("team");
    expect(sectionIds).toContain("quality-process");
    expect(sectionIds).toContain("navigation");
    expect(sectionIds).toContain("footer");
    expect(sectionIds).toContain("seo");
    expect(sectionIds).toContain("settings");
    expect(sectionIds.length).toBe(16);
  });
});

describe("Sinky App Rendering & Interactions", () => {
  it("renders homepage with brand mark, hero headline, and products", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    expect(screen.getAllByText(/SINKY INDUSTRIES/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Quality Ingredients\. Exceptional Experiences\./i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Our Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Discuss Your Requirements/i)).toBeInTheDocument();
  });

  it("renders the footer with the Admin Login link", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    const adminLink = screen.getByRole("link", { name: /Admin Login/i });
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute("href", "/admin-login");
  });

  it("renders the navbar with phone number pill button", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    const phoneButtons = screen.getAllByRole("button", { name: /9876543210/i });
    expect(phoneButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("clicking the phone pill button opens the Business Enquiry popup dialog hoisted to document.body with ultra-compact fields", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    const phoneButton = screen.getAllByRole("button", { name: /9876543210/i })[0];
    fireEvent.click(phoneButton);

    const dialog = screen.getByRole("dialog", { name: /Business Enquiry/i });
    expect(dialog).toBeInTheDocument();

    // Verify modal is hoisted directly under document.body outside of <header>
    const header = document.querySelector("header");
    expect(header?.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);

    // Verify removed fields are not in the dialog
    expect(within(dialog).queryByLabelText(/Company name/i)).toBeNull();
    expect(within(dialog).queryByLabelText(/Enquiry category/i)).toBeNull();
    expect(within(dialog).queryByLabelText(/Subject/i)).toBeNull();
    expect(within(dialog).queryByLabelText(/Email/i)).toBeNull();

    // Verify only the 3 compact fields are present
    expect(within(dialog).getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/Message/i)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: /Submit Enquiry/i })).toBeInTheDocument();
  });

  it("renders mobile direct dial button with tel: link", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    const mobileCallLink = screen.getByLabelText("Direct call");
    expect(mobileCallLink).toBeInTheDocument();
    expect(mobileCallLink).toHaveAttribute("href", "tel:+919876543210");
  });

  it("toggles mobile navigation drawer via hamburger button", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    const menuToggle = screen.getByLabelText("Open menu");
    expect(menuToggle).toBeInTheDocument();

    // Click to open mobile menu
    fireEvent.click(menuToggle);
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
    const mobileNav = screen.getByLabelText("Mobile");
    expect(mobileNav).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: "About" })).toBeInTheDocument();

    // Verify sub-items under Products in mobile drawer are clearly visible
    expect(within(mobileNav).getByRole("link", { name: /Food Products/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /Packaged Beverages/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /Customized Culinary Solutions/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /Manufacturing & Processing/i })).toBeInTheDocument();
  });

  it("verifies the top announcement demo bar is completely removed", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    expect(screen.queryByText(/catalogue items and projects shown are illustrative samples/i)).toBeNull();
  });

  it("renders floating WhatsApp and Phone contact buttons vertically stacked in the right corner", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    const quickContact = screen.getByRole("region", { name: /Quick contact/i });
    expect(quickContact).toBeInTheDocument();
    expect(quickContact).toHaveClass("fixed");
    expect(quickContact).toHaveClass("flex-col");

    const waLink = screen.getByRole("link", { name: /Chat on WhatsApp/i });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute("href", expect.stringContaining("https://wa.me/919876543210"));
    expect(waLink).toHaveAttribute("target", "_blank");

    const phoneLink = screen.getByRole("link", { name: /Call Sinky Industries: \+91 9876543210/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute("href", "tel:+919876543210");
  });

  it("renders Products in navbar as a clickable link leading to /products", () => {
    window.history.pushState({}, "", "/");
    render(<SinkyApp />);

    const productsLinks = screen.getAllByRole("link", { name: /Products/i });
    const navProductsLink = productsLinks.find((l) => l.getAttribute("href") === "/products");
    expect(navProductsLink).toBeDefined();
    expect(navProductsLink).toHaveAttribute("href", "/products");
  });
});

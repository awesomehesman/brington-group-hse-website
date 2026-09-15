import {
  createIcons,
  HardHat,
  ShieldCheck,
  Settings,
  Award,
  Files,
  ClipboardCheck,
  GraduationCap,
  Leaf,
  Handshake,
  MapPin,
  MessageCircle,
  Phone,
  Mail,
  Menu,
  Check,
  Clock3,
} from "lucide";
import { setupQuoteForm } from "./quote.js";
export function setupNavigation(doc = document, view = window) {
  const toggle = doc.querySelector(".menu-toggle");
  const nav = doc.querySelector(".site-nav");
  const header = doc.querySelector(".site-header");
  const mobile = view.matchMedia("(max-width: 760px)");
  function setOpen(open, restoreFocus = false) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener("click", () =>
    setOpen(toggle.getAttribute("aria-expanded") !== "true"),
  );
  doc.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    )
      setOpen(false, true);
  });
  doc.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget))
      setOpen(false);
  });
  for (const link of nav.querySelectorAll("a"))
    link.addEventListener("click", () => setOpen(false));
  mobile.addEventListener("change", () => setOpen(false));
  const updateScroll = () =>
    header.classList.toggle("is-scrolled", view.scrollY > 36);
  view.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
  setOpen(false);
}
function initialise() {
  setupQuoteForm(document.querySelector("#contact-form"));
  setupNavigation();
  document.documentElement.classList.add("js");
  createIcons({
    icons: {
      HardHat,
      ShieldCheck,
      Settings,
      Award,
      Files,
      ClipboardCheck,
      GraduationCap,
      Leaf,
      Handshake,
      MapPin,
      MessageCircle,
      Phone,
      Mail,
      Menu,
      Check,
      Clock3,
    },
    attrs: { "aria-hidden": "true", focusable: "false" },
  });
  document.querySelectorAll("[data-service]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const select = document.querySelector("#service");
      select.value = link.dataset.service;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      history.replaceState(null, "", "#quote");
      document.querySelector("#quote").scrollIntoView();
      document.querySelector("#full-name").focus({ preventScroll: true });
    }),
  );
}
if (typeof document !== "undefined" && document.querySelector("#contact-form"))
  initialise();

export const SITE_CONFIG = {
  name: "Manju Web Agency",
  description: "AI-Powered Website Generator & Agency Management SaaS Platform",
  url: "http://localhost:3000",
  links: {
    github: "https://github.com/manju-web-agency",
  },
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const NAVIGATION_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Clients", href: "/clients" },
];

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../i18n/LanguageContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const links = [
    { path: "/", label: t("nav.beranda") },
    { path: "/destinasi", label: t("nav.destinasi") },
    { path: "/tentang", label: t("nav.tentang") },
    { path: "/kontak", label: t("nav.kontak") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <img
            src="/logo.jpg"
            alt="Purwakarta Istimewa"
            className="brand-logo"
          />
          <span className="brand-text">
            Purwakarta <span className="brand-highlight">Wisata</span>
          </span>
        </Link>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={isActive(link.path) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <LanguageSwitcher />
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`hamburger ${menuOpen ? "open" : ""}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

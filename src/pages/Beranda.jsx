import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePublicDestinations } from "../hooks/useDestinations";
import { trackDestinationClick } from "../lib/tracking";
import { useLanguage } from "../i18n/LanguageContext";

/** Hook kecil: menghitung angka dari 0 -> target, sekali, saat elemen masuk viewport */
function useCountUp(target, decimals = 0, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            if (prefersReduced) {
              setValue(target);
              return;
            }
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              setValue(target * eased);
              if (progress < 1) requestAnimationFrame(tick);
              else setValue(target);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, value.toFixed(decimals)];
}

function StatItem({ stat }) {
  const [ref, display] = useCountUp(stat.value, stat.decimals);
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-angka">
        {display}
        {stat.suffix}
      </span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
}

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5.23) % 100}%`,
  delay: `${(i * 0.37) % 5}s`,
  duration: `${3 + ((i * 0.71) % 4)}s`,
  size: `${2 + ((i * 0.43) % 4)}px`,
}));

function Beranda() {
  const { t } = useLanguage();
  /* Data dari DB (ikut admin CRUD); fallback ke statis bila DB kosong/error */
  const { destinasi } = usePublicDestinations();

  const { stats, destinasiPopuler } = useMemo(() => {
    const uniqueKecamatan = new Set(destinasi.map((d) => d.kecamatan)).size;
    const avgRating =
      destinasi.length > 0
        ? destinasi.reduce((sum, d) => sum + (d.rating || 0), 0) / destinasi.length
        : 0;
    return {
      stats: [
        {
          value: destinasi.length,
          decimals: 0,
          suffix: "+",
          label: t("stats.destinations"),
        },
        { value: 1.2, decimals: 1, suffix: "M", label: t("stats.visitors") },
        {
          value: uniqueKecamatan,
          decimals: 0,
          suffix: "",
          label: t("stats.districts"),
        },
        {
          value: parseFloat(avgRating.toFixed(1)),
          decimals: 1,
          suffix: "",
          label: t("stats.rating"),
        },
      ],
      destinasiPopuler: destinasi.slice(0, 3),
    };
  }, [destinasi, t]);

  return (
    <>
      {/* HERO */}
      <section className="hero-section hero-bg">
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>
        <div className="hero-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
              }}
            ></span>
          ))}
        </div>

        <div className="hero-content">
          <p className="hero-subtitle">{t("hero.welcome")}</p>
          <h1 className="hero-title">
            Wisata <span className="text-gradient">Purwakarta</span>
          </h1>
          <p className="hero-desc">{t("hero.desc")}</p>
          <div className="hero-buttons">
            <Link to="/destinasi" className="btn btn-primary">
              {t("hero.explore")}
            </Link>
            <Link to="/tentang" className="btn btn-outline">
              {t("hero.about")}
            </Link>
          </div>
        </div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((s, i) => (
            <StatItem stat={s} key={i} />
          ))}
        </div>
      </section>

      {/* DESTINASI POPULER */}
      <section className="destinasi-section">
        <div className="section-container">
          <div className="section-header">
            <p className="section-subtitle">{t("home.popSub")}</p>
            <h2 className="section-title">{t("home.popTitle")}</h2>
            <p className="section-desc">{t("home.popDesc")}</p>
          </div>

          <div className="destinasi-grid">
            {destinasiPopuler.map((d, i) => {
              const detailTo = `/destinasi/${d.slug}`;
              return (
                <div
                  className="dest-card"
                  key={i}
                  onClick={() => trackDestinationClick(d)}
                >
                  <Link
                    to={detailTo}
                    className="dest-image"
                    aria-label={`Lihat detail ${d.nama}`}
                  >
                    <img src={d.gambar} alt={d.nama} loading="lazy" />
                    <span className="dest-badge">{d.kategori}</span>
                  </Link>
                  <div className="dest-body">
                    <h3 className="dest-name">
                      <Link to={detailTo}>{d.nama}</Link>
                    </h3>
                    <p className="dest-desc">{d.deskripsi}</p>
                    <Link to={detailTo} className="btn btn-sm">
                      {t("home.more")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/destinasi" className="btn btn-primary">
              {t("home.viewAll")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA TENTANG */}
      <section className="cta-section">
        <div className="cta-pattern" aria-hidden="true"></div>
        <div className="section-container">
          <div className="cta-content">
            <h2 className="section-title cta-title">{t("home.ctaTitle")}</h2>
            <p className="section-desc cta-desc">{t("home.ctaDesc")}</p>
            <Link to="/tentang" className="btn btn-primary">
              {t("home.ctaBtn")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Beranda;

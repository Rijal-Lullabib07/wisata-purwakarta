import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

function Tentang() {
  const { t } = useLanguage();

  const sejarahItems = [
    {
      tahun: t("tentang.s1y"),
      judul: t("tentang.s1t"),
      deskripsi: t("tentang.s1d"),
    },
    {
      tahun: t("tentang.s2y"),
      judul: t("tentang.s2t"),
      deskripsi: t("tentang.s2d"),
    },
    {
      tahun: t("tentang.s3y"),
      judul: t("tentang.s3t"),
      deskripsi: t("tentang.s3d"),
    },
    {
      tahun: t("tentang.s4y"),
      judul: t("tentang.s4t"),
      deskripsi: t("tentang.s4d"),
    },
  ];

  const budayaItems = [
    { icon: "🎶", judul: t("tentang.b1t"), deskripsi: t("tentang.b1d") },
    { icon: "🍛", judul: t("tentang.b2t"), deskripsi: t("tentang.b2d") },
    { icon: "🎪", judul: t("tentang.b3t"), deskripsi: t("tentang.b3d") },
    { icon: "🗣️", judul: t("tentang.b4t"), deskripsi: t("tentang.b4d") },
  ];

  return (
    <section className="page-section tentang-page">
      {/* HERO TENTANG */}
      <div className="page-hero page-hero-tentang">
        <div className="section-container">
          <p className="section-subtitle">{t("tentang.heroSub")}</p>
          <h1 className="section-title">Wisata Purwakarta</h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            {t("tentang.heroDesc")}
          </p>
        </div>
      </div>

      {/* FAKTA CEPAT */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-angka">876 km²</span>
            <span className="stat-label">{t("tentang.area")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-angka">1M+</span>
            <span className="stat-label">{t("tentang.population")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-angka">17</span>
            <span className="stat-label">{t("tentang.districts")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-angka">284</span>
            <span className="stat-label">{t("tentang.villages")}</span>
          </div>
        </div>
      </div>

      {/* SEJARAH */}
      <div className="tentang-section">
        <div className="section-container">
          <div className="section-header">
            <p className="section-subtitle">{t("tentang.timelineSub")}</p>
            <h2 className="section-title">{t("tentang.historyTitle")}</h2>
          </div>
          <div className="timeline">
            {sejarahItems.map((item, i) => (
              <div
                className={`timeline-item ${i % 2 === 0 ? "left" : "right"}`}
                key={i}
              >
                <div className="timeline-content">
                  <span className="timeline-year">{item.tahun}</span>
                  <h3 className="timeline-title">{item.judul}</h3>
                  <p className="timeline-desc">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BUDAYA */}
      <div className="tentang-section" style={{ background: "var(--bg-dark)" }}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-subtitle">{t("tentang.budayaSub")}</p>
            <h2 className="section-title">{t("tentang.budayaTitle")}</h2>
            <p className="section-desc">{t("tentang.budayaDesc")}</p>
          </div>
          <div className="budaya-grid">
            {budayaItems.map((item, i) => (
              <div className="budaya-card" key={i}>
                <span className="budaya-icon">{item.icon}</span>
                <h3>{item.judul}</h3>
                <p>{item.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KEUNGGULAN */}
      <div className="tentang-section">
        <div className="section-container tentang-grid">
          <div className="tentang-image">
            <div className="tentang-img-placeholder">
              <img
                src="/bagrond3.jpg"
                alt="Purwakarta"
                className="tentang-feature-photo"
              />
              <div className="tentang-photo-overlay" aria-hidden="true"></div>
            </div>
          </div>
          <div className="tentang-content">
            <p className="section-subtitle">{t("tentang.whySub")}</p>
            <h2 className="section-title">{t("tentang.whyTitle")}</h2>
            <p className="tentang-text">
              {t("tentang.whyText1")} <strong>{t("tentang.whyS1")}</strong>,{" "}
              <strong>{t("tentang.whyS2")}</strong>, {t("tentang.whyAnd")}{" "}
              <strong>{t("tentang.whyS3")}</strong>, {t("tentang.whyText2")}
            </p>
            <div className="tentang-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🌊</span>
                <div>
                  <strong>{t("tentang.h1t")}</strong>
                  <p>{t("tentang.h1d")}</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🎭</span>
                <div>
                  <strong>{t("tentang.h2t")}</strong>
                  <p>{t("tentang.h2d")}</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🌿</span>
                <div>
                  <strong>{t("tentang.h3t")}</strong>
                  <p>{t("tentang.h3d")}</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🏗️</span>
                <div>
                  <strong>{t("tentang.h4t")}</strong>
                  <p>{t("tentang.h4d")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="section-title">{t("tentang.ctaTitle")}</h2>
            <p className="section-desc" style={{ margin: "0 auto 32px" }}>
              {t("tentang.ctaDesc")}
            </p>
            <Link to="/destinasi" className="btn btn-primary">
              {t("tentang.ctaBtn")}
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Tentang;

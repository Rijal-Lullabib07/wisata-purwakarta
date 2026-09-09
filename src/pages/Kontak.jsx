import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

function Kontak() {
  const { t } = useLanguage();
  const kontakInfo = [
    { icon: "📍", judul: t("kontak.addr"), detail: t("kontak.addrDetail") },
    { icon: "📞", judul: t("kontak.phone"), detail: t("kontak.phoneDetail") },
    { icon: "✉️", judul: t("kontak.email"), detail: t("kontak.emailDetail") },
    { icon: "🕐", judul: t("kontak.hours"), detail: t("kontak.hoursDetail") },
  ];
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ nama: "", email: "", subjek: "", pesan: "" });
  };

  return (
    <section className="page-section kontak-page">
      <div className="kontak-hero-strip" aria-hidden="true"></div>

      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">{t("kontak.sub")}</p>
          <h2 className="section-title">{t("kontak.title")}</h2>
          <p className="section-desc">{t("kontak.desc")}</p>
        </div>

        {/* INFO CARDS */}
        <div className="kontak-grid">
          {kontakInfo.map((item, i) => (
            <div className="kontak-card" key={i}>
              <span className="kontak-icon">{item.icon}</span>
              <h3>{item.judul}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>

        {/* FORM + MAP */}
        <div className="kontak-content-grid">
          {/* FORM */}
          <div className="kontak-form-wrapper">
            <h3 className="form-title">{t("kontak.formTitle")}</h3>

            <div className="form-success-slot" aria-live="polite">
              {submitted && (
                <div className="form-success">{t("kontak.success")}</div>
              )}
            </div>

            <form className="kontak-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nama">{t("kontak.fName")}</label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    placeholder={t("kontak.phName")}
                    value={formData.nama}
                    maxLength={80}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t("kontak.fEmail")}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("kontak.phEmail")}
                    value={formData.email}
                    maxLength={254}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subjek">{t("kontak.fSubject")}</label>
                <input
                  type="text"
                  id="subjek"
                  name="subjek"
                  placeholder={t("kontak.phSubject")}
                  value={formData.subjek}
                  maxLength={120}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pesan">{t("kontak.fMessage")}</label>
                <textarea
                  id="pesan"
                  name="pesan"
                  rows="5"
                  placeholder={t("kontak.phMessage")}
                  value={formData.pesan}
                  maxLength={2000}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                {t("kontak.send")}
              </button>
            </form>
          </div>

          {/* MAP PLACEHOLDER */}
          <div className="kontak-map">
            <div className="map-placeholder">
              <span className="map-pin">📍</span>
              <h3>{t("kontak.mapTitle")}</h3>
              <p>Jl. Gandasari No.1, Purwakarta, Jawa Barat 41111</p>
              <a
                href="https://maps.google.com/?q=Purwakarta+Jawa+Barat"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ marginTop: "16px" }}
              >
                {t("kontak.mapBtn")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Kontak;

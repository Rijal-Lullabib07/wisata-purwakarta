import { useState } from "react";

const kontakInfo = [
  {
    icon: "📍",
    judul: "Alamat",
    detail: "Jl. Gandasari No.1, Purwakarta, Jawa Barat 41111",
  },
  { icon: "📞", judul: "Telepon", detail: "+62 264 201 234" },
  { icon: "✉️", judul: "Email", detail: "wisata@purwakartakab.go.id" },
  {
    icon: "🕐",
    judul: "Jam Buka",
    detail: "Senin - Minggu: 08.00 - 17.00 WIB",
  },
];

function Kontak() {
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
          <p className="section-subtitle">Hubungi Kami</p>
          <h2 className="section-title">Kontak & Lokasi</h2>
          <p className="section-desc">
            Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami.
          </p>
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
            <h3 className="form-title">Kirim Pesan</h3>

            <div className="form-success-slot" aria-live="polite">
              {submitted && (
                <div className="form-success">
                  Pesan berhasil dikirim. Kami akan segera merespons.
                </div>
              )}
            </div>

            <form className="kontak-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nama">Nama Lengkap</label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    placeholder="Masukkan nama Anda"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Masukkan email Anda"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subjek">Subjek</label>
                <input
                  type="text"
                  id="subjek"
                  name="subjek"
                  placeholder="Perihal pesan Anda"
                  value={formData.subjek}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pesan">Pesan</label>
                <textarea
                  id="pesan"
                  name="pesan"
                  rows="5"
                  placeholder="Tuliskan pesan Anda di sini..."
                  value={formData.pesan}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Kirim Pesan
              </button>
            </form>
          </div>

          {/* MAP PLACEHOLDER */}
          <div className="kontak-map">
            <div className="map-placeholder">
              <span className="map-pin">📍</span>
              <h3>Peta Lokasi</h3>
              <p>Jl. Gandasari No.1, Purwakarta, Jawa Barat 41111</p>
              <a
                href="https://maps.google.com/?q=Purwakarta+Jawa+Barat"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ marginTop: "16px" }}
              >
                Buka di Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Kontak;

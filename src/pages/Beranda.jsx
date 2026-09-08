import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import destinasi from "../data/destinasi";

const uniqueKecamatan = new Set(destinasi.map(d => d.kecamatan)).size;
const avgRating = (destinasi.reduce((sum, d) => sum + (d.rating || 0), 0) / destinasi.length).toFixed(1);

const stats = [
  { value: destinasi.length, decimals: 0, suffix: "+", label: "Destinasi Wisata" },
  { value: 1.2, decimals: 1, suffix: "M", label: "Wisatawan/Tahun" },
  { value: uniqueKecamatan, decimals: 0, suffix: "", label: "Kecamatan Wisata" },
  { value: parseFloat(avgRating), decimals: 1, suffix: "", label: "Rating Wisata" },
];

const destinasiPopuler = destinasi.slice(0, 3);

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
  duration: `${3 + (i * 0.71) % 4}s`,
  size: `${2 + (i * 0.43) % 4}px`,
}))

function Beranda() {
  return (
    <>
      {/* HERO */}
      <section className="hero-section hero-bg">
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>
        <div className="hero-particles" aria-hidden="true">
          {particles.map((p) => (
            <span key={p.id} className="particle" style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
            }}></span>
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge">🏔️ Kota Istimewa</div>
          <p className="hero-subtitle">✦ Selamat Datang di ✦</p>
          <h1 className="hero-title">
            Purwakarta <span className="text-gradient">Wisata</span>
          </h1>
          <p className="hero-desc">
            Jelajahi keindahan alam, budaya, dan sejarah Kabupaten Purwakarta.
            Dari waduk megah hingga curug tersembunyi — setiap sudut menyimpan cerita.
          </p>
          <div className="hero-buttons">
            <Link to="/destinasi" className="btn btn-primary">Jelajahi Destinasi</Link>
            <Link to="/tentang" className="btn btn-outline">Tentang Purwakarta</Link>
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
            <p className="section-subtitle">Tempat yang wajib dikunjungi</p>
            <h2 className="section-title">Destinasi Populer</h2>
            <p className="section-desc">
              Temukan keindahan alam dan pesona budaya di setiap sudut
              Purwakarta
            </p>
          </div>

          <div className="destinasi-grid">
            {destinasiPopuler.map((d, i) => (
              <div className="dest-card" key={i}>
                <div className="dest-image">
                  <img src={d.gambar} alt={d.nama} loading="lazy" />
                  <span className="dest-badge">{d.kategori}</span>
                </div>
                <div className="dest-body">
                  <h3 className="dest-name">{d.nama}</h3>
                  <p className="dest-desc">{d.deskripsi}</p>
                  <Link to="/destinasi" className="btn btn-sm">
                    Selengkapnya →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/destinasi" className="btn btn-primary">
              Lihat Semua Destinasi
            </Link>
          </div>
        </div>
      </section>

      {/* CTA TENTANG */}
      <section className="cta-section">
        <div className="cta-pattern" aria-hidden="true"></div>
        <div className="section-container">
          <div className="cta-content">
            <h2 className="section-title cta-title">
              Kenali Purwakarta Lebih Dekat
            </h2>
            <p className="section-desc cta-desc">
              Dari keagungan Waduk Jatiluhur hingga kearifan lokal Sunda — ada
              banyak cerita menarik yang menunggu untuk Anda temukan.
            </p>
            <Link to="/tentang" className="btn btn-primary">
              Tentang Purwakarta
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Beranda;

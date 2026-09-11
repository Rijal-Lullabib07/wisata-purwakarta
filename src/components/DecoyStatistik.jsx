import { useEffect, useRef, useState } from "react";
import destinasi from "../data/destinasi";
import { supabase, isSupabaseReady } from "../lib/supabase";

/**
 * Halaman statistik "penyamar".
 *
 * Ditampilkan kepada pengunjung BELUM terotorisasi yang menemukan route admin
 * (/panel-kj29xz*) dan juga dipakai sebagai halaman publik /statistik.
 * Semua angka statis/publik — TIDAK memuat data privat apa pun.
 */

const SUMBER_BPS = "https://purwakartakab.bps.go.id/id";
const SUMBER_TPK =
  "https://purwakartakab.bps.go.id/id/pressrelease/2025/09/02/1087/tingkat-penghunian-kamar--tpk--hotel.html";

function hitungStatistik() {
  const total = destinasi.length;
  const perKategori = {};
  const perKecamatan = {};
  let totalRating = 0;

  for (const d of destinasi) {
    perKategori[d.kategori] = (perKategori[d.kategori] || 0) + 1;
    if (d.kecamatan) perKecamatan[d.kecamatan] = (perKecamatan[d.kecamatan] || 0) + 1;
    if (typeof d.rating === "number") totalRating += d.rating;
  }

  const urut = (obj, n) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

  const topRating = [...destinasi]
    .filter((d) => typeof d.rating === "number")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return {
    total,
    rataRating: Number((totalRating / total).toFixed(2)),
    kategori: urut(perKategori, 8),
    kecamatan: urut(perKecamatan, 8),
    topRating,
    maxKategori: Math.max(...Object.values(perKategori)),
    maxKecamatan: Math.max(...Object.values(perKecamatan)),
  };
}

/** Animasi angka berjalan dari 0 ke target saat elemen terlihat. */
function useCountUp(target, durasi = 1200) {
  const [nilai, setNilai] = useState(0);
  const ref = useRef(null);
  const mulai = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || mulai.current) return;
        mulai.current = true;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / durasi, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setNilai(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durasi]);

  return [ref, nilai];
}

function BarChart({ title, data, max, warna, satuan }) {
  const [ref, terlihat] = useCountUp(1, 900); // dipakai sebagai trigger "sudah terlihat"

  return (
    <div className="ds-chart" ref={ref} style={{ flex: "1 1 300px", minWidth: 280 }}>
      <h3 className="ds-chart-title">
        {title}
        {satuan && <span className="ds-chart-unit"> — {satuan}</span>}
      </h3>
      {data.map(([nama, jumlah], i) => (
        <div key={nama} className="ds-bar-row" style={{ animationDelay: `${i * 90}ms` }}>
          <div className="ds-bar-labels">
            <span>{nama}</span>
            <span className="ds-bar-value">{jumlah}</span>
          </div>
          <div className="ds-bar-track">
            <div
              className="ds-bar-fill"
              style={{
                width: terlihat > 0 ? `${(jumlah / max) * 100}%` : "0%",
                background: `linear-gradient(90deg, ${warna}66, ${warna})`,
                transitionDelay: `${i * 90}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function KartuAngka({ angka, label, animasiAngka, delay }) {
  const [ref, nilai] = useCountUp(animasiAngka ?? 0, 1400);

  const tampil = animasiAngka != null
    ? animasiAngka >= 10
      ? Math.round(nilai).toString()
      : nilai.toFixed(2).replace(".", ",")
    : angka;

  return (
    <div className="ds-card ds-rise" ref={ref} style={{ animationDelay: `${delay}ms` }}>
      <div className="ds-card-angka">{tampil}</div>
      <div className="ds-card-label">{label}</div>
    </div>
  );
}

export default function DecoyStatistik() {
  const stat = hitungStatistik();
  const [bps, setBps] = useState({
    wisnus: { nilai: "389,13 ribu", periode: "Maret 2026" },
    tpk: { nilai: "37,04%", periode: "Juli 2025" },
  });

  // Angka BPS live dari Edge Function (fallback angka statis bila gagal).
  useEffect(() => {
    if (!isSupabaseReady) return;
    supabase.functions
      .invoke("bps-stats")
      .then(({ data }) => {
        if (data?.wisnus?.nilai && data?.tpk?.nilai) setBps(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="page-section ds-page" style={{ paddingTop: 90 }}>
      <style>{`
        @keyframes ds-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes ds-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes ds-float-slow { 0%,100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-16px) rotate(6deg) } }
        @keyframes ds-pulse { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
        @keyframes ds-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        @media (prefers-reduced-motion: reduce) {
          .ds-rise, .ds-bar-row, .ds-planet, .ds-dot { animation: none !important; }
          .ds-bar-fill { transition: none !important; }
        }
        .ds-page { position: relative; overflow: hidden; }
        /* Bingkai konten: sebelumnya full-bleed menempel tepi layar */
        .ds-wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; position: relative; }
        .ds-eyebrow {
          text-align: center; letter-spacing: 3px; font-size: 13px; color: #2dd4a7;
          text-transform: uppercase; animation: ds-rise .7s ease both;
        }
        .ds-title { text-align: center; margin: 8px 0 6px; animation: ds-rise .7s .1s ease both; }
        .ds-subtitle { text-align: center; opacity: .75; margin-bottom: 30px; animation: ds-rise .7s .2s ease both; }
        .ds-deco { position: absolute; pointer-events: none; color: #2dd4a7; opacity: .35; }
        .ds-card {
          flex: 1 1 180px; max-width: 250px; text-align: center; padding: 22px 16px;
          border-radius: 14px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09); position: relative; overflow: hidden;
          transition: transform .25s ease, border-color .25s ease;
        }
        .ds-card:hover { transform: translateY(-4px); border-color: rgba(45,212,167,.45); }
        .ds-card::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(45,212,167,.08) 50%, transparent 70%);
          background-size: 200% 100%; animation: ds-shimmer 3.2s linear infinite;
        }
        .ds-card-angka { font-size: 27px; font-weight: 800; color: #2dd4a7; font-variant-numeric: tabular-nums; }
        .ds-card-label { font-size: 13px; opacity: .75; margin-top: 5px; }
        .ds-rise { animation: ds-rise .7s ease both; }
        .ds-chart-title { font-size: 16px; margin-bottom: 14px; }
        .ds-chart-unit { font-weight: 400; font-size: 12px; opacity: .6; }
        .ds-bar-row { margin-bottom: 11px; animation: ds-rise .6s ease both; }
        .ds-bar-labels { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
        .ds-bar-value { opacity: .7; font-variant-numeric: tabular-nums; }
        .ds-bar-track { height: 8px; border-radius: 4px; background: rgba(255,255,255,0.08); }
        .ds-bar-fill { height: 100%; border-radius: 4px; transition: width .9s cubic-bezier(.22,1,.36,1); }
        .ds-top-card {
          padding: 15px 17px; border-radius: 12px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09); transition: transform .25s ease, border-color .25s ease;
        }
        .ds-top-card:hover { transform: translateY(-3px); border-color: rgba(45,212,167,.4); }
        .ds-source { font-size: 12px; opacity: .6; text-align: center; }
        .ds-source a { color: #2dd4a7; }
        /* ---- Mobile: kartu & bar dirapatkan, tidak memanjang ---- */
        @media (max-width: 600px) {
          .ds-wrap { padding: 0 14px; }
          .ds-page { padding-top: 84px !important; }
          .ds-subtitle { margin-bottom: 20px; }
          .ds-card { flex: 1 1 44%; max-width: none; padding: 14px 10px; }
          .ds-card-angka { font-size: 21px; }
          .ds-card-label { font-size: 11.5px; }
          .ds-chart { min-width: 100% !important; }
          .ds-top-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .ds-top-card { padding: 12px 14px; }
          .ds-source { padding: 0 10px; }
        }
      `}</style>

      {/* dekorasi latar: planet & titik mengapung */}
      <svg className="ds-deco ds-planet" style={{ top: 40, right: "6%", animation: "ds-float-slow 7s ease-in-out infinite" }} width="90" height="60" viewBox="0 0 90 60" fill="none" aria-hidden="true">
        <circle cx="45" cy="30" r="16" stroke="currentColor" strokeWidth="2" opacity=".5" />
        <ellipse cx="45" cy="30" rx="30" ry="8" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="ds-deco ds-planet" style={{ top: 170, left: "4%", animation: "ds-float 5.5s ease-in-out infinite" }} width="70" height="70" viewBox="0 0 70 70" fill="none" aria-hidden="true">
        <circle cx="35" cy="35" r="22" stroke="currentColor" strokeWidth="2" opacity=".4" />
        <circle cx="52" cy="20" r="3" fill="#5b8def" className="ds-dot" style={{ animation: "ds-pulse 2.4s ease-in-out infinite" }} />
      </svg>
      <span className="ds-deco ds-dot" style={{ top: 320, right: "12%", width: 8, height: 8, borderRadius: "50%", background: "#5b8def", animation: "ds-pulse 3s ease-in-out infinite" }} />
      <span className="ds-deco ds-dot" style={{ top: 90, left: "18%", width: 6, height: 6, borderRadius: "50%", background: "#2dd4a7", animation: "ds-pulse 2.2s .8s ease-in-out infinite" }} />

      <div className="ds-wrap">
        <p className="ds-eyebrow">Data Pariwisata</p>
        <h2 className="ds-title">Statistik Wisata Purwakarta</h2>
        <p className="ds-subtitle">
          Gambaran umum potensi pariwisata Kabupaten Purwakarta berdasarkan data publik.
        </p>

        <div className="ds-cards" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 40 }}>
          <KartuAngka angka={bps.wisnus.nilai} label={`Perjalanan Wisnus ke Purwakarta (${bps.wisnus.periode})`} delay={250} />
          <KartuAngka angka={bps.tpk.nilai} label={`Okupansi Hotel / TPK (${bps.tpk.periode})`} delay={350} />
          <KartuAngka animasiAngka={stat.total} label="Destinasi Wisata Terdata" delay={450} />
          <KartuAngka animasiAngka={stat.rataRating} label="Rata-rata Rating Destinasi" delay={550} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 44, marginBottom: 40 }}>
          <BarChart title="Destinasi per Kategori" data={stat.kategori} max={stat.maxKategori} warna="#2dd4a7" />
          <BarChart title="Destinasi per Kecamatan" data={stat.kecamatan} max={stat.maxKecamatan} warna="#5b8def" satuan="terbanyak" />
        </div>

        <h3 className="ds-chart-title ds-rise" style={{ marginBottom: 14 }}>Rating Tertinggi</h3>
        <div className="ds-top-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 40 }}>
          {stat.topRating.map((d, i) => (
            <div key={d.nama} className="ds-top-card ds-rise" style={{ animationDelay: `${600 + i * 90}ms` }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{d.nama}</div>
              <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>
                {d.rating} ★ · {d.ulasan} ulasan · {d.kecamatan}
              </div>
            </div>
          ))}
        </div>

        <p className="ds-source ds-rise" style={{ animationDelay: "1s" }}>
          Sumber:{" "}
          <a href={SUMBER_BPS} target="_blank" rel="noopener noreferrer">
            BPS Kabupaten Purwakarta
          </a>{" "}
          (Wisnus & TPK Hotel),{" "}
          <a href={SUMBER_TPK} target="_blank" rel="noopener noreferrer">
            Rilis TPK Juli 2025
          </a>
          , dan data destinasi situs ini.
        </p>
      </div>
    </section>
  );
}

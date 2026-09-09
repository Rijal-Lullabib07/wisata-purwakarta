import { useEffect, useState } from "react";
import destinasi from "../data/destinasi";
import { supabase, isSupabaseReady } from "../lib/supabase";

/**
 * Halaman statistik "penyamar".
 *
 * Ditampilkan kepada pengunjung BELUM terotorisasi yang menemukan route admin
 * (/panel-kj29xz*). Tujuannya: route tidak terlihat sebagai halaman spesial —
 * pengunjung biasa melihat halaman statistik pariwisata yang wajar, memuat
 * data publik dari situs ini sendiri + angka terverifikasi BPS (bersumber).
 *
 * PENTING: komponen ini TIDAK boleh memuat data privat (klik pengunjung,
 * audit log, dsb.). Semua angka di bawah statis/publik.
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
    rataRating: (totalRating / total).toFixed(2),
    kategori: urut(perKategori, 8),
    kecamatan: urut(perKecamatan, 8),
    topRating,
    maxKategori: Math.max(...Object.values(perKategori)),
    maxKecamatan: Math.max(...Object.values(perKecamatan)),
  };
}

function BarChart({ title, data, max, warna }) {
  return (
    <div style={{ flex: "1 1 300px", minWidth: 280 }}>
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>{title}</h3>
      {data.map(([nama, jumlah]) => (
        <div key={nama} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              marginBottom: 3,
            }}
          >
            <span>{nama}</span>
            <span style={{ opacity: 0.7 }}>{jumlah}</span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: `${(jumlah / max) * 100}%`,
                height: "100%",
                borderRadius: 4,
                background: warna,
              }}
            />
          </div>
        </div>
      ))}
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
    <section className="page-section" style={{ paddingTop: 90 }}>
      <p
        style={{
          textAlign: "center",
          letterSpacing: 2,
          fontSize: 13,
          color: "#2dd4a7",
          textTransform: "uppercase",
        }}
      >
        Data Pariwisata
      </p>
      <h2 style={{ textAlign: "center", marginBottom: 6 }}>
        Statistik Wisata Purwakarta
      </h2>
      <p style={{ textAlign: "center", opacity: 0.75, marginBottom: 28 }}>
        Gambaran umum potensi pariwisata Kabupaten Purwakarta berdasarkan data
        publik.
      </p>

      {/* Kartu angka utama — sumber BPS Kab. Purwakarta (terverifikasi) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
          marginBottom: 36,
        }}
      >
        {[
          { angka: bps.wisnus.nilai, label: `Perjalanan Wisnus ke Purwakarta (${bps.wisnus.periode})` },
          { angka: bps.tpk.nilai, label: `Okupansi Hotel / TPK (${bps.tpk.periode})` },
          { angka: `${stat.total}`, label: "Destinasi Wisata Terdata" },
          { angka: `${stat.rataRating} ★`, label: "Rata-rata Rating Destinasi" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: "1 1 180px",
              maxWidth: 240,
              textAlign: "center",
              padding: "20px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, color: "#2dd4a7" }}>
              {item.angka}
            </div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Grafik sebaran dari data destinasi situs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginBottom: 36 }}>
        <BarChart
          title="Destinasi per Kategori"
          data={stat.kategori}
          max={stat.maxKategori}
          warna="#2dd4a7"
        />
        <BarChart
          title="Destinasi per Kecamatan (terbanyak)"
          data={stat.kecamatan}
          max={stat.maxKecamatan}
          warna="#5b8def"
        />
      </div>

      {/* Destinasi dengan rating tertinggi */}
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Rating Tertinggi</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 36,
        }}
      >
        {stat.topRating.map((d) => (
          <div
            key={d.nama}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>{d.nama}</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>
              {d.rating} ★ · {d.ulasan} ulasan · {d.kecamatan}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, opacity: 0.6, textAlign: "center" }}>
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
    </section>
  );
}

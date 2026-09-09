import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { supabase, isSupabaseReady } from "../lib/supabase";

const HOUR_COLORS = ["#0f172a", "#134e4a", "#065f46", "#059669", "#34d399"];

const STATUS = {
  loading: "loading",
  noConfig: "noconfig",
  error: "error",
  ready: "ready",
};

function StatCard({ label, value, suffix }) {
  return (
    <div className="stat-card">
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">
        {value}
        {suffix}
      </span>
    </div>
  );
}

function HourHeatmap({ data }) {
  const filled = Array.from({ length: 24 }, (_, h) => {
    const row = data.find((d) => d.jam === h);
    return { jam: `${h}:00`, jumlah: row ? row.jumlah : 0 };
  });
  const max = Math.max(1, ...filled.map((d) => d.jumlah));
  return (
    <div className="hour-heatmap" aria-label="Distribusi klik per jam">
      {filled.map((d) => (
        <div
          key={d.jam}
          className="hour-cell-wrap"
          title={`${d.jam} — ${d.jumlah} klik`}
        >
          <div
            className="hour-cell"
            style={{
              height: `${Math.max(6, (d.jumlah / max) * 100)}%`,
              background: d.jumlah
                ? HOUR_COLORS[Math.min(4, Math.floor((d.jumlah / max) * 5))]
                : "rgba(255,255,255,0.06)",
            }}
          ></div>
          <span className="hour-label">{d.jam.replace(":00", "")}</span>
        </div>
      ))}
    </div>
  );
}

function Statistik() {
  const [status, setStatus] = useState(
    isSupabaseReady ? STATUS.loading : STATUS.noConfig,
  );
  const [eda, setEda] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [msg, setMsg] = useState("");
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async (currentSession) => {
      if (!currentSession) {
        if (active) setStatus(STATUS.ready);
        return;
      }
      try {
        const [edaRes, visRes, auditRes] = await Promise.all([
          supabase.rpc("get_click_eda"),
          supabase.rpc("get_visitor_log", { limit_n: 200 }),
          supabase
            .from("admin_audit_logs")
            .select("created_at, ip_address, user_agent, status")
            .order("created_at", { ascending: false })
            .limit(50),
        ]);
        if (edaRes.error) throw edaRes.error;
        if (visRes.error) throw visRes.error;
        if (auditRes.error) throw auditRes.error;
        if (active) {
          setEda(edaRes.data || null);
          setVisitors(visRes.data || []);
          setAuditLogs(auditRes.data || []);
          setStatus(STATUS.ready);
        }
      } catch (err) {
        console.error("[statistik]", err);
        if (active) {
          setMsg(err?.message || "Terjadi kesalahan saat memuat data.");
          setStatus(STATUS.error);
        }
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      load(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        load(nextSession);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthBusy(true);
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMsg(error.message);
    setPassword("");
    setAuthBusy(false);
  }

  // Loading
  if (status === STATUS.loading) {
    return (
      <section className="page-section empty-state" style={{ paddingTop: 200 }}>
        <p>Memuat statistik…</p>
      </section>
    );
  }

  // Belum ada konfigurasi
  if (status === STATUS.noConfig) {
    return (
      <section className="page-section empty-state" style={{ paddingTop: 160 }}>
        <div className="stat-setup">
          <span style={{ fontSize: "2.6rem" }}>📊</span>
          <h2 style={{ margin: "12px 0" }}>Dashboard Statistik Belum Aktif</h2>
          <p style={{ maxWidth: 560, margin: "0 auto 8px" }}>
            Hubungkan Supabase untuk mengaktifkan analytics klik &amp; visitor:
          </p>
          <ol className="stat-setup-list">
            <li>
              Buat project di supabase.com, lalu jalankan file{" "}
              <code>supabase/schema.sql</code> di SQL Editor.
            </li>
            <li>
              Isi <code>VITE_SUPABASE_URL</code> dan{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> pada file <code>.env</code>{" "}
              (contoh di <code>.env.example</code>).
            </li>
            <li>
              Restart dev server, dashboard ini otomatis menampilkan data klik.
            </li>
          </ol>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="page-section empty-state" style={{ paddingTop: 160 }}>
        <div className="stat-setup">
          <span style={{ fontSize: "2.6rem" }}>🔐</span>
          <h2 style={{ margin: "12px 0" }}>Login Admin</h2>
          <p style={{ maxWidth: 560, margin: "0 auto 20px" }}>
            Dashboard statistik dan data visitor hanya dapat diakses oleh akun
            terautentikasi.
          </p>
          <form
            className="kontak-form"
            onSubmit={handleLogin}
            style={{ maxWidth: 360, margin: "0 auto", textAlign: "left" }}
          >
            <div className="form-group">
              <label htmlFor="admin-email">Email admin</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
              />
            </div>
            {msg && (
              <p role="alert" className="form-error">
                {msg}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={authBusy}
            >
              {authBusy ? "Memproses…" : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Error
  if (status === STATUS.error) {
    return (
      <section className="page-section empty-state" style={{ paddingTop: 160 }}>
        <p>Gagal memuat statistik: {msg}</p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>
          Kembali ke Beranda
        </Link>
      </section>
    );
  }

  const total = eda?.total_clicks ?? 0;
  const top5 = eda?.top5 ?? [];
  const daily = eda?.daily_trend ?? [];
  const hourly = eda?.by_hour ?? [];
  const growth = eda?.growth_percent;

  return (
    <section className="page-section statistik-page">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Dashboard Analytics</p>
          <h2 className="section-title">Statistik Klik Destinasi</h2>
          <p className="section-desc">
            Pantau destinasi mana yang paling diminati pengunjung.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => supabase.auth.signOut()}
          >
            Keluar
          </button>
        </div>

        {/* RINGKASAN */}
        <div className="stat-grid">
          <StatCard
            label="Total Klik"
            value={total.toLocaleString("id-ID")}
            suffix=""
          />
          <StatCard
            label="Pengunjung Unik"
            value={eda?.total_visitors?.toLocaleString("id-ID") ?? 0}
            suffix=""
          />
          <StatCard
            label="Destinasi Diklik"
            value={eda?.total_destinations ?? 0}
            suffix=""
          />
          <StatCard
            label="Pertumbuhan Harian"
            value={
              growth === null || growth === undefined
                ? "—"
                : `${growth > 0 ? "+" : ""}${growth}`
            }
            suffix={growth === null || growth === undefined ? "" : "%"}
          />
        </div>

        {/* BAR CHART */}
        <div className="chart-card">
          <h3>Klik per Destinasi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={eda?.by_destination ?? []}
              margin={{ top: 8, right: 8, bottom: 8, left: -12 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="nama"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={tooltipStyle}
              />
              <Bar
                dataKey="klik"
                name="Klik"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="chart-card">
          <h3>Tren Klik Harian</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={daily}
              margin={{ top: 8, right: 8, bottom: 8, left: -12 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="tanggal"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="jumlah"
                name="Klik"
                stroke="#22d3ee"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#22d3ee" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TOP 5 + HEATMAP */}
        <div className="chart-row">
          <div className="chart-card">
            <h3>Destinasi Terpopuler</h3>
            {top5.length === 0 ? (
              <p className="chart-empty">Belum ada data klik.</p>
            ) : (
              <ol className="top5-list">
                {top5.map((t, i) => (
                  <li key={t.nama}>
                    <span className={`top5-rank rank-${i + 1}`}>{i + 1}</span>
                    <span className="top5-name">{t.nama}</span>
                    <span className="top5-val">{t.klik} klik</span>
                    <div className="top5-bar">
                      <div
                        style={{ width: `${(t.klik / top5[0].klik) * 100}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="chart-card">
            <h3>Jam Klik (Heatmap)</h3>
            {hourly.length === 0 ? (
              <p className="chart-empty">Belum ada data klik.</p>
            ) : (
              <HourHeatmap data={hourly} />
            )}
          </div>
        </div>

        {/* VISITOR LOG */}
        <div className="chart-card">
          <h3>Log Pengunjung (Anonim)</h3>
          {visitors.length === 0 ? (
            <p className="chart-empty">Belum ada visitor tercatat.</p>
          ) : (
            <div className="visitor-table-wrap">
              <table className="visitor-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Destinasi</th>
                    <th>Kota</th>
                    <th>Negara</th>
                    <th>Device</th>
                    <th>Browser</th>
                    <th>Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v, i) => (
                    <tr key={i}>
                      <td>
                        {new Date(v.clicked_at).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>{v.destination_name}</td>
                      <td>{v.city || "—"}</td>
                      <td>{v.country || v.country_code || "—"}</td>
                      <td>{v.device_type || "—"}</td>
                      <td>
                        {v.browser
                          ? `${v.browser}${v.os ? " · " + v.os : ""}`
                          : "—"}
                      </td>
                      <td className="visitor-ref">{v.referrer || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3>Riwayat Login Admin</h3>
          {auditLogs.length === 0 ? (
            <p className="chart-empty">Belum ada riwayat login.</p>
          ) : (
            <div className="visitor-table-wrap">
              <table className="visitor-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Status</th>
                    <th>IP</th>
                    <th>Device/Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, index) => (
                    <tr key={`${log.created_at}-${index}`}>
                      <td>
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </td>
                      <td>{log.status}</td>
                      <td>{log.ip_address || "—"}</td>
                      <td className="visitor-ref">{log.user_agent || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const tooltipStyle = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#f1f5f9",
  fontSize: 12,
};

export default Statistik;

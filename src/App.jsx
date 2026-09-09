import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Beranda from "./pages/Beranda";
import Destinasi from "./pages/Destinasi";
import DestinasiDetail from "./pages/DestinasiDetail";
import Tentang from "./pages/Tentang";
import Kontak from "./pages/Kontak";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import "./App.css";

// Dashboard dimuat lazy supaya bundle recharts tidak membebani halaman publik.
const Statistik = lazy(() => import("./pages/Statistik"));

function App() {
  useEffect(() => {
    const routeTitles = {
      "/": "Beranda",
      "/destinasi": "Destinasi Wisata",
      "/tentang": "Tentang Kami",
      "/kontak": "Kontak",
      "/statistik": "Statistik Destinasi",
      "/panel-kj29xz": "Admin",
      "/panel-kj29xz/statistik": "Admin Statistik",
    };
    const path = window.location.pathname;
    document.title = path.startsWith("/destinasi/")
      ? "Detail Destinasi | Purwakarta Istimewa"
      : `${routeTitles[path] || "Halaman"} | Purwakarta Istimewa`;
  });

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/destinasi" element={<Destinasi />} />
          <Route path="/destinasi/:slug" element={<DestinasiDetail />} />
          <Route
            path="/panel-kj29xz/statistik"
            element={
              <AdminRoute>
                <Suspense
                  fallback={
                    <div
                      className="page-section empty-state"
                      style={{ paddingTop: 200 }}
                    >
                      Memuat…
                    </div>
                  }
                >
                  <Statistik />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route path="/panel-kj29xz" element={<AdminLogin />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <section className="page-section empty-state" style={{ paddingTop: 160 }}>
      <h2>404 Not Found</h2>
    </section>
  );
}

export default App;

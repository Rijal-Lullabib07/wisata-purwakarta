import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Admin panel dimuat lazy — tidak membebani bundle halaman publik.
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminDestinations = lazy(() => import("./pages/admin/Destinations"));
const AdminDestinationForm = lazy(() => import("./pages/admin/DestinationForm"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Beranda from "./pages/Beranda";
import Destinasi from "./pages/Destinasi";
import DestinasiDetail from "./pages/DestinasiDetail";
import Tentang from "./pages/Tentang";
import Kontak from "./pages/Kontak";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./components/NotFound";
import DecoyStatistik from "./components/DecoyStatistik";
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
    };
    // Catatan: route admin SENGAJA tidak punya judul khusus — pengunjung yang
    // belum masuk harus melihat judul generik yang sama seperti halaman 404
    // biasa, supaya keberadaan route tidak terdeteksi dari title tab browser.
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
            path="/statistik"
            element={<DecoyStatistik />}
          />
          {/* Login TIDAK dibungkus AdminRoute — justru kebalikannya. */}
          <Route path="/panel-kj29xz/login" element={<AdminLogin />} />
          <Route
            path="/panel-kj29xz"
            element={
              <AdminRoute>
                <Suspense
                  fallback={
                    <div className="page-section empty-state" style={{ paddingTop: 200 }}>Memuat…</div>
                  }
                >
                  <AdminLayout />
                </Suspense>
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="destinasi" element={<AdminDestinations />} />
            <Route path="destinasi/baru" element={<AdminDestinationForm />} />
            <Route path="destinasi/:id/edit" element={<AdminDestinationForm />} />
            <Route path="kategori" element={<AdminCategories />} />
            <Route
              path="statistik"
              element={
                <Suspense fallback={<div className="page-section empty-state" style={{ paddingTop: 200 }}>Memuat…</div>}>
                  <Statistik />
                </Suspense>
              }
            />
          </Route>
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

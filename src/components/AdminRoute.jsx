import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, isSupabaseReady } from "../lib/supabase";
import DecoyStatistik from "./DecoyStatistik";

const IDLE_LIMIT = 15 * 60 * 1000;

function AdminRoute({ children }) {
  const [state, setState] = useState("checking");

  useEffect(() => {
    let active = true;
    async function check() {
      if (!isSupabaseReady) return setState("denied");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return active && setState("denied");
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id, role, mfa_required")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data || data.role !== "admin")
        return active && setState("denied");
      const { data: assurance } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (data.mfa_required && assurance?.currentLevel !== "aal2")
        return active && setState("mfa");
      if (active) setState("allowed");
    }
    check();
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => supabase.auth.signOut(), IDLE_LIMIT);
    };
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    reset();
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, []);

  if (state === "checking")
    return (
      <section className="page-section empty-state" style={{ paddingTop: 200 }}>
        <p>Memeriksa akses…</p>
      </section>
    );
  if (state === "mfa")
    return (
      <Navigate to="/panel-kj29xz/login" replace state={{ mfaRequired: true }} />
    );
  if (state !== "allowed") return <DecoyStatistik />;
  return children;
}

export default AdminRoute;

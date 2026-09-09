import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * `supabase` bernilai null bila env belum diisi, supaya aplikasi tetap jalan
 * (tracking & dashboard menampilkan pesan "belum dikonfigurasi").
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export const isSupabaseReady = Boolean(supabase);

export const TABLES = {
  destinations: "destinations",
  destinationClicks: "destination_clicks",
  adminUsers: "admin_users",
  adminAuditLogs: "admin_audit_logs",
};

export const RPC = {
  clickEda: "get_click_eda",
  dailyTrend: "get_daily_trend",
};

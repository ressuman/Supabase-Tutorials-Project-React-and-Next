import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
  // {
  //   realtime: {
  //     params: {
  //       eventsPerSecond: 10, // optional
  //     },
  //   },
  // }
);

const ws = new WebSocket(
  "wss://nlevmzqejnmausctqhje.supabase.co/realtime/v1/websocket"
);
ws.onerror = console.error;
ws.onopen = () => console.log("✅ WebSocket connection succeeded");

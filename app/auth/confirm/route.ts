import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");

  const type = searchParams.get("type") as EmailOtpType | null;

  const next = searchParams.get("next") ?? "/todos";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }

    // Friendly error messaging
    const message = error.message.toLowerCase();

    let friendlyMessage = "Verification failed. Please try again.";
    if (message.includes("invalid") || message.includes("expired")) {
      friendlyMessage = "This verification link is invalid or has expired.";
    } else if (message.includes("not found")) {
      friendlyMessage = "No valid verification token was found.";
    }

    redirect(`/login?message=${encodeURIComponent(friendlyMessage)}`);
  }

  // redirect the user to an error page with some instructions
  // Fallback for missing query params
  redirect(
    `/login?message=${encodeURIComponent(
      "Missing or invalid verification parameters."
    )}`
  );
}

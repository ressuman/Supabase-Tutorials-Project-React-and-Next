"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { getURL } from "@/utils/helpers";

export async function EmailLogin(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const friendlyMessage = error.message.includes("Invalid login")
      ? "Invalid email or password"
      : "An error occurred. Please try again.";

    redirect(`/login?message=${encodeURIComponent(friendlyMessage)}`);
  }

  revalidatePath("/", "layout");
  redirect("/todos");
}

export async function EmailSignup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    const message = error.message.toLowerCase() ?? "";

    let friendlyMessage = "An error occurred during signup. Please try again.";
    if (
      message.includes("user already registered") ||
      message.includes("email")
    ) {
      friendlyMessage =
        "This email is already in use. Please log in or use another.";
    } else if (message.includes("password")) {
      friendlyMessage = "Your password doesn't meet the security requirements.";
    }

    redirect(`/signup?message=${encodeURIComponent(friendlyMessage)}`);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function SignOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  redirect("/login?message=" + encodeURIComponent("You have been signed out."));
}

export async function OAuthSignIn(provider: Provider) {
  if (!provider) {
    redirect("/login?message=" + encodeURIComponent("No provider selected"));
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getURL("/auth/callback"), // Update to your actual callback URL
    },
  });

  if (error || !data?.url) {
    const friendlyMessage = "OAuth sign-in failed. Please try again.";
    redirect(`/login?message=${encodeURIComponent(friendlyMessage)}`);
  }

  redirect(data.url); // Takes user to OAuth provider (e.g. Google login)
}

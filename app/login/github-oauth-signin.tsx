"use client";

import { Button } from "@/components/ui/button";
import { Provider } from "@supabase/supabase-js";
import { Github } from "lucide-react";
import { OAuthSignIn } from "./action";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};

export default function GithubOauthSignin() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "github",
      displayName: "GitHub",
      icon: <Github className="size-5" />,
    },
  ];

  return (
    <div>
      {oAuthProviders.map((provider, index) => (
        <Button
          key={index}
          type="button"
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
          onClick={async () => {
            await OAuthSignIn(provider.name);
          }}
        >
          {provider.icon}
          Login with {provider.displayName}
        </Button>
      ))}
    </div>
  );
}

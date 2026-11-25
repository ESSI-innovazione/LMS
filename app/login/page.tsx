import type { Metadata } from "next";
import { AnimatedSignIn } from "@/components/ui/sign-in";

export const metadata: Metadata = {
  title: "Accedi – Corsia Sicura",
};

export default function LoginPage() {
  return (
    <main id="contenuto">
      <AnimatedSignIn />
    </main>
  );
}

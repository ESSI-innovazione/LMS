"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Mail, Moon, Sun } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Photos from timevision.it
const PHOTOS = {
  trainer: {
    src: "https://www.timevision.it/wp-content/uploads/2024/09/asian-business-men-trainer-giving-presentation-scaled-1-jpg.webp",
    alt: "Formatore durante una presentazione in aula",
  },
  laptop: {
    src: "https://www.timevision.it/wp-content/uploads/2024/09/2149283319-jpg.webp",
    alt: "Professionista che segue un corso al computer",
  },
  classroom: {
    src: "https://www.timevision.it/wp-content/uploads/2025/01/line-co-workers-meeting-scaled.webp",
    alt: "Partecipanti a una sessione di formazione",
  },
  industry: {
    src: "https://www.timevision.it/wp-content/uploads/2024/09/22869-jpg.webp",
    alt: "Infrastruttura industriale connessa",
  },
};

type Status = { kind: "error" | "info"; text: string } | null;

function italianError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail o password non corretti.";
  if (m.includes("email not confirmed")) return "Devi prima confermare l'indirizzo e-mail.";
  if (m.includes("rate limit") || m.includes("too many")) return "Troppi tentativi. Riprova tra qualche minuto.";
  return "Accesso non riuscito. Riprova o contatta l'assistenza.";
}

const AnimatedSignIn: React.FC = () => {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFormVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const dark = theme === "dark";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setStatus({ kind: "error", text: "Accesso non disponibile: Supabase non è configurato." });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      setStatus({ kind: "error", text: italianError(error.message) });
      return;
    }
    router.push("/");
  };

  const handleMagicLink = async () => {
    setStatus(null);
    if (!email) {
      setStatus({ kind: "error", text: "Inserisci prima il tuo indirizzo e-mail." });
      return;
    }
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setStatus({ kind: "error", text: "Accesso non disponibile: Supabase non è configurato." });
      return;
    }
    setIsSendingLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin, shouldCreateUser: false },
    });
    setIsSendingLink(false);
    setStatus(
      error
        ? { kind: "error", text: italianError(error.message) }
        : { kind: "info", text: `Se l'indirizzo è abilitato, riceverai a breve un link di accesso su ${email}.` },
    );
  };

  const reveal = (delay: string): React.CSSProperties => ({
    transform: formVisible ? "translateY(0)" : "translateY(20px)",
    opacity: formVisible ? 1 : 0,
    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
    transitionDelay: delay,
  });

  const inputClass = cn(
    "block w-full rounded-lg border px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none",
    dark
      ? "border-white/20 bg-white/5 text-white placeholder:text-slate-400"
      : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-500",
  );

  return (
    <div className={cn("min-h-screen w-full transition-colors duration-300", dark ? "bg-[#021722]" : "bg-brand-50")}>
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <div
          className={cn(
            "relative w-full max-w-6xl overflow-hidden rounded-2xl transition-all duration-500",
            dark ? "bg-[#06263a] shadow-xl shadow-black/30" : "bg-white shadow-xl shadow-brand/10",
            formVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <button
            type="button"
            onClick={() => setTheme(dark ? "light" : "dark")}
            className={cn(
              "absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full transition-colors",
              dark ? "bg-white/10 text-brand-orange hover:bg-white/20" : "bg-slate-100 text-brand hover:bg-slate-200",
            )}
            aria-label={dark ? "Passa al tema chiaro" : "Passa al tema scuro"}
          >
            {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left: photo collage from timevision.it */}
            <div className={cn("hidden w-full p-6 md:block md:w-3/5", dark ? "bg-[#021722]" : "bg-slate-100")}>
              <div className="grid h-full min-h-[560px] grid-cols-2 grid-rows-3 gap-4 overflow-hidden">
                <div className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTOS.trainer.src} alt={PHOTOS.trainer.alt} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl bg-brand-orange p-6 text-brand" style={reveal("0.2s")}>
                  <p className="mb-2 font-display text-5xl font-bold">24</p>
                  <p className="text-center text-sm font-medium">episodi, uno al mese per due anni, in due stagioni.</p>
                </div>

                <div className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTOS.laptop.src} alt={PHOTOS.laptop.alt} className="h-full w-full object-cover" />
                </div>

                <div className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTOS.classroom.src} alt={PHOTOS.classroom.alt} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl bg-brand-red p-6 text-white" style={reveal("0.4s")}>
                  <p className="mb-2 font-display text-5xl font-bold">3–10&apos;</p>
                  <p className="text-center text-sm">per episodio, su PC, tablet e smartphone.</p>
                </div>

                <div className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PHOTOS.industry.src} alt={PHOTOS.industry.alt} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            {/* Right: sign-in form */}
            <div
              className={cn("w-full p-8 md:w-2/5 md:p-12", dark ? "text-white" : "text-slate-900")}
              style={{
                transform: formVisible ? "translateX(0)" : "translateX(20px)",
                opacity: formVisible ? 1 : 0,
                transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
              }}
            >
              <div className="mb-10 pr-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dark ? "/brand/timevision-logo-white.svg" : "/brand/timevision-logo.svg"}
                  alt="Time Vision"
                  className="h-9 w-auto"
                />
              </div>

              <div className="mb-8">
                <h1 className={cn("mb-1 font-display text-2xl font-bold", dark ? "text-white" : "text-brand")}>
                  Accedi a <span className={dark ? "text-brand-orange" : "text-brand-orange-ink"}>Corsia Sicura</span>
                </h1>
                <p className={cn("text-sm", dark ? "text-slate-300" : "text-slate-600")}>
                  Cyber Academy: il percorso di consapevolezza sulla sicurezza informatica. Inserisci le tue credenziali aziendali.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className={cn("block text-sm font-medium", dark ? "text-slate-200" : "text-slate-700")}>
                    Indirizzo e-mail aziendale
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="nome.cognome@azienda.it"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className={cn("block text-sm font-medium", dark ? "text-slate-200" : "text-slate-700")}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(inputClass, "pr-12")}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className={cn(
                        "absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg",
                        dark ? "text-slate-300 hover:text-white" : "text-slate-500 hover:text-brand",
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleMagicLink}
                    className={cn(
                      "text-sm font-medium underline-offset-4 hover:underline",
                      dark ? "text-brand-orange" : "text-brand-orange-ink",
                    )}
                  >
                    Password dimenticata?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex min-h-12 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold shadow-sm transition-all duration-300",
                    dark ? "bg-brand-orange text-brand hover:brightness-95" : "bg-brand text-white hover:bg-brand-600",
                    isLoading && "cursor-not-allowed opacity-70",
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <LoaderCircle size={16} aria-hidden="true" className="mr-2 animate-spin" />
                      Accesso in corso...
                    </span>
                  ) : (
                    "Accedi"
                  )}
                </button>

                <div className="relative flex items-center py-1">
                  <div className={cn("flex-grow border-t", dark ? "border-white/15" : "border-slate-300")} />
                  <span className={cn("mx-4 flex-shrink text-xs font-semibold tracking-wide", dark ? "text-slate-400" : "text-slate-500")}>
                    OPPURE
                  </span>
                  <div className={cn("flex-grow border-t", dark ? "border-white/15" : "border-slate-300")} />
                </div>

                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={isSendingLink}
                  className={cn(
                    "flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors",
                    dark ? "border border-white/20 bg-white/5 text-white hover:bg-white/10" : "border border-slate-300 bg-white text-brand hover:bg-slate-50",
                    isSendingLink && "cursor-not-allowed opacity-70",
                  )}
                >
                  {isSendingLink ? (
                    <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
                  ) : (
                    <Mail size={18} aria-hidden="true" />
                  )}
                  Ricevi un link di accesso via e-mail
                </button>

                <div aria-live="polite" className="min-h-6">
                  {status && (
                    <p
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        status.kind === "error"
                          ? "bg-brand-red-50 text-brand-red"
                          : dark
                            ? "bg-white/10 text-white"
                            : "bg-brand-50 text-brand",
                      )}
                    >
                      {status.text}
                    </p>
                  )}
                </div>
              </form>

              <p className={cn("mt-6 text-sm", dark ? "text-slate-300" : "text-slate-600")}>
                Non hai un account? Contatta il referente della formazione della tua struttura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AnimatedSignIn };

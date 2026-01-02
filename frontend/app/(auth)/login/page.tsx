"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";

type FormState = {
  email: string;
  motDePasse: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: authError, isAuthenticated } = useAuth();

  const [form, setForm] = useState<FormState>({ email: "", motDePasse: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const activeError = useMemo(
    () => apiError ?? authError ?? null,
    [apiError, authError]
  );

  const validate = () => {
    const errors: FieldErrors = {};

    if (!form.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Format d'email invalide";
    }

    if (!form.motDePasse.trim()) {
      errors.motDePasse = "Le mot de passe est requis";
    } else if (form.motDePasse.trim().length < 6) {
      errors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      await login({ email: form.email.trim(), motDePasse: form.motDePasse });
      toast.success("Connexion réussie", {
        description: "Bienvenue sur ClickMarket",
      });
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Connexion impossible";
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-card shadow-2xl shadow-emerald-200/40 backdrop-blur-lg dark:border-slate-800 dark:shadow-emerald-900/30 lg:grid-cols-2">
        <div className="relative hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-10" aria-hidden>
            <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-0 h-40 w-40 rounded-full bg-emerald-200 blur-3xl" />
          </div>
          <div className="relative space-y-5">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-50/90">
              <ShieldCheck className="size-5" />
              <span>Sécurité et droits</span>
            </div>
            <h2 className="text-3xl font-semibold leading-tight">
              Connectez-vous pour accéder aux fonctionnalités réservées selon
              votre rôle.
            </h2>
            <p className="text-emerald-50/90">
              Les rôles actifs contrôlent l&apos;accès aux espaces Admin,
              Fournisseur ou Client. Votre session est protégée par un jeton
              sécurisé.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Admin
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Fournisseur
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Client
            </Badge>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="mb-8 space-y-2 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Authentification
            </p>
            <h1 className="text-3xl font-semibold text-foreground">
              Connexion
            </h1>
          </div>

          {activeError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Impossible de se connecter</AlertTitle>
              <AlertDescription>{activeError}</AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Connexion avec Google, Facebook, etc. */}
            <div>
              <div className="mt-2 flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="size-5"
                    width={20}
                    height={20}
                  />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Image
                    src="https://www.svgrepo.com/download/448224/facebook.svg"
                    alt="Facebook"
                    className="size-5"
                    width={20}
                    height={20}
                  />
                  Facebook
                </Button>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {" "}
                OU
              </p>
            </div>

            {/* <p className="text-muted-foreground">
              Renseignez vos identifiants pour accéder à votre espace
              personnalisé.
            </p> */}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  aria-invalid={Boolean(fieldErrors.email)}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email ? (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.motDePasse}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        motDePasse: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(fieldErrors.motDePasse)}
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
                {fieldErrors.motDePasse ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.motDePasse}
                  </p>
                ) : null}
              </div>

              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {/* <div
                  className="h-2 w-2 rounded-full bg-emerald-500"
                  aria-hidden
                /> */}
                  {/* <span>Connexion sécurisée par token</span> */}
                </div>
                <Link
                  href="/reset-password"
                  className="font-medium text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-400 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus-visible:ring-emerald-500 cursor-pointer"
              disabled={isLoading || isAuthenticated}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Connexion en cours
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="size-4" aria-hidden />
                </>
              )}
            </Button>
          </form>

          {/* <div className="mt-8 flex items-center gap-2 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
						<ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-300" />
						<p>
							Les droits sont appliqués via le contexte AuthProvider : seules les pages autorisées seront accessibles selon votre rôle.
						</p>
					</div> */}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-400 hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

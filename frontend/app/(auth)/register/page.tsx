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
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

type FormState = {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  confirmMotDePasse: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error: authError, isAuthenticated } = useAuth();

  const [form, setForm] = useState<FormState>({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    confirmMotDePasse: "",
  });
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

    if (!form.nom.trim()) {
      errors.nom = "Le nom est requis";
    } else if (form.nom.trim().length < 2) {
      errors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    if (!form.prenom.trim()) {
      errors.prenom = "Le prénom est requis";
    } else if (form.prenom.trim().length < 2) {
      errors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }

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

    if (!form.confirmMotDePasse.trim()) {
      errors.confirmMotDePasse = "Confirmez votre mot de passe";
    } else if (form.motDePasse !== form.confirmMotDePasse) {
      errors.confirmMotDePasse = "Les mots de passe ne correspondent pas";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      await register({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        motDePasse: form.motDePasse,
        role: "client",
      });

      toast.success("Compte créé avec succès", {
        description: "Vous pouvez maintenant vous connecter",
      });
      router.push("/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-blue-200/40 backdrop-blur-lg dark:border-slate-800 dark:shadow-blue-900/30 lg:grid-cols-2">
        <div className="relative hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-10" aria-hidden>
            <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-0 h-40 w-40 rounded-full bg-blue-200 blur-3xl" />
          </div>
          <div className="relative space-y-5">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-50/90">
              <User className="size-5" />
              <span>Rejoignez-nous</span>
            </div>
            <h2 className="text-3xl font-semibold leading-tight">
              Créez votre compte et accédez à l&apos;univers ClickMarket.
            </h2>
            <p className="text-blue-50/90">
              Inscrivez-vous rapidement pour découvrir nos produits et services.
              Votre compte vous permettra d&apos;accéder à des fonctionnalités
              exclusives selon votre rôle.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Simple
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Gratuit
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Sécurisé
            </Badge>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="mb-8 space-y-2 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              Inscription
            </p>
            <h1 className="text-3xl font-semibold text-foreground">
              Créer un compte
            </h1>
            <p className="text-muted-foreground">
              Remplissez le formulaire pour commencer votre aventure avec
              ClickMarket.
            </p>
          </div>

          {activeError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erreur lors de l&apos;inscription</AlertTitle>
              <AlertDescription>{activeError}</AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Dupont"
                    value={form.nom}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, nom: event.target.value }))
                    }
                    aria-invalid={Boolean(fieldErrors.nom)}
                    className="pl-10"
                    autoComplete="family-name"
                  />
                </div>
                {fieldErrors.nom ? (
                  <p className="text-sm text-destructive">{fieldErrors.nom}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    placeholder="Jean"
                    value={form.prenom}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        prenom: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(fieldErrors.prenom)}
                    className="pl-10"
                    autoComplete="given-name"
                  />
                </div>
                {fieldErrors.prenom ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.prenom}
                  </p>
                ) : null}
              </div>
            </div>

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

            <div className="grid gap-5 sm:grid-cols-2">
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
                    autoComplete="new-password"
                  />
                </div>
                {fieldErrors.motDePasse ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.motDePasse}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmMotDePasse}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        confirmMotDePasse: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(fieldErrors.confirmMotDePasse)}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
                {fieldErrors.confirmMotDePasse ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.confirmMotDePasse}
                  </p>
                ) : null}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isAuthenticated}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Création en cours
                </>
              ) : (
                <>
                  Créer un compte
                  <ArrowRight className="size-4" aria-hidden />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-2 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-blue-600 dark:text-blue-300" />
            <p>
              Vos données sont sécurisées et chiffrées. Nous ne partageons
              jamais vos informations personnelles.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-300"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

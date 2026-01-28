"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

type ResetStep = "email" | "confirmation";

type FormState = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: authLoading, error: authError } = useAuth();

  const [step, setStep] = useState<ResetStep>("email");
  const [form, setForm] = useState<FormState>({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      setStep("confirmation");
    }
  }, [token]);

  const activeError = useMemo(
    () => apiError ?? authError ?? null,
    [apiError, authError],
  );

  const validateEmail = () => {
    const errors: FieldErrors = {};

    if (!form.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Format d'email invalide";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: FieldErrors = {};

    if (!form.newPassword.trim()) {
      errors.newPassword = "Le nouveau mot de passe est requis";
    } else if (form.newPassword.trim().length < 6) {
      errors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!form.confirmPassword.trim()) {
      errors.confirmPassword = "Confirmez votre mot de passe";
    } else if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/request-password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: form.email.trim() }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          (data && (data.message as string | undefined)) ??
            "Erreur lors de la demande.",
        );
      }

      setSuccessMessage(
        "Un lien de réinitialisation a été envoyé à votre email.",
      );
      toast.success("Email envoyé", {
        description:
          "Vérifiez votre boîte mail pour le lien de réinitialisation.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setApiError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    if (!validatePassword()) return;

    if (!token) {
      setApiError("Token manquant. Veuillez recommencer.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          (data && (data.message as string | undefined)) ??
            "Erreur lors de la réinitialisation.",
        );
      }

      setSuccessMessage("Votre mot de passe a été réinitialisé avec succès.");
      toast.success("Succès", {
        description:
          "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue.";
      setApiError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-amber-50 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-amber-200/40 backdrop-blur-lg dark:border-slate-800 dark:shadow-amber-900/30 lg:grid-cols-2">
        <div className="relative hidden bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-10" aria-hidden>
            <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-0 h-40 w-40 rounded-full bg-amber-200 blur-3xl" />
          </div>
          <div className="relative space-y-5">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-50/90">
              <Lock className="size-5" />
              <span>Récupération de compte</span>
            </div>
            <h2 className="text-3xl font-semibold leading-tight">
              Réinitialisez votre mot de passe en toute sécurité.
            </h2>
            <p className="text-amber-50/90">
              Un lien sécurisé sera envoyé à votre adresse email. Suivez les
              instructions pour créer un nouveau mot de passe et reprendre
              l&apos;accès à votre compte.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Sécurisé
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Rapide
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white backdrop-blur"
            >
              Facile
            </Badge>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-10 lg:px-12">
          <div className="mb-8 space-y-2 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
              Assistance
            </p>
            <h1 className="text-3xl font-semibold text-foreground">
              {step === "email"
                ? "Réinitialiser mon mot de passe"
                : "Créer un nouveau mot de passe"}
            </h1>
            <p className="text-muted-foreground">
              {step === "email"
                ? "Entrez votre email pour recevoir un lien de réinitialisation."
                : "Définissez votre nouveau mot de passe."}
            </p>
          </div>

          {successMessage ? (
            <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-300" />
              <AlertTitle className="text-emerald-900 dark:text-emerald-50">
                Succès
              </AlertTitle>
              <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                {successMessage}
              </AlertDescription>
            </Alert>
          ) : null}

          {activeError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{activeError}</AlertDescription>
            </Alert>
          ) : null}

          {step === "email" ? (
            <form
              className="space-y-6"
              onSubmit={handleRequestReset}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-amber-500"
                    aria-hidden
                  />
                  <span>Connexion sécurisée</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Envoi en cours
                  </>
                ) : (
                  <>
                    Envoyer le lien
                    <ArrowRight className="size-4" aria-hidden />
                  </>
                )}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-amber-600 transition-colors hover:text-amber-500 dark:text-amber-300"
              >
                <ArrowLeft className="size-4" />
                Retour à la connexion
              </Link>
            </form>
          ) : (
            <form
              className="space-y-6"
              onSubmit={handleResetPassword}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={form.newPassword}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(fieldErrors.newPassword)}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
                {fieldErrors.newPassword ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.newPassword}
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
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
                {fieldErrors.confirmPassword ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.confirmPassword}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-amber-500"
                    aria-hidden
                  />
                  <span>Sécurisé par token JWT</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Réinitialisation en cours
                  </>
                ) : (
                  <>
                    Réinitialiser le mot de passe
                    <ArrowRight className="size-4" aria-hidden />
                  </>
                )}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-amber-600 transition-colors hover:text-amber-500 dark:text-amber-300"
              >
                <ArrowLeft className="size-4" />
                Retour à la connexion
              </Link>
            </form>
          )}

          <div className="mt-8 flex items-center gap-2 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-amber-600 dark:text-amber-300" />
            <p>
              Vos données sont protégées par un chiffrement de niveau
              entreprise. Ne partagez jamais votre lien de réinitialisation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

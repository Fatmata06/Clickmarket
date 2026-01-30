"use client";

import { Suspense, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CallToActionSection from "@/components/home/CallToActionSection";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-green-50 to-background dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>

      {/* Featured Products */}
      <section id="produits" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Nos{" "}
            <span className="text-green-600 dark:text-green-400">Produits</span>{" "}
            Phares
          </h2>
          <FeaturedProducts />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="page-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Par{" "}
            <span className="text-green-600 dark:text-green-400">
              Catégorie
            </span>
          </h2>
          <CategoriesSection />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 section-accent">
        <div className="page-container">
          <HowItWorks />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="page-container">
          <WhyChooseUs />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 section-muted">
        <div className="page-container">
          <Testimonials />
        </div>
      </section>

      {/* Newsletter */}
      {/* <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section> */}

      <section className="py-4 section-accent">
        <div className="page-container">
          <CallToActionSection />
        </div>
      </section>
    </main>
  );
}

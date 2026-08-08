"use client";
import RegisterForm from "./registerForm";
import Breadcrumbs from "@/components/breadcrumb";

export default function PageContainer() {
  return (
    <div className="flex items-center justify-center relative overflow-hidden bg-primary/3 min-h-[90vh]">
      <div className="absolute top-4 left-4 z-20">
        <Breadcrumbs />
      </div>

      {/* Decorative waves */}
      <svg
        className="absolute top-12 left-16 text-primary/10 hidden md:block"
        width="120"
        height="60"
        viewBox="0 0 120 60"
        fill="none"
      >
        <path
          d="M2 40 C20 10, 40 50, 60 30 S100 10, 118 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="absolute top-48 right-20 text-primary/10 hidden md:block"
        width="100"
        height="50"
        viewBox="0 0 100 50"
        fill="none"
      >
        <path
          d="M2 25 C15 5, 35 45, 50 25 S85 5, 98 25"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Dots */}
      <div className="absolute top-24 right-48 w-3 h-3 rounded-full bg-primary/15 hidden md:block" />
      <div className="absolute bottom-40 left-32 w-2 h-2 rounded-full bg-primary/20 hidden md:block" />
      <div className="absolute top-1/3 left-24 w-4 h-4 rounded-full border-2 border-primary/15 hidden md:block" />

      {/* Decorative dotted boxes */}
      <div className="absolute bottom-24 left-16 w-24 h-32 rounded-lg bg-primary/10 hidden lg:block overflow-hidden">
        <div className="w-full h-full p-3 flex flex-col gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div key={`l-${i}`} className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <div
                  key={`l-${i}-${j}`}
                  className={`w-2 h-2 rounded-full ${(i + j) % 3 === 0 ? "bg-primary/20" : "bg-primary/40"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-20 right-20 w-20 h-28 rounded-lg bg-primary/10 hidden lg:block overflow-hidden">
        <div className="w-full h-full p-2.5 flex flex-col gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={`r-${i}`} className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <div
                  key={`r-${i}-${j}`}
                  className={`w-2 h-2 rounded-full ${(i + j) % 2 === 0 ? "bg-primary/20" : "bg-primary/40"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative card outlines */}
      <div className="absolute top-32 left-40 w-20 h-14 rounded-md border-2 border-primary/10 hidden lg:block">
        <div className="m-2 space-y-1.5">
          <div className="h-1 w-10 bg-primary/10 rounded" />
          <div className="h-1 w-14 bg-primary/10 rounded" />
          <div className="h-1 w-8 bg-primary/10 rounded" />
        </div>
      </div>
      <div className="absolute top-16 right-40 w-16 h-12 rounded-md border-2 border-primary/10 hidden lg:block">
        <div className="m-2 space-y-1.5">
          <div className="h-1 w-8 bg-primary/10 rounded" />
          <div className="h-1 w-10 bg-primary/10 rounded" />
        </div>
      </div>

      {/* Arrow decoration */}
      <svg
        className="absolute bottom-48 left-48 text-primary/15 hidden lg:block"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        <path
          d="M10 40 C15 20, 25 15, 40 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M32 8 L40 10 L36 18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Register Card */}
      <div className="relative z-10 w-full sm:max-w-105! mx-4 sm:bg-(--background) rounded-4xl sm:shadow-xl p-2 sm:p-8 py-14!">
        <RegisterForm />
      </div>
    </div>
  );
}

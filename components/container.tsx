import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-xs md:max-w-2xl mx-auto pt-[20%] md:pt-[10%] pb-16 min-h-screen text-center text-slate-500">
      {children}
    </main>
  );
}

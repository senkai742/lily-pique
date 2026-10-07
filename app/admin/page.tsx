"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate authentication
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50">
        
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg mb-4">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Portal</h1>
          <p className="mt-2 text-sm text-zinc-500">Sign in to manage your store.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="email" 
                required
                defaultValue="admin@lilypique.com"
                className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="password" 
                required
                defaultValue="password123"
                className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" 
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Authenticating..." : "Sign In"}
            {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

      </div>
    </div>
  );
}

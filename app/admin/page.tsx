import { Lock } from "lucide-react";
import LoginForm from "./components/LoginForm";

export default function AdminLogin() {
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

        <LoginForm />

      </div>
    </div>
  );
}

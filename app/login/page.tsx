"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

console.log(data);
console.log(error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Kayıt başarılı.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          VetAI Giriş
        </h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          className="w-full mb-4 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          className="w-full mb-6 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white"
        />

        <button
          onClick={signIn}
          className="w-full bg-cyan-400 text-slate-950 font-bold rounded-xl p-4 mb-3"
        >
          Giriş Yap
        </button>

        <button
          onClick={signUp}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4"
        >
          Kayıt Ol
        </button>
      </div>
    </main>
  );
}
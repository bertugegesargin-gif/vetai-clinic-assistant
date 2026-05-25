"use client";

import { useState } from "react";

export default function Home() {
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [complaint, setComplaint] = useState("");
  const [anamnesis, setAnamnesis] = useState("");
  const [exam, setExam] = useState("");
  const [hemogram, setHemogram] = useState("");
  const [biochemistry, setBiochemistry] = useState("");
  const [xrayReport, setXrayReport] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species,
          breed,
          age,
          sex,
          complaint,
          anamnesis,
          exam,
          hemogram,
          biochemistry,
          xrayReport,
        }),
      });

      const data = await response.json();
      setResult(data.result || "Rapor oluşturulamadı.");
    } catch (error) {
      setResult("Bağlantı hatası: " + String(error));
    }

    setLoading(false);
  }

  function loadDemoCase() {
    setSpecies("Kedi");
    setBreed("Tekir");
    setAge("3");
    setSex("Erkek");
    setComplaint("Halsizlik, iştahsızlık, hareket etmek istememe.");
    setAnamnesis("Hasta son 2 gündür iştahsız. Travma öyküsü net değil. Aşı geçmişi bilinmiyor.");
    setExam("Mukozalar hafif soluk. Dehidrasyon şüphesi var. Ateş bilgisi yok.");
    setHemogram(`WBC: 12.16
Neu#: 8.33
Lym#: 2.95
RBC: 4.92
HGB: 8.2
HCT: 24.1
MCV: 49.0
PLT: 57`);
    setBiochemistry(`ALB: 26.8
TP: 59.1
Ca: 1.42
GLU: 5.70
BUN: 9.37
P: 0.74
ALT: 206
AST: 78
T-BIL: 4.66
CREA: 135
CK: 2045`);
    setXrayReport("Röntgen raporu mevcut değil.");
  }

  function copyReport() {
    navigator.clipboard.writeText(result);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6 hidden lg:block">
          <div className="mb-10">
            <div className="text-2xl font-black tracking-tight">VetAI</div>
            <div className="text-sm text-slate-400 mt-1">Klinik Karar Destek</div>
          </div>

          <nav className="space-y-2 text-sm">
            <div className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-xl px-4 py-3 font-semibold">
              Yeni Vaka
            </div>
            <div className="text-slate-400 rounded-xl px-4 py-3">Geçmiş Vakalar</div>
            <div className="text-slate-400 rounded-xl px-4 py-3">Bilgi Tabanı</div>
            <div className="text-slate-400 rounded-xl px-4 py-3">Makale Kütüphanesi</div>
            <div className="text-slate-400 rounded-xl px-4 py-3">Ayarlar</div>
          </nav>

          <div className="mt-10 rounded-2xl bg-slate-800/70 border border-slate-700 p-4">
            <div className="text-xs text-slate-400">MVP Durumu</div>
            <div className="mt-2 text-green-300 font-bold">Demo Aktif</div>
            <div className="text-xs text-slate-500 mt-2">
              OpenAI bağlantısı hazır. Şu an demo analiz modu çalışıyor.
            </div>
          </div>
        </aside>

        <section className="flex-1 p-6 lg:p-8">
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="text-sm text-cyan-300 font-semibold">
                Veteriner Klinik Paneli
              </div>
              <h1 className="text-4xl font-black mt-1">
                AI Destekli Vaka Analizi
              </h1>
              <p className="text-slate-400 mt-2">
                Kedi ve köpeklerde laboratuvar, anamnez ve görüntüleme raporlarını birlikte değerlendirir.
              </p>
            </div>

            <button
              onClick={loadDemoCase}
              className="bg-cyan-400 text-slate-950 font-bold rounded-xl px-5 py-3"
            >
              Demo Vakayı Yükle
            </button>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <div className="text-xs text-slate-400">Hasta</div>
              <div className="text-2xl font-bold mt-2">{species || "—"}</div>
              <div className="text-sm text-slate-500">{breed || "Irk bilinmiyor"}</div>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
              <div className="text-xs text-slate-400">Yaş / Cinsiyet</div>
              <div className="text-2xl font-bold mt-2">{age || "—"}</div>
              <div className="text-sm text-slate-500">{sex || "Cinsiyet yok"}</div>
            </div>

            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5">
              <div className="text-xs text-red-300">Risk Seviyesi</div>
              <div className="text-2xl font-bold mt-2 text-red-200">Orta-Yüksek</div>
              <div className="text-sm text-red-300/70">Trombosit / CK takibi</div>
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
              <div className="text-xs text-amber-300">Eksik Veri</div>
              <div className="text-2xl font-bold mt-2 text-amber-200">3 Alan</div>
              <div className="text-sm text-amber-300/70">Ateş, kilo, görüntüleme</div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">Vaka Girişi</h2>
                <span className="text-xs bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-slate-400">
                  Kedi / Köpek MVP
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Tür" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
                <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Irk" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
                <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Yaş" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
                <input value={sex} onChange={(e) => setSex(e.target.value)} placeholder="Cinsiyet" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
              </div>

              <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Şikayet" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-20 mt-3" />
              <textarea value={anamnesis} onChange={(e) => setAnamnesis(e.target.value)} placeholder="Anamnez" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-24 mt-3" />
              <textarea value={exam} onChange={(e) => setExam(e.target.value)} placeholder="Fizik muayene bulguları" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-24 mt-3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <textarea value={hemogram} onChange={(e) => setHemogram(e.target.value)} placeholder="Hemogram" className="bg-slate-950 border border-slate-700 rounded-xl p-3 h-44" />
                <textarea value={biochemistry} onChange={(e) => setBiochemistry(e.target.value)} placeholder="Biyokimya" className="bg-slate-950 border border-slate-700 rounded-xl p-3 h-44" />
              </div>

              <textarea value={xrayReport} onChange={(e) => setXrayReport(e.target.value)} placeholder="Röntgen raporu" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-24 mt-3" />

              <button
                onClick={analyze}
                disabled={loading}
                className="w-full mt-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black p-4 rounded-xl"
              >
                {loading ? "AI analiz ediyor..." : "AI Klinik Analiz Oluştur"}
              </button>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">AI Rapor Paneli</h2>
                <button
                  onClick={copyReport}
                  className="text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300"
                >
                  Raporu Kopyala
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <div className="text-xs text-slate-500">Hematoloji</div>
                  <div className="text-lg font-bold text-red-300 mt-1">Riskli</div>
                </div>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <div className="text-xs text-slate-500">Kas Hasarı</div>
                  <div className="text-lg font-bold text-amber-300 mt-1">Şüpheli</div>
                </div>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                  <div className="text-xs text-slate-500">Renal</div>
                  <div className="text-lg font-bold text-green-300 mt-1">Stabil</div>
                </div>
              </div>

              {!result && (
                <div className="border border-dashed border-slate-700 rounded-2xl p-8 text-slate-500 min-h-[420px]">
                  Analiz sonucu burada gösterilecek.
                </div>
              )}

              {result && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 whitespace-pre-wrap leading-relaxed text-slate-200 min-h-[420px]">
                  {result}
                </div>
              )}

              <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-500">
                Klinik uyarı: Bu sistem kesin tanı koymaz. Veteriner hekimin klinik değerlendirmesinin yerine geçmez.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
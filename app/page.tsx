"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SpeciesKey = "kedi" | "kopek";
type Range = { min: number; max: number };
type RangeTable = Record<string, Range>;
type AbnormalRow = [string, number, string, string, string];

const referenceRanges: Record<SpeciesKey, RangeTable> = {
  kedi: {
    WBC: { min: 5.5, max: 19.5 },
    Neu: { min: 2.5, max: 12.5 },
    Lym: { min: 1.5, max: 7.0 },
    Mon: { min: 0.0, max: 0.9 },
    Eos: { min: 0.0, max: 1.5 },
    RBC: { min: 5.0, max: 10.0 },
    HGB: { min: 8.0, max: 15.0 },
    HCT: { min: 24, max: 45 },
    MCV: { min: 39, max: 55 },
    MCH: { min: 12.5, max: 17.5 },
    MCHC: { min: 30, max: 36 },
    RDW: { min: 14, max: 18 },
    PLT: { min: 180, max: 550 },
    MPV: { min: 8, max: 15 },
    ALB: { min: 2.2, max: 3.9 },
    TP: { min: 5.7, max: 8.0 },
    GLOB: { min: 2.8, max: 5.1 },
    GLU: { min: 70, max: 150 },
    BUN: { min: 16, max: 36 },
    CREA: { min: 0.8, max: 2.4 },
    ALT: { min: 10, max: 145 },
    AST: { min: 0, max: 48 },
    ALP: { min: 0, max: 90 },
    GGT: { min: 0, max: 10 },
    CK: { min: 0, max: 315 },
    Ca: { min: 8.2, max: 11.8 },
    P: { min: 2.5, max: 6.8 },
    T_BIL: { min: 0.0, max: 0.4 },
    CHOL: { min: 75, max: 220 },
    AMY: { min: 500, max: 1500 },
    LIP: { min: 0, max: 200 },
  },
  kopek: {
    WBC: { min: 6.0, max: 17.0 },
    Neu: { min: 3.0, max: 11.5 },
    Lym: { min: 1.0, max: 4.8 },
    Mon: { min: 0.2, max: 1.4 },
    Eos: { min: 0.1, max: 1.2 },
    RBC: { min: 5.5, max: 8.5 },
    HGB: { min: 12.0, max: 18.0 },
    HCT: { min: 37, max: 55 },
    MCV: { min: 60, max: 77 },
    MCH: { min: 19, max: 24 },
    MCHC: { min: 32, max: 36 },
    RDW: { min: 11, max: 15 },
    PLT: { min: 200, max: 500 },
    MPV: { min: 7, max: 12 },
    ALB: { min: 2.3, max: 4.0 },
    TP: { min: 5.2, max: 8.2 },
    GLOB: { min: 2.3, max: 5.2 },
    GLU: { min: 70, max: 120 },
    BUN: { min: 7, max: 27 },
    CREA: { min: 0.5, max: 1.8 },
    ALT: { min: 10, max: 125 },
    AST: { min: 0, max: 50 },
    ALP: { min: 20, max: 150 },
    GGT: { min: 0, max: 12 },
    CK: { min: 10, max: 200 },
    Ca: { min: 9.0, max: 11.7 },
    P: { min: 2.5, max: 6.0 },
    T_BIL: { min: 0.0, max: 0.3 },
    CHOL: { min: 110, max: 320 },
    AMY: { min: 300, max: 1100 },
    LIP: { min: 0, max: 180 },
  },
};

export default function Home() {
 const router = useRouter();
 const [user, setUser] = useState<any>(null);  
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [sex, setSex] = useState("");
  const [complaint, setComplaint] = useState("");
  const [anamnesis, setAnamnesis] = useState("");
  const [exam, setExam] = useState("");
  const [hemogram, setHemogram] = useState("");
  const [biochemistry, setBiochemistry] = useState("");
  const [xrayReport, setXrayReport] = useState("");
  const [result, setResult] = useState("");
  const [clinicName, setClinicName] = useState("");
const [doctorName, setDoctorName] = useState("");
const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [savedCases, setSavedCases] = useState<any[]>([]);
  const [activePanel, setActivePanel] = useState("new-case");
  const menuItems = [
  { id: "new-case", label: "Yeni Vaka" },
  { id: "history", label: "Geçmiş Vakalar" },
  { id: "knowledge", label: "Bilgi Tabanı" },
  { id: "library", label: "Makale Kütüphanesi" },
  { id: "settings", label: "Ayarlar" },
];
  useEffect(() => {
  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }

    setUser(data.user);
    const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("user_id", data.user.id)
  .single();

if (profile) {
  setClinicName(profile.clinic_name || "");
  setDoctorName(profile.doctor_name || "");
  setPhone(profile.phone || "");
}
  }

  checkUser();
}, [router]);
  useEffect(() => {
  async function loadCases() {
    if (!user) return;

    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Vakalar yüklenemedi: " + error.message);
      return;
    }

    setSavedCases(data || []);
  }

  loadCases();
}, [user]);

  function getSpeciesKey(): SpeciesKey {
    const value = species.toLowerCase();
    if (value.includes("köpek") || value.includes("kopek")) return "kopek";
    return "kedi";
  }

  function normalizeKey(key: string) {
    if (key === "T-BIL" || key === "TBIL") return "T_BIL";
    if (key === "TC") return "CHOL";
    if (key === "a-AMY" || key === "AMYL" || key === "AMYLASE") return "AMY";
    return key;
  }

  function getReferenceRange(parameter: string) {
    return referenceRanges[getSpeciesKey()][normalizeKey(parameter)];
  }

  function getValue(text: string, key: string) {
    const variants = [key];
    if (key === "T_BIL") variants.push("T-BIL", "TBIL");
    if (key === "CHOL") variants.push("CHOL", "TC");
    if (key === "AMY") variants.push("a-AMY", "AMYL", "AMYLASE");
    if (key === "Neu") variants.push("Neu#", "NEU");
    if (key === "Lym") variants.push("Lym#", "LYM");
    if (key === "Mon") variants.push("Mon#", "MON");
    if (key === "Eos") variants.push("Eos#", "EOS");

    for (const variant of variants) {
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(^|\\n|\\s)${escaped}\\s*:?\\s*([0-9.]+)`, "i");
      const match = text.match(regex);
      if (match) return Number(match[2]);
    }
    return null;
  }

  function getParameterStatus(parameter: string, value: number) {
    const range = getReferenceRange(parameter);
    if (!range) return null;
    if (value < range.min) return "Düşük";
    if (value > range.max) return "Yüksek";
    return "Normal";
  }

  function getAbnormalParameters(): AbnormalRow[] {
    const parameters = [
      { key: "WBC", source: hemogram, meaning: "Lökosit yanıtı" },
      { key: "Neu", source: hemogram, meaning: "Nötrofil yanıtı" },
      { key: "Lym", source: hemogram, meaning: "Lenfosit yanıtı" },
      { key: "Mon", source: hemogram, meaning: "Monosit yanıtı" },
      { key: "Eos", source: hemogram, meaning: "Eozinofil yanıtı" },
      { key: "RBC", source: hemogram, meaning: "Eritrosit değerlendirmesi" },
      { key: "HGB", source: hemogram, meaning: "Anemi değerlendirmesi" },
      { key: "HCT", source: hemogram, meaning: "Hematokrit değerlendirmesi" },
      { key: "MCV", source: hemogram, meaning: "Eritrosit hacmi" },
      { key: "MCH", source: hemogram, meaning: "Eritrosit hemoglobini" },
      { key: "MCHC", source: hemogram, meaning: "Hemoglobin konsantrasyonu" },
      { key: "RDW", source: hemogram, meaning: "Eritrosit dağılımı" },
      { key: "PLT", source: hemogram, meaning: "Trombosit değerlendirmesi" },
      { key: "MPV", source: hemogram, meaning: "Trombosit hacmi" },
      { key: "ALB", source: biochemistry, meaning: "Albumin değerlendirmesi" },
      { key: "TP", source: biochemistry, meaning: "Toplam protein" },
      { key: "GLOB", source: biochemistry, meaning: "Globulin değerlendirmesi" },
      { key: "GLU", source: biochemistry, meaning: "Glukoz değerlendirmesi" },
      { key: "BUN", source: biochemistry, meaning: "Üre azotu / renal değerlendirme" },
      { key: "CREA", source: biochemistry, meaning: "Kreatinin / renal değerlendirme" },
      { key: "ALT", source: biochemistry, meaning: "Hepatoselüler hasar" },
      { key: "AST", source: biochemistry, meaning: "Kas / karaciğer ilişkili" },
      { key: "ALP", source: biochemistry, meaning: "Kolestaz / hepatobilier değerlendirme" },
      { key: "GGT", source: biochemistry, meaning: "Hepatobilier değerlendirme" },
      { key: "CK", source: biochemistry, meaning: "Kas hasarı" },
      { key: "Ca", source: biochemistry, meaning: "Kalsiyum dengesi" },
      { key: "P", source: biochemistry, meaning: "Fosfor dengesi" },
      { key: "T_BIL", source: biochemistry, meaning: "Bilirubin değerlendirmesi" },
      { key: "CHOL", source: biochemistry, meaning: "Kolesterol değerlendirmesi" },
      { key: "AMY", source: biochemistry, meaning: "Amilaz değerlendirmesi" },
      { key: "LIP", source: biochemistry, meaning: "Lipaz değerlendirmesi" },
    ];

    const rows: AbnormalRow[] = [];
    parameters.forEach((param) => {
      const value = getValue(param.source, param.key);
      const range = getReferenceRange(param.key);
      if (value === null || !range) return;
      const status = getParameterStatus(param.key, value);
      if (status && status !== "Normal") {
        rows.push([param.key, value, `${range.min} - ${range.max}`, status, param.meaning]);
      }
    });
    return rows;
  }

  function getRiskSummary() {
    const abnormalCount = getAbnormalParameters().length;
    const plt = getValue(hemogram, "PLT");
    const hgb = getValue(hemogram, "HGB");
    const hct = getValue(hemogram, "HCT");
    const ck = getValue(biochemistry, "CK");
    const crea = getValue(biochemistry, "CREA");
    const bun = getValue(biochemistry, "BUN");

    const hematologyRisk =
      (plt !== null && plt < (getReferenceRange("PLT")?.min ?? 100)) ||
      (hgb !== null && hgb < (getReferenceRange("HGB")?.min ?? 9)) ||
      (hct !== null && hct < (getReferenceRange("HCT")?.min ?? 30));
    const muscleRisk = ck !== null && ck > (getReferenceRange("CK")?.max ?? 315);
    const renalRisk =
      (crea !== null && crea > (getReferenceRange("CREA")?.max ?? 180)) ||
      (bun !== null && bun > (getReferenceRange("BUN")?.max ?? 13.8));

    let generalRisk = "Düşük";
    if (abnormalCount >= 2) generalRisk = "Orta";
    if (abnormalCount >= 4) generalRisk = "Orta-Yüksek";
    if (abnormalCount >= 6) generalRisk = "Yüksek";

    return {
      generalRisk,
      abnormalCount,
      hematology: hematologyRisk ? "Riskli" : "Stabil",
      muscle: muscleRisk ? "Şüpheli" : "Stabil",
      renal: renalRisk ? "Riskli" : "Stabil",
    };
  }

  function getMissingData() {
    const missing = [];
    if (!species) missing.push("Tür");
    if (!breed) missing.push("Irk");
    if (!age) missing.push("Yaş");
    if (!sex) missing.push("Cinsiyet");
    if (!weight) missing.push("Kilo");
    if (!temperature) missing.push("Ateş");
    if (!complaint) missing.push("Şikayet");
    if (!anamnesis) missing.push("Anamnez");
    if (!exam) missing.push("Fizik muayene");
    if (!hemogram) missing.push("Hemogram");
    if (!biochemistry) missing.push("Biyokimya");
    if (!xrayReport) missing.push("Röntgen raporu");
    return missing;
  }

  async function analyze() {
    if (!hemogram && !biochemistry) {
      setResult("Lütfen önce hemogram/biyokimya gir veya laboratuvar dosyası seç.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, breed, age, weight, temperature, sex, complaint, anamnesis, exam, hemogram, biochemistry, xrayReport }),
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
    setWeight("3.8");
    setTemperature("39.7");
    setSex("Erkek");
    setComplaint("Halsizlik, iştahsızlık, hareket etmek istememe.");
    setAnamnesis("Hasta son 2 gündür iştahsız. Travma öyküsü net değil. Aşı geçmişi bilinmiyor.");
    setExam("Mukozalar hafif soluk. Dehidrasyon şüphesi var. Ateş bilgisi yok.");
    setHemogram(`WBC: 12.16\nNeu#: 8.33\nLym#: 2.95\nRBC: 4.92\nHGB: 8.2\nHCT: 24.1\nMCV: 49.0\nPLT: 57`);
    setBiochemistry(`ALB: 26.8\nTP: 59.1\nCa: 1.42\nGLU: 5.70\nBUN: 9.37\nP: 0.74\nALT: 206\nAST: 78\nT-BIL: 4.66\nCREA: 135\nCK: 2045`);
    setXrayReport("Röntgen raporu mevcut değil.");
    setUploadedFileName("");
  }

  function handleLabFile(file: File) {
    setUploadedFileName(file.name);
    setResult("Laboratuvar dosyası seçildi. OCR modülü ayrı geliştirilecek; şimdilik değerleri Hemogram/Biyokimya alanlarına manuel yapıştır.");
  }

async function saveCase() {
  if (!user) {
    alert("Giriş yapman lazım.");
    return;
  }

  const { error } = await supabase.from("cases").insert({
    user_id: user.id,
    species,
    breed,
    age,
    sex,
    complaint,
    hemogram,
    biochemistry,
    result,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const { data } = await supabase
  .from("cases")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

setSavedCases(data || []);
  alert("Vaka kaydedildi.");
}
async function logout() {
  await supabase.auth.signOut();
  router.push("/login");
}
async function saveProfile() {
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      user_id: user.id,
      clinic_name: clinicName,
      doctor_name: doctorName,
      phone,
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profil kaydedildi.");
}
  function copyReport() {
    navigator.clipboard.writeText(result);
  }

  function downloadPDF() {
    window.print();
  }

    const formattedDate = new Date().toLocaleDateString("tr-TR");

  function renderReportLine(line: string, index: number) {
    if (line.startsWith("# ")) {
      return (
        <h2 key={index} className="mt-5 mb-2 text-lg font-bold text-slate-900 border-b pb-1">
          {line.replace("# ", "")}
        </h2>
      );
    }

    if (line.startsWith("- ")) {
      return (
        <div key={index} className="ml-3 text-sm text-slate-700">
          • {line.replace("- ", "")}
        </div>
      );
    }

    return (
      <p key={index} className="text-sm text-slate-700">
        {line}
      </p>
    );
  }
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pdf-report-only hidden">
  <div className="pdf-page">
    <div className="pdf-header">
      <div>
        <h1>{clinicName || "VetAI Klinik Raporu"}</h1>
        <p>{doctorName || "Veteriner Hekim"} {phone ? `• ${phone}` : ""}</p>
      </div>
      <div className="pdf-date">{formattedDate}</div>
    </div>

    <div className="pdf-title">
      <h2>AI Klinik Değerlendirme Raporu</h2>
      <p>{species || "Hasta"} • {breed || "Irk belirtilmedi"} • {age || "Yaş belirtilmedi"} yaş • {sex || "Cinsiyet belirtilmedi"}</p>
    </div>

    <div className="pdf-risk-grid">
      <div>
        <span>Risk Seviyesi</span>
        <strong>{getRiskSummary().generalRisk}</strong>
      </div>
      <div>
        <span>Anormal Parametre</span>
        <strong>{getRiskSummary().abnormalCount}</strong>
      </div>
      <div>
        <span>Hematoloji</span>
        <strong>{getRiskSummary().hematology}</strong>
      </div>
    </div>

    <div className="pdf-section">
      <h3>Anormal Parametreler</h3>
      {getAbnormalParameters().map((row, i) => (
        <div key={i} className="pdf-param-row">
          <b>{row[0]}</b>
          <span>{row[1]}</span>
          <span>{row[2]}</span>
          <span>{row[3]}</span>
        </div>
      ))}
    </div>

    <div className="pdf-section">
      <h3>Klinik Rapor</h3>
      {(result || "Analiz sonucu bulunmuyor.").split("\n").map(renderReportLine)}
    </div>

    <div className="pdf-signature">
      <div>
        <strong>Veteriner Hekim</strong>
        <p>{doctorName || "Ad Soyad"}</p>
      </div>
      <div className="signature-line">İmza / Kaşe</div>
    </div>

    <div className="pdf-footer">
      Bu rapor klinik karar destek amaçlıdır. Kesin tanı yerine geçmez.
    </div>
  </div>
</div>
      <div className="flex min-h-screen">
        <aside className="no-print w-72 bg-slate-900 border-r border-slate-800 p-6 hidden lg:block">
          <div className="mb-10">
            <div className="text-2xl font-black tracking-tight">VetAI</div>
            <div className="text-sm text-slate-400 mt-1">Klinik Karar Destek</div>
          </div>
          <nav className="space-y-2 text-sm">
 <div className="space-y-2">
  {menuItems.map((item) => (
    <button
      key={item.id}
      onClick={() => setActivePanel(item.id)}
      className={
        activePanel === item.id
          ? "w-full text-left bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-xl px-4 py-3 font-semibold"
          : "w-full text-left text-slate-400 rounded-xl px-4 py-3 hover:bg-slate-800"
      }
    >
      {item.label}
    </button>
  ))}
</div>
            <button
  onClick={logout}
  className="w-full text-left text-red-300 rounded-xl px-4 py-3 hover:bg-red-500/10"
>
  Çıkış Yap
</button>
          </nav>
          <div className="mt-10 rounded-2xl bg-slate-800/70 border border-slate-700 p-4">
            <div className="text-xs text-slate-400">MVP Durumu</div>
            <div className="mt-2 text-green-300 font-bold">Stabil Demo Aktif</div>
            <div className="text-xs text-slate-500 mt-2">OCR modülü ayrı fazda geliştirilecek.</div>
          </div>
        </aside>

        <section className="flex-1 p-6 lg:p-8">
          {activePanel === "history" && (
  <div className="mb-6 rounded-2xl bg-slate-900 border border-slate-800 p-6">
    <h2 className="text-2xl font-bold mb-4">Geçmiş Vakalar</h2>

    {savedCases.length === 0 && (
      <div className="text-slate-500">
        Henüz kaydedilmiş vaka yok.
      </div>
    )}


    <div className="space-y-3">
      {savedCases.map((item) => (
        <div
          key={item.id}
          className="rounded-xl bg-slate-950 border border-slate-800 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">
                {item.species || "Tür yok"} / {item.breed || "Irk yok"}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {item.createdAt}
              </div>
            </div>

            <button
              onClick={() => {
                setSpecies(item.species || "");
                setBreed(item.breed || "");
                setAge(item.age || "");
                setSex(item.sex || "");
                setWeight(item.weight || "");
                setTemperature(item.temperature || "");
                setComplaint(item.complaint || "");
                setAnamnesis(item.anamnesis || "");
                setExam(item.exam || "");
                setHemogram(item.hemogram || "");
                setBiochemistry(item.biochemistry || "");
                setXrayReport(item.xrayReport || "");
                setResult(item.result || "");
                setActivePanel("new-case");
              }}
              className="bg-cyan-400 text-slate-950 font-bold rounded-xl px-4 py-2 text-sm"
            >
              Vakayı Aç
            </button>
          </div>

          <div className="text-sm text-slate-400 mt-3">
            {item.complaint || "Şikayet bilgisi yok"}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
{activePanel === "settings" && (
  <div className="mb-6 rounded-2xl bg-slate-900 border border-slate-800 p-6">
    <h2 className="text-2xl font-bold mb-4">
      Klinik Profili
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input
        value={clinicName}
        onChange={(e) => setClinicName(e.target.value)}
        placeholder="Klinik Adı"
        className="bg-slate-950 border border-slate-700 rounded-xl p-3"
      />

      <input
        value={doctorName}
        onChange={(e) => setDoctorName(e.target.value)}
        placeholder="Veteriner Hekim"
        className="bg-slate-950 border border-slate-700 rounded-xl p-3"
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefon"
        className="bg-slate-950 border border-slate-700 rounded-xl p-3"
      />
    </div>

    <button
      onClick={saveProfile}
      className="mt-4 bg-cyan-400 text-slate-950 font-bold rounded-xl px-5 py-3"
    >
      Profili Kaydet
    </button>
  </div>
)}
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="text-sm text-cyan-300 font-semibold">Veteriner Klinik Paneli</div>
              <h1 className="text-4xl font-black mt-1">AI Destekli Vaka Analizi</h1>
              <p className="text-slate-400 mt-2">Kedi ve köpeklerde laboratuvar, anamnez ve görüntüleme raporlarını birlikte değerlendirir.</p>
            </div>
            <button onClick={loadDemoCase} className="bg-cyan-400 text-slate-950 font-bold rounded-xl px-5 py-3">Demo Vakayı Yükle</button>
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
              <div className="text-2xl font-bold mt-2 text-red-200">{getRiskSummary().generalRisk}</div>
              <div className="text-sm text-red-300/70">{getRiskSummary().abnormalCount} anormal parametre</div>
            </div>
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
              <div className="text-xs text-amber-300">Eksik Veri</div>
              <div className="text-2xl font-bold mt-2 text-amber-200">{getMissingData().length} Alan</div>
              <div className="text-sm text-amber-300/70">{getMissingData().length > 0 ? getMissingData().slice(0, 3).join(", ") : "Eksik veri yok"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="no-print rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">Vaka Girişi</h2>
                <span className="text-xs bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-slate-400">Kedi / Köpek MVP</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Tür" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
                <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Irk" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
                <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Yaş" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
                <input value={sex} onChange={(e) => setSex(e.target.value)} placeholder="Cinsiyet" className="bg-slate-950 border border-slate-700 rounded-xl p-3" />
                <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Kilo (kg)" className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-white" />
                <input value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="Ateş (°C)" className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-white" />
              </div>
              <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Şikayet" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-20 mt-3" />
              <textarea value={anamnesis} onChange={(e) => setAnamnesis(e.target.value)} placeholder="Anamnez" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-24 mt-3" />
              <textarea value={exam} onChange={(e) => setExam(e.target.value)} placeholder="Fizik muayene bulguları" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-24 mt-3" />

              <div className="mt-3 rounded-2xl bg-slate-950 border border-slate-700 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm">Laboratuvar Dosyası Yükle</div>
                    <div className="text-xs text-slate-500 mt-1">OCR ayrı modül olarak geliştirilecek. Şimdilik değerleri manuel yapıştır.</div>
                    {uploadedFileName && <div className="mt-3 text-xs text-cyan-300">Seçilen dosya: {uploadedFileName}</div>}
                  </div>
                  <label className="cursor-pointer bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200">
                    Dosya Seç
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleLabFile(file); }} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <textarea value={hemogram} onChange={(e) => setHemogram(e.target.value)} placeholder="Hemogram" className="bg-slate-950 border border-slate-700 rounded-xl p-3 h-44" />
                <textarea value={biochemistry} onChange={(e) => setBiochemistry(e.target.value)} placeholder="Biyokimya" className="bg-slate-950 border border-slate-700 rounded-xl p-3 h-44" />
              </div>
              <textarea value={xrayReport} onChange={(e) => setXrayReport(e.target.value)} placeholder="Röntgen raporu" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 h-24 mt-3" />
              <button onClick={analyze} disabled={loading} className="w-full mt-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black p-4 rounded-xl">{loading ? "AI analiz ediyor..." : "AI Klinik Analiz Oluştur"}</button>
              <button
  onClick={saveCase}
  className="w-full mt-3 bg-slate-800 border border-slate-700 text-slate-200 font-bold p-4 rounded-xl"
>
  Vakayı Kaydet
</button>
            </div>

            <div className="print-report-card rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">AI Rapor Paneli</h2>
                <div className="no-print flex gap-2">
                  <button onClick={copyReport} className="text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300">Raporu Kopyala</button>
                  <button onClick={downloadPDF} className="text-xs bg-cyan-400 text-slate-950 font-bold rounded-xl px-3 py-2">PDF İndir</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4"><div className="text-xs text-slate-500">Hematoloji</div><div className="text-lg font-bold text-red-300 mt-1">{getRiskSummary().hematology}</div></div>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4"><div className="text-xs text-slate-500">Kas Hasarı</div><div className="text-lg font-bold text-amber-300 mt-1">{getRiskSummary().muscle}</div></div>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4"><div className="text-xs text-slate-500">Renal</div><div className="text-lg font-bold text-green-300 mt-1">{getRiskSummary().renal}</div></div>
              </div>
              <div className="mb-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between"><h3 className="font-bold">Anormal Parametreler</h3><span className="text-xs text-slate-500">Otomatik analiz</span></div>
                <div className="divide-y divide-slate-800 text-sm">
                  <div className="grid grid-cols-5 gap-2 px-4 py-3 text-slate-400 font-semibold"><div>Parametre</div><div>Değer</div><div>Referans</div><div>Durum</div><div>Klinik Anlam</div></div>
                  {getAbnormalParameters().length === 0 && <div className="px-4 py-4 text-slate-500">Anormal parametre bulunamadı.</div>}
                  {getAbnormalParameters().map((row, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 px-4 py-3"><div className="font-semibold">{row[0]}</div><div>{row[1]}</div><div className="text-slate-400">{row[2]}</div><div className={row[3] === "Yüksek" ? "text-red-300 font-bold" : "text-amber-300 font-bold"}>{row[3]}</div><div className="text-slate-400">{row[4]}</div></div>
                  ))}
                </div>
              </div>
              {!result && <div className="border border-dashed border-slate-700 rounded-2xl p-8 text-slate-500 min-h-[420px]">Analiz sonucu burada gösterilecek.</div>}
              {result && (
  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden min-h-[420px]">
    <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
      <div>
        <div className="text-xs text-cyan-300 font-semibold">
          VetAI Klinik Karar Destek Raporu
        </div>
        <div className="text-lg font-bold mt-1">
          {species || "Hasta"} • {age || "Yaş belirtilmedi"} yaş
        </div>
      </div>

      <div className="text-xs rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 px-3 py-1">
        {getRiskSummary().generalRisk} Risk
      </div>
    </div>

    <div className="p-5 leading-relaxed text-slate-200 text-sm space-y-4">
  {result.split("\n").map((line, index) => {
    if (line.startsWith("# ")) {
      return (
        <h2
          key={index}
          className="text-cyan-300 font-bold text-lg mt-6 border-b border-slate-800 pb-2"
        >
          {line.replace("# ", "")}
        </h2>
      );
    }

    if (line.startsWith("- ")) {
      return (
        <div
          key={index}
          className="pl-3 border-l-2 border-slate-700 text-slate-300"
        >
          • {line.replace("- ", "")}
        </div>
      );
    }

    return (
      <p key={index} className="text-slate-300">
        {line}
      </p>
    );
  })}
</div>
  </div>
)}
              <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-500">Klinik uyarı: Bu sistem kesin tanı koymaz. Veteriner hekimin klinik değerlendirmesinin yerine geçmez.</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

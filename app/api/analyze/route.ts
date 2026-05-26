export async function POST(request: Request) {
  const data = await request.json();

  const text = `${data.hemogram}\n${data.biochemistry}`.toUpperCase();

  const hasPLTLow = text.includes("PLT") && /PLT[:\s]+([0-9.]+)/i.test(text) && Number(text.match(/PLT[:\s]+([0-9.]+)/i)?.[1]) < 100;
  const hasHGBLow = text.includes("HGB") && /HGB[:\s]+([0-9.]+)/i.test(text) && Number(text.match(/HGB[:\s]+([0-9.]+)/i)?.[1]) < 9;
  const hasHCTLow = text.includes("HCT") && /HCT[:\s]+([0-9.]+)/i.test(text) && Number(text.match(/HCT[:\s]+([0-9.]+)/i)?.[1]) < 30;
  const hasCKHigh = text.includes("CK") && /CK[:\s]+([0-9.]+)/i.test(text) && Number(text.match(/CK[:\s]+([0-9.]+)/i)?.[1]) > 315;
  const hasALTHigh = text.includes("ALT") && /ALT[:\s]+([0-9.]+)/i.test(text) && Number(text.match(/ALT[:\s]+([0-9.]+)/i)?.[1]) > 145;
  const hasASTHigh = text.includes("AST") && /AST[:\s]+([0-9.]+)/i.test(text) && Number(text.match(/AST[:\s]+([0-9.]+)/i)?.[1]) > 48;

  const critical = [];
  if (hasPLTLow) critical.push("- Düşük PLT / trombositopeni");
  if (hasHGBLow) critical.push("- Düşük HGB / anemi bulgusu");
  if (hasHCTLow) critical.push("- Düşük HCT / anemi veya hemodilüsyon");
  if (hasCKHigh) critical.push("- Yüksek CK / kas hasarı şüphesi");
  if (hasALTHigh) critical.push("- Yüksek ALT / hepatoselüler hasar şüphesi");
  if (hasASTHigh) critical.push("- Yüksek AST / kas veya karaciğer kaynaklı yükselme");

  const diagnoses = [];
  if (hasHGBLow || hasHCTLow) diagnoses.push("- Anemi");
  if (hasPLTLow) diagnoses.push("- Trombositopeni");
  if (hasCKHigh) diagnoses.push("- Kas hasarı / travma / miyozit");
  if (hasALTHigh || hasASTHigh) diagnoses.push("- Hepatik veya kas kaynaklı enzim yükselmesi");
  if (hasPLTLow && (hasHGBLow || hasHCTLow)) diagnoses.push("- Hematolojik bozukluk / enfeksiyöz veya immün aracılı süreç");

  const tests = [];
  if (hasPLTLow) tests.push("- Kan yayması", "- Koagülasyon paneli");
  if (hasHGBLow || hasHCTLow) tests.push("- Retikülosit sayımı", "- FeLV/FIV testi");
  if (hasCKHigh) tests.push("- CK tekrar ölçümü", "- Travma/miyozit değerlendirmesi");
  if (hasALTHigh || hasASTHigh) tests.push("- ALT/AST trend takibi", "- Abdominal ultrasonografi");

  const riskCount = critical.length;
  const urgency = riskCount >= 5 ? "YÜKSEK" : riskCount >= 3 ? "ORTA-YÜKSEK" : riskCount >= 1 ? "ORTA" : "DÜŞÜK";

  const result = `
# Hasta Özeti
${data.age || "Yaşı belirtilmemiş"} yaşında ${data.species || "türü belirtilmemiş"} hasta değerlendirildi.

# Kritik Bulgular
${critical.length ? critical.join("\n") : "- Belirgin kritik laboratuvar bulgusu otomatik olarak saptanmadı."}

# Laboratuvar Değerlendirmesi
${critical.length ? "Girilen laboratuvar değerlerinde referans dışı bulgular mevcuttur. Klinik tablo anamnez, fizik muayene ve görüntüleme ile birlikte değerlendirilmelidir." : "Girilen değerlere göre belirgin kritik sapma saptanmadı."}

# Olası Ön Tanılar
${diagnoses.length ? diagnoses.join("\n") : "- Belirgin otomatik ön tanı paterni saptanmadı."}

# Ayırıcı Tanılar
- Enfeksiyöz hastalıklar
- İmmün aracılı hastalıklar
- Travma
- Metabolik bozukluklar
- Organ kaynaklı sekonder etkilenimler

# Önerilen Ek Tetkikler
${tests.length ? [...new Set(tests)].join("\n") : "- Klinik bulgulara göre ek tetkik planlanmalı."}

# Aciliyet Seviyesi
${urgency}

# Klinik Uyarı
Bu çıktı klinik karar destek amaçlıdır. Kesin tanı yerine geçmez.
`;

  return Response.json({ result });
}
export async function POST(request: Request) {
  const data = await request.json();

  const fakeResult = `
# Hasta Özeti
${data.age} yaşında ${data.species} hasta değerlendirildi.

# Kritik Bulgular
- Düşük HGB
- Düşük HCT
- Düşük PLT
- Yüksek CK
- Yüksek ALT

# Laboratuvar Değerlendirmesi
Anemi ve trombositopeni dikkat çekmektedir.
CK yüksekliği kas hasarı ile ilişkili olabilir.

# Olası Ön Tanılar
- Sistemik inflamasyon
- Kas hasarı
- Hematolojik bozukluk

# Ayırıcı Tanılar
- FeLV/FIV
- Travma
- Enfeksiyöz hastalıklar

# Önerilen Ek Tetkikler
- Kan yayması
- FeLV/FIV testi
- Koagülasyon paneli

# Aciliyet Seviyesi
ORTA-YÜKSEK

# Klinik Uyarı
Bu çıktı klinik karar destek amaçlıdır.
`;

  return Response.json({
    result: fakeResult,
  });
}
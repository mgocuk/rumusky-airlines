# ✈️ RUMUSKY AIRLINES — Web Satış & Operasyon Yönetim Platformu

> **"Dünyaya RUMUSKY ile Uçun — Your Journey, Our Sky."**

RUMUSKY AIRLINES, modern minimalist tasarım dili, çift dil desteği (TR / EN), tam etkileşimli uçuş rezervasyon akışı, interaktif kabin koltuk haritası, simüle test ödeme geçidi, doğrulanabilir QR kodlu elektronik biniş kartı (PDF) ve kapsamlı bir operasyonel yönetim paneli sunan tam teşekküllü bir havayolu web uygulamasıdır.

Bu proje, akademik değerlendirme ve canlı Vercel sunumu amacıyla hazırlanmıştır. **Kesinlikle gerçek finansal ödeme veya kredi kartı doğrulaması gerektirmez.**

---

## 🚀 Vercel Üzerinde Canlıya Alma (Deployment Rehberi)

Uygulama Vercel ile %100 uyumludur (`vercel.json` yapılandırması hazırdır). Canlıya almak için:

### Yöntem 1: GitHub & Vercel Dashboard (En Kolay & Kalıcı)
1. Projeyi bir GitHub reponuza push edin:
   ```bash
   git init
   git add .
   git commit -m "feat: RUMUSKY Airlines initial release"
   git branch -M main
   git remote add origin https://github.com/<kullanici-adiniz>/rumusky-airlines.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) adresine gidin ve **Add New Project** butonuna tıklayın.
3. GitHub reponuzu seçin (`rumusky-airlines`).
4. Framework Preset olarak **Vite** otomatik algılanacaktır.
5. **Deploy** butonuna basın. Yaklaşık 30 saniye içinde uygulamanız `rumusky-airlines.vercel.app` gibi canlı bir bağlantı üzerinden yayına girecektir!

### Yöntem 2: Terminalden Vercel CLI ile
```bash
npx vercel
```
Ekrana gelen soruları Enter ile onaylayarak anında canlı önizleme bağlantısı alabilirsiniz.

---

## 💻 Yerel Ortamda Çalıştırma

Projeyi bilgisayarınızda yerel olarak çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

---

## 💳 Simüle Test Ödeme Senaryoları

Okul sunumunda ve jüri testlerinde kullanabileceğiniz hazır sanal test kartları:

| Kart Durumu | Kart Numarası | Son Kullanma | CVV | 3D Secure OTP | Beklenen Sonuç |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Başarılı Ödeme** | `4000 0000 0000 0001` | `12/28` | `888` | `123456` | Rezervasyon onaylanır, PNR ve QR kodlu PDF bilet üretilir. |
| **Yetersiz Bakiye** | `4000 0000 0000 0002` | `12/28` | `888` | - | Hata mesajı görüntülenir, koltuk kilidi korunur/bırakılır. |

---

## 🛠️ Temel Özellikler & Sayfa Envanteri

1. **Ana Sayfa (`/`):**
   - RUMUSKY markalı hava taşıtı görseli ve "Dünyaya RUMUSKY ile Uçun" sloganı.
   - Örtüşen uçuş arama paneli (Tek yön / Gidiş-Dönüş, IATA autocomplete, swap butonu, yolcu seçici, kabin seçici).
   - 4 Kurumsal avantaj kartı (Güvenli Seyahat, Konforlu Uçuş, Avantajlı Fiyatlar, 7/24 Destek).
   - 2 Geniş dinamik kampanya bannerı (Avrupa & Uzak Doğu rotaları).
   - 5 Popüler destinasyon kartı (başlayan fiyatlarla doğrudan uçuş aramaya aktarım).
   - Kurumsal zengin footer ve IATA güvenlik rozetleri.

2. **Uçuş Arama Sonuçları (`results`):**
   - Gerçek uçuş saatleri, uçuş süresi, aktarma bilgisi ve kişi başı ücretler.
   - En ucuz, en hızlı, en erken sıralama filtreleri; fiyat aralığı çubuğu ve direkt uçuş süzgeci.

3. **Yolcu Bilgileri (`passengers`):**
   - Çoklu yolcu desteği (Yetişkin, Çocuk), kimlik/pasaport no, doğum tarihi ve bilet bildirim iletişim bilgileri.

4. **İnteraktif Koltuk Haritası (`seats`):**
   - Uçağın gerçek oturma planı (Airbus A320 / Boeing 737: 3x3 dizilim, 1-26 sıralar).
   - Business, Ekonomi, Acil Çıkış ve Ekstra Diz Mesafesi koltukları.
   - 10 dakikalık geçici koltuk kilidi geri sayım sayacı.

5. **Test Ödeme & 3D Secure Simülasyonu (`checkout`):**
   - Şeffaf vergi, taban fiyat ve koltuk bedeli dökümü.
   - Tek tıkla test kartı doldurma butonları.
   - 3D Secure SMS OTP modalı.

6. **Bilet Onayı & PDF Biniş Kartı (`confirmation`):**
   - Benzersiz 6 haneli alfa-numerik PNR üretimi (örn: `RMK84A`).
   - IATA standartlarında taranabilir QR kod.
   - Konfeti animasyonu ve tek tıkla indirilebilir vektörel PDF e-bilet motoru (`jsPDF`).

7. **Rezervasyon Sorgulama & Bilet Yönetimi (`manage`):**
   - PNR kodu ve Yolcu Soyadı ile uçuş sorgulama, bilet görüntüleme ve PDF'i yeniden indirme.

8. **Yönetim Paneli (`admin`):**
   - Uçuş, hasılat, doluluk oranı ve Recharts grafik analizleri.
   - Yeni uçuş planlama ve satışa açma modülü (eklenen uçuşlar canlı arama motoruna anında yansır).
   - Uçuş operasyon durumu güncelleme (Scheduled, Boarding, In Air, Landed, Delayed, Cancelled).
   - Rezervasyon listesi, bilet iptal/iade yönetimi.
   - Havalimanları ve uçak filosu envanteri.

9. **Çoklu Dil Desteği:**
   - Navbardaki TR / EN seçici ile arama veya rezervasyon durumu kaybolmadan tüm arayüz anında iki dilde çalışır.

---

## 🎨 Marka & Tasarım Tokenları

- **Primary Navy:** `#0B2545`
- **Accent Blue:** `#0D6EFD`
- **Secondary Cyan:** `#00B4DB`
- **Background Light:** `#F4F8FC`
- **Surface White:** `#FFFFFF`
- **Yazı Tipleri:** Poppins (Başlıklar) & Inter (Gövde Metinleri)

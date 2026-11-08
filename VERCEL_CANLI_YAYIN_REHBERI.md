# 🚀 RUMUSKY AIRLINES — Vercel Canlı Yayın Rehberi

Tebrikler! Projeniz üretim derlemesi (`dist/`) ve `vercel.json` yönlendirmeleriyle Vercel'e canlıya alınmaya %100 hazırdır.

Aşağıdaki **2 yöntemden** dilediğinizi seçerek 1 dakika içinde canlı URL bağlantınızı alabilirsiniz:

---

## ⚡ YÖNTEM 1: Terminalden Tek Komutla (En Hızlısı)

1. Bilgisayarınızda **PowerShell** veya **Komut İstemi'ni (CMD)** açın.
2. Proje klasörünüze gidin:
   ```powershell
   cd "C:\Mustafa GOCUK\Rumeysa\airlines"
   ```
3. Doğrudan şu komutu çalıştırın:
   ```powershell
   npx vercel
   ```
4. **İlk Kez Kullanıyorsanız:**
   - Ekranda Vercel hesabınıza giriş yapmanız istenecek (`Log in to Vercel`).
   - Tarayıcınızda otomatik bir sayfa açılır, **"Continue with GitHub"** veya **"Continue with Email"** seçeneğiyle onaylayın.
5. **Gelen Sorulara Yalnızca "Enter" Tuşuna Basın:**
   - *Set up and deploy?* -> `Y` (Enter)
   - *Which scope?* -> Hesabınız (Enter)
   - *Link to existing project?* -> `N` (Enter)
   - *Project name?* -> `rumusky-airlines` (Enter)
   - *In which directory is your code located?* -> `./` (Enter)
   - *Want to modify these settings?* -> `N` (Enter - `vercel.json` zaten hazırdır!)
6. **Sonuç:**
   Ekranda canlı linkiniz belirecektir:
   ```
   ✅ Production: https://rumusky-airlines.vercel.app
   ```
   Bu linki doğrudan hocanıza, jüriye veya arkadaşlarınıza gönderebilirsiniz!

---

## 🌐 YÖNTEM 2: GitHub Dashboard Üzerinden (Kalıcı & Otomatik)

Projeyi GitHub hesabınıza yükleyip Vercel'e bağlamak isterseniz:

1. [github.com/new](https://github.com/new) adresine gidin.
2. Repository name olarak **`rumusky-airlines`** yazın ve **"Create repository"** butonuna tıklayın.
3. [GitHub Desktop](https://desktop.github.com/) programını açıp **File -> Add Local Repository** diyerek `C:\Mustafa GOCUK\Rumeysa\airlines` klasörünü seçin ve **"Publish repository"** butonuna basın.
4. [vercel.com](https://vercel.com) adresine gidin ve oturum açın.
5. **"Add New Project"** butonuna tıklayın.
6. GitHub listenizden **`rumusky-airlines`** reposunu seçin ve **"Import"** deyin.
7. Framework Preset olarak **Vite** otomatik algılanır.
8. **"Deploy"** butonuna basın. 30 saniye içinde siteniz canlıya alınacaktır.

---

## 🧪 Canlı Sitede Sunum Yaparken Gösterebileceğiniz Örnek Akış:

1. **Uçuş Arama:** `IST` (İstanbul) → `LHR` (Londra) seçin, Uçuş Ara'ya basın.
2. **Koltuk Seçimi:** Gerçek uçak kabin planından istediğiniz koltuğu (örn: 12A Exit row) seçin. 10 dakikalık kilit sayacını gösterin.
3. **Ek Hizmetler:** Fast Track ve +10kg Bagaj ekleyin; toplam tutarın dinamik arttığını gösterin.
4. **Test Ödeme:** *"Başarılı Kart (4000 ... 0001)"* butonuna basıp 3D Secure SMS kodunu (`123456`) onaylayın.
5. **PDF Bilet İndirme:** Oluşan PNR'ı ve QR kodlu **PDF elektronik biniş kartını** indirip açın.
6. **Online Check-in:** Menüden Check-in sekmesine girip aynı PNR ile biniş kartını sorgulayın.
7. **Yönetim Paneli:** Sağ üstteki **"Admin Paneli"** butonuna basarak yeni bir uçuş ekleyin veya mevcut uçuşun durumunu *"Boarding"* yapın; müşteri arama sonuçlarında anında değiştiğini gösterin.

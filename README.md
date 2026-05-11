# AYDE | Attaniye – Web Sitesi Prototipi

**"Tek Ürün, Çift Konfor"**

---

## 📁 Klasör Yapısı

```
ayde-website/
├── index.html       ← Ana sayfa (tüm bölümler tek dosyada)
├── style.css        ← Özel CSS (Tailwind CDN + özel stiller)
├── main.js          ← Vanilla JS (modüler yapı, yorum satırlı)
├── README.md        ← Bu dosya
└── img/             ← Görsel klasörü (aşağıda detay)
    ├── logo.png         ← AYDE marka logosu
    ├── urun-basic.jpg   ← Basic Seri ürün görseli
    ├── urun-premium.jpg ← Premium Seri ürün görseli
    ├── urun-desenli.jpg ← Desenli Seri ürün görseli
    ├── urun-outdoor.jpg ← Outdoor Seri ürün görseli
    └── hikaye.jpg       ← Marka hikayesi bölümü görseli
```

---

## 🖼️ Görseller Hakkında

`img/` klasörüne **kendi görsellerinizi** ekleyin. Görsel yoksa:
- Ürün kartları otomatik **gradient placeholder** gösterir
- Logo yoksa AYDE yazısı tipografi ile görüntülenir

**Önerilen görseller:**
| Dosya                | Boyut          | İçerik                        |
|----------------------|----------------|-------------------------------|
| `logo.png`           | 200×80 px      | Şeffaf arkaplan, marka logosu |
| `urun-basic.jpg`     | 600×600 px     | Basic seri ürün fotoğrafı     |
| `urun-premium.jpg`   | 600×600 px     | Premium seri ürün fotoğrafı   |
| `urun-desenli.jpg`   | 600×600 px     | Desenli seri ürün fotoğrafı   |
| `urun-outdoor.jpg`   | 600×600 px     | Outdoor seri ürün fotoğrafı   |
| `hikaye.jpg`         | 800×600 px     | Marka/atölye fotoğrafı        |

---

## 🚀 Nasıl Açılır?

### Yöntem 1 – Direkt Tarayıcı
`index.html` dosyasını çift tıklayın. Tarayıcıda açılır.

### Yöntem 2 – Yerel Sunucu (önerilen)
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve .

# VS Code Live Server eklentisi
```

---

## ✨ Özellikler

| Bölüm                | Açıklama                                              |
|----------------------|-------------------------------------------------------|
| **Hero Section**     | Tam ekran, stagger animasyonlu karşılama              |
| **Ürün Grid**        | 4 varyant kartı, hover efektleri                      |
| **Side Cart**        | Sağdan kayarak açılan off-canvas sepet                |
| **Notify Modal**     | Tükenen ürün için e-posta talep formu                 |
| **Toast Bildirimi**  | Başarı/bilgi bildirimleri                             |
| **Kullanım Rehberi** | İkonik 3 kullanım biçimi                              |
| **Marka Hikayesi**   | Storytelling bölümü                                   |
| **Newsletter**       | E-posta abonelik formu                                |
| **Responsive**       | Mobil, tablet, masaüstü uyumlu                        |

---

## 🎨 Renk Paleti

```
Cream     #F5F0E8   ← Ana arkaplan
Parchment #EDE5D0   ← İkincil arkaplan
Sand      #C9B99A   ← Kenarlıklar, ince elemanlar
Clay      #A68B6A   ← Etiketler, yardımcı metin
Earth     #7D5A3C   ← Fiyat, vurgular
Sienna    #5C3D2E   ← Ana başlıklar, butonlar
Charcoal  #2C2825   ← Metin
Warm      #1A1614   ← Footer
```

---

## 🛠️ Teknoloji

- **HTML5** – Semantik yapı
- **Tailwind CSS** CDN v3 – Utility sınıfları
- **Vanilla JavaScript** – Framework yok, modüler yapı
- **Google Fonts** – Cormorant Garamond + DM Sans

---

*© 2025 AYDE Tekstil – Tüm hakları saklıdır.*
https://efedemirtas48.github.io/ayde/

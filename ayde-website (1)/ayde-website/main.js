/**
 * ================================================
 * AYDE | Attaniye – main.js
 * Modüler Vanilla JavaScript
 * ================================================
 *
 * Modüller:
 *  1. NavbarController   – Scroll'a göre navbar stili
 *  2. HeroAnimations     – Hero section animasyonu
 *  3. CartManager        – Sepet state yönetimi
 *  4. NotifyModal        – "Gelince Haber Ver" modalı
 *  5. ToastManager       – Bildirim sistemi
 *  6. ScrollAnimations   – Intersection Observer animasyonları
 *  7. MobileMenu         – Mobil hamburger menü
 *  8. NewsletterHandler  – Bülten formu
 */

'use strict';

/* ================================================
   1. NAVBAR CONTROLLER
   Sayfa scroll edildiğinde navbar'a 'scrolled' sınıfı eklenir,
   bu sınıf CSS'de blur ve shadow efekti uygular.
   ================================================ */
const NavbarController = (() => {
  const navbar = document.getElementById('navbar');

  /** Scroll pozisyonuna göre navbar sınıfını günceller */
  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function init() {
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar(); // Sayfa açılışında da kontrol et
  }

  return { init };
})();


/* ================================================
   2. HERO ANIMATIONS
   Sayfa yüklendiğinde her hero elementi sıralı animasyonla görünür.
   animation-delay stagger tekniği kullanılır.
   ================================================ */
const HeroAnimations = (() => {

  /**
   * Elementin opacity ve transform değerlerini sıfırdan görünür konuma animate eder.
   * @param {HTMLElement} el - Animate edilecek element
   * @param {number} delayMs - Gecikme süresi (ms)
   */
  function animateElement(el, delayMs) {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = `opacity 0.9s ease ${delayMs}ms, transform 0.9s cubic-bezier(0.4,0,0.2,1) ${delayMs}ms`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50); // requestAnimationFrame benzeri küçük gecikme
  }

  function init() {
    // Stagger animasyonu: her element öncekinden 120ms sonra başlar
    const elements = [
      { selector: '.hero-badge',       delay: 100  },
      { selector: '.hero-logo',        delay: 280  },
      { selector: '.hero-product-name',delay: 420  },
      { selector: '.hero-slogan',      delay: 520  },
      { selector: '.hero-desc',        delay: 680  },
      { selector: '.hero-cta',         delay: 820  },
      { selector: '.scroll-indicator', delay: 1100 },
    ];

    elements.forEach(({ selector, delay }) => {
      animateElement(document.querySelector(selector), delay);
    });
  }

  return { init };
})();


/* ================================================
   3. CART MANAGER
   Uygulama state'i: cartItems dizisi
   Her işlem sonrası UI güncellenir.
   ================================================ */
const CartManager = (() => {
  // State: Sepetteki ürünlerin tutulduğu dizi
  let cartItems = [];

  // DOM referansları – bir kez alınır
  const sideCart    = document.getElementById('sideCart');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmpty   = document.getElementById('cartEmpty');
  const cartFooter  = document.getElementById('cartFooter');
  const cartCount   = document.getElementById('cartCount');
  const cartTotal   = document.getElementById('cartTotal');

  /**
   * Sepet toplam miktarını hesaplar.
   * @returns {number} Toplam adet
   */
  function getTotalQuantity() {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  }

  /**
   * Sepet toplam fiyatını hesaplar.
   * @returns {number} Toplam fiyat (₺)
   */
  function getTotalPrice() {
    return cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  /**
   * Fiyat formatlar: 1390 → "1.390 ₺"
   * @param {number} price
   * @returns {string}
   */
  function formatPrice(price) {
    return price.toLocaleString('tr-TR') + ' ₺';
  }

  /**
   * Sepet badge'ini (sağ üst köşe sayaç) günceller.
   */
  function updateBadge() {
    const total = getTotalQuantity();
    if (total > 0) {
      cartCount.textContent = total;
      cartCount.style.opacity = '1';
    } else {
      cartCount.style.opacity = '0';
    }
  }

  /**
   * Tekil sepet ürün kartının HTML'ini oluşturur.
   * @param {Object} item - Ürün objesi {id, name, series, price, qty, imgSrc}
   * @returns {string} HTML string
   */
  function renderCartItemHTML(item) {
    const imgEl = item.imgSrc
      ? `<img src="${item.imgSrc}" alt="${item.name}" class="cart-item-img"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
         <div class="cart-item-img-placeholder" style="display:none;">
           <span class="font-display text-xs text-clay/50 italic">${item.series}</span>
         </div>`
      : `<div class="cart-item-img-placeholder">
           <span class="font-display text-xs text-clay/50 italic">${item.series}</span>
         </div>`;

    return `
      <div class="cart-item" id="cart-item-${item.id}">
        <div style="flex-shrink:0; position:relative; width:72px; height:72px;">
          ${imgEl}
        </div>
        <div class="cart-item-details">
          <div class="cart-item-series">${item.series}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="CartManager.decreaseQty(${item.id})" aria-label="Azalt">−</button>
            <span class="qty-display" id="qty-${item.id}">${item.qty}</span>
            <button class="qty-btn" onclick="CartManager.increaseQty(${item.id})" aria-label="Artır">+</button>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem;">
          <span class="cart-item-price" id="item-price-${item.id}">${formatPrice(item.price * item.qty)}</span>
          <button class="cart-item-remove" onclick="CartManager.removeItem(${item.id})" aria-label="Kaldır" title="Sil">✕</button>
        </div>
      </div>
    `;
  }

  /**
   * Sepet UI'ını tamamen yeniden render eder.
   * Her state değişikliğinden sonra çağrılır.
   */
  function renderCart() {
    if (cartItems.length === 0) {
      // Boş sepet göster
      cartEmpty.style.display = 'flex';
      cartFooter.classList.add('hidden');

      // Önceki ürün elementlerini temizle (empty div hariç)
      const items = cartItemsEl.querySelectorAll('.cart-item');
      items.forEach(el => el.remove());
    } else {
      // Ürünleri göster
      cartEmpty.style.display = 'none';
      cartFooter.classList.remove('hidden');

      // Mevcut cart-item elementlerini sil
      const existingItems = cartItemsEl.querySelectorAll('.cart-item');
      existingItems.forEach(el => el.remove());

      // Her ürünü render et
      cartItems.forEach(item => {
        cartItemsEl.insertAdjacentHTML('beforeend', renderCartItemHTML(item));
      });

      // Toplam fiyatı güncelle
      cartTotal.textContent = formatPrice(getTotalPrice());
    }

    updateBadge();
  }

  /**
   * Ürün kartından veri çeker ve sepete ekler/günceller.
   * @param {HTMLButtonElement} btn - "Sepete Ekle" butonu
   */
  function addItem(btn) {
    // Butona en yakın ürün kartını bul
    const card      = btn.closest('.product-card');
    const productId = parseInt(card.dataset.productId);
    const name      = card.dataset.productName;
    const price     = parseInt(card.dataset.productPrice.replace(/\./g, ''));
    const imgEl     = card.querySelector('.product-img');
    const imgSrc    = imgEl ? imgEl.getAttribute('src') : null;
    const series    = card.querySelector('.product-series')?.textContent || '';

    // Zaten sepette var mı kontrol et
    const existingIdx = cartItems.findIndex(i => i.id === productId);

    if (existingIdx >= 0) {
      // Miktarı artır
      cartItems[existingIdx].qty += 1;
    } else {
      // Yeni ürün ekle
      cartItems.push({ id: productId, name, series, price, qty: 1, imgSrc });
    }

    renderCart();
    openCart();

    // Butona kısa süre geri bildirim animasyonu ver
    btn.textContent = '✓ Eklendi';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
      </svg> Sepete Ekle`;
      btn.disabled = false;
    }, 1500);
  }

  /**
   * Belirtilen ürünün miktarını 1 artırır.
   * @param {number} id - Ürün ID
   */
  function increaseQty(id) {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      item.qty += 1;
      renderCart();
    }
  }

  /**
   * Belirtilen ürünün miktarını 1 azaltır; 0 olursa siler.
   * @param {number} id - Ürün ID
   */
  function decreaseQty(id) {
    const idx = cartItems.findIndex(i => i.id === id);
    if (idx >= 0) {
      if (cartItems[idx].qty > 1) {
        cartItems[idx].qty -= 1;
      } else {
        cartItems.splice(idx, 1); // Miktar 0 → sepetten çıkar
      }
      renderCart();
    }
  }

  /**
   * Ürünü sepetten tamamen kaldırır.
   * @param {number} id - Ürün ID
   */
  function removeItem(id) {
    cartItems = cartItems.filter(i => i.id !== id);
    renderCart();
    ToastManager.show('Ürün kaldırıldı', 'Sepetinizden silindi.', 'info');
  }

  /** Sepet panelini açar */
  function open() {
    sideCart.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Arka plan scroll'u engelle
  }

  /** Sepet panelini kapatır */
  function close() {
    sideCart.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    // Navbar sepet butonuna tıklama
    document.getElementById('cartBtn').addEventListener('click', open);
    renderCart(); // Başlangıç render'ı
  }

  // Public API
  return { init, addItem, increaseQty, decreaseQty, removeItem, open, close };
})();


/* ================================================
   4. NOTIFY MODAL
   Tükendi ürünler için "Gelince Haber Ver" modal akışı.
   ================================================ */
const NotifyModal = (() => {
  const overlay      = document.getElementById('modalOverlay');
  const form         = document.getElementById('notifyForm');
  const productLabel = document.getElementById('modalProductName');

  let currentProductName = '';

  /**
   * Modalı açar ve ürün adını günceller.
   * @param {string} productName - Ürün adı
   */
  function open(productName) {
    currentProductName = productName;
    productLabel.textContent = `"${productName}" tekrar stoğa girince sizi bilgilendireceğiz.`;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // İlk input'a odaklan (erişilebilirlik)
    setTimeout(() => {
      document.getElementById('notifyName').focus();
    }, 100);
  }

  /** Modalı kapatır ve formu sıfırlar */
  function close() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    form.reset();
  }

  /**
   * Form gönderim işleyicisi.
   * Gerçek bir API çağrısı yerine simüle edilmiş başarı gösterilir.
   * @param {Event} e
   */
  function handleSubmit(e) {
    e.preventDefault();

    const name  = document.getElementById('notifyName').value.trim();
    const email = document.getElementById('notifyEmail').value.trim();

    if (!name || !email) return;

    // Submit butonu yükleniyor durumu
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Kaydediliyor...';
    btn.disabled = true;

    // API çağrısı simülasyonu (300ms gecikme)
    setTimeout(() => {
      close();
      ToastManager.show(
        'Talebiniz alındı! ✓',
        `${name}, "${currentProductName}" stoğa girince ${email} adresine bildirim göndereceğiz.`,
        'success'
      );
      btn.textContent = 'Beni Haberdar Et';
      btn.disabled = false;
    }, 600);
  }

  function init() {
    form.addEventListener('submit', handleSubmit);

    // ESC tuşuyla kapat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        close();
      }
    });
  }

  return { init, open, close };
})();


/* ================================================
   5. TOAST MANAGER
   Ekranın sağ altında otomatik kapanan bildirimler.
   Sıra ile gösterilir, 4 saniye sonra kaybolur.
   ================================================ */
const ToastManager = (() => {
  const container = document.getElementById('toastContainer');

  /**
   * İkon SVG'lerini type'a göre döner.
   * @param {string} type - 'success' | 'info' | 'error'
   * @returns {string} SVG HTML
   */
  function getIcon(type) {
    const icons = {
      success: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
      </svg>`,
      info: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      error: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
      </svg>`,
    };
    return icons[type] || icons.info;
  }

  /**
   * Yeni toast bildirimi oluşturur ve gösterir.
   * @param {string} title   - Başlık
   * @param {string} message - Açıklama metni
   * @param {string} type    - 'success' | 'info' | 'error'
   * @param {number} duration - Gösterim süresi (ms), varsayılan 4000
   */
  function show(title, message, type = 'success', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${getIcon(type)}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Belirtilen süre sonra kaldır
    setTimeout(() => {
      dismiss(toast);
    }, duration);

    // Tıklayarak kapat
    toast.addEventListener('click', () => dismiss(toast));
  }

  /**
   * Toast'u çıkış animasyonuyla kaldırır.
   * @param {HTMLElement} toast
   */
  function dismiss(toast) {
    if (!toast.parentElement) return;
    toast.classList.add('removing');
    setTimeout(() => {
      toast.remove();
    }, 350);
  }

  return { show };
})();


/* ================================================
   6. SCROLL ANIMATIONS
   IntersectionObserver kullanarak elemanları
   viewport'a girince görünür yapar.
   ================================================ */
const ScrollAnimations = (() => {

  /**
   * Observer oluşturur: gözlemlenen element viewport'a girince
   * 'visible' sınıfı eklenir, CSS transition devreye girer.
   */
  function init() {
    // Animasyon eklenecek elementlere sınıf ekle
    const targets = document.querySelectorAll(
      '.product-card, .guide-card, .section-header, .story-text, .story-img-wrap'
    );

    targets.forEach(el => {
      el.classList.add('fade-in-up');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            // Sıralı animasyon için grid içindeki index hesaplanır
            const staggerDelay = 80;
            const siblings = Array.from(entry.target.parentElement?.children || []);
            const itemIndex = siblings.indexOf(entry.target);

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, itemIndex * staggerDelay);

            observer.unobserve(entry.target); // Bir kez animate et, sonra gözlemi durdur
          }
        });
      },
      {
        threshold: 0.1,    // %10 görünür olunca tetikle
        rootMargin: '0px 0px -60px 0px', // Alt kenardan 60px içeride başla
      }
    );

    targets.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ================================================
   7. MOBILE MENU
   Hamburger butonu ile mobil menü toggle
   ================================================ */
const MobileMenu = (() => {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    menu.classList.toggle('open', isOpen);

    // Hamburger animasyonu
    const lines = btn.querySelectorAll('.hamburger-line');
    if (isOpen) {
      lines[0].style.transform = 'translateY(6px) rotate(45deg)';
      lines[1].style.opacity   = '0';
      lines[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      lines[0].style.transform = '';
      lines[1].style.opacity   = '';
      lines[2].style.transform = '';
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('open');
    const lines = btn.querySelectorAll('.hamburger-line');
    lines[0].style.transform = '';
    lines[1].style.opacity   = '';
    lines[2].style.transform = '';
  }

  function init() {
    btn.addEventListener('click', toggle);
  }

  return { init, close };
})();


/* ================================================
   8. NEWSLETTER HANDLER
   Bülten formu submit işleyicisi
   ================================================ */
const NewsletterHandler = (() => {

  /**
   * @param {Event} e - Form submit eventi
   */
  function handleSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    const email = input.value.trim();

    if (!email) return;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Kaydediliyor...';
    btn.disabled = true;

    // API simülasyonu
    setTimeout(() => {
      input.value = '';
      btn.textContent = 'Abone Ol';
      btn.disabled = false;
      ToastManager.show(
        'Hoş geldiniz! ✓',
        `${email} adresi bültenimize eklendi.`,
        'success'
      );
    }, 700);
  }

  function init() {
    const form = document.querySelector('.newsletter-form');
    if (form) form.addEventListener('submit', handleSubmit);
  }

  return { init };
})();


/* ================================================
   GLOBAL FONKSIYONLAR
   HTML onclick attribute'larından çağrılır.
   ================================================ */

/** "Sepete Ekle" butonuna tıklandığında çağrılır */
function addToCart(btn) {
  CartManager.addItem(btn);
}

/** Sepeti açar (navbar butonu ve HTML'den) */
function openCart() {
  CartManager.open();
}

/** Sepeti kapatır */
function closeCart() {
  CartManager.close();
}

/** Ürün miktarını artırır */
function increaseQty(id) {
  CartManager.increaseQty(id);
}

/** Ürün miktarını azaltır */
function decreaseQty(id) {
  CartManager.decreaseQty(id);
}

/** "Gelince Haber Ver" modalını açar */
function openNotifyModal(btn) {
  const card = btn.closest('.product-card');
  const productName = card.dataset.productName || 'Ürün';
  NotifyModal.open(productName);
}

/** Modalı kapatır */
function closeNotifyModal() {
  NotifyModal.close();
}

/** Modal form submit handler (HTML onsubmit'ten çağrılır) */
function submitNotifyForm(e) {
  NotifyModal.close(); // Gerçek işlem modal içinde
}

/** Mobil menüyü kapatır (link tıklamalarında) */
function closeMobileMenu() {
  MobileMenu.close();
}

/** Ödeme ekranı simülasyonu */
function checkout() {
  CartManager.close();
  ToastManager.show(
    'Ödeme Sayfası',
    'Bu bir protip. Ödeme entegrasyonu yakında aktif olacak.',
    'info',
    5000
  );
}

/** Newsletter form global handler */
function subscribeNewsletter(e) {
  NewsletterHandler.handleSubmit ?
    NewsletterHandler.handleSubmit(e) :
    e.preventDefault();
}


/* ================================================
   UYGULAMA BAŞLANGICI
   DOM yüklendikten sonra tüm modüller başlatılır.
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  NavbarController.init();
  HeroAnimations.init();
  CartManager.init();
  NotifyModal.init();
  ScrollAnimations.init();
  MobileMenu.init();
  NewsletterHandler.init();

  console.log('%cAYDE | Attaniye', 'font-size:18px; font-weight:bold; color:#5C3D2E;');
  console.log('%cTek Ürün, Çift Konfor', 'font-size:12px; color:#A68B6A; font-style:italic;');
});

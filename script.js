/**
 * AIRCO B d.o.o. BANJA LUKA
 * Sistemi ventilacije i klimatizacije
 * Interactive Functionality, HVAC Calculator & Smooth Scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 0. Luxury Architectural Preloader
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.style.overflow = 'hidden';
    const hidePreloader = () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        document.body.style.overflow = '';
        if (typeof lenis !== 'undefined' && lenis) {
          lenis.start();
        }
      }, 850);
    };

    // Smooth choreographed transition after ~1.9s
    setTimeout(hidePreloader, 1950);
  }

  // ==========================================================================
  // 1. Initialize Lenis Smooth Scroll
  // ==========================================================================
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      orientation: 'vertical',
      gestureOrientation: 'vertical'
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ==========================================================================
  // 2. Smooth Scrolling to Anchor Links
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMenu();

        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -80 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ==========================================================================
  // 3. Header Scroll Effect
  // ==========================================================================
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================================================
  // 4. Reveal Animations on Scroll
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==========================================================================
  // 5. Fullscreen Overlay Menu Logic
  // ==========================================================================
  const menuBtn = document.querySelector('.btn-menu-pill');
  const menuCloseBtn = document.querySelector('.menu-close-btn');
  const menuOverlay = document.querySelector('.menu-overlay');

  function openMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeModal();
    }
  });

  // ==========================================================================
  // 6. Interactive Reference Portfolio Filtering
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.ref-filter-btn');
  const refCards = document.querySelectorAll('.ref-card');

  if (filterBtns.length > 0 && refCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter') || 'all';

        refCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category') || '';
          if (filterVal === 'all' || cardCategory.includes(filterVal)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // ==========================================================================
  // 7. Interactive KGH HVAC & Airflow Calculator
  // ==========================================================================
  const facBtns = document.querySelectorAll('.calc-fac-btn');
  const calcAreaSlider = document.getElementById('calc-area-slider');
  const calcAreaVal = document.getElementById('calc-area-val');
  const calcHeightSlider = document.getElementById('calc-height-slider');
  const calcHeightVal = document.getElementById('calc-height-val');

  // Displays
  const calcVolumeDisplay = document.getElementById('calc-volume-display');
  const calcAirflowDisplay = document.getElementById('calc-airflow-display');
  const calcCoolingDisplay = document.getElementById('calc-cooling-display');
  const calcHeatingDisplay = document.getElementById('calc-heating-display');
  const calcRecommendedSys = document.getElementById('calc-recommended-sys');
  const calcActionBtn = document.getElementById('calc-quote-btn');

  // Rates configuration for KGH engineering
  const facilityProfiles = {
    poslovni: {
      name: 'Poslovni prostor / Kancelarije',
      exchangesPerHour: 4.5,
      coolingWPerM2: 90,
      recSystem: 'Systemair rekuperator vazduha + Sabiana Carisma Whisper fancoili'
    },
    ugostiteljstvo: {
      name: 'Restorani, Kafei & Kuhinje',
      exchangesPerHour: 12.0,
      coolingWPerM2: 135,
      recSystem: 'Systemair kuhinjske klima komore + Frico vazdušne zavjese za ulaz'
    },
    trgovina: {
      name: 'Trgovine & Maloprodajni saloni',
      exchangesPerHour: 6.0,
      coolingWPerM2: 105,
      recSystem: 'Systemair krovni ventilatori / komore + Frico vazdušne zavjese'
    },
    stambeni: {
      name: 'Stambeni objekti & Vile',
      exchangesPerHour: 1.5,
      coolingWPerM2: 75,
      recSystem: 'Venco kompaktni rekuperator + Sabiana tihi ventilokonvektori'
    },
    garaza: {
      name: 'Javne & Podzemne garaže',
      exchangesPerHour: 6.0,
      coolingWPerM2: 20,
      recSystem: 'Venco/Systemair Jet mlazni ventilatori sa CO detekcijom i odimljavanjem'
    },
    bazen: {
      name: 'Zatvoreni bazeni & Wellness',
      exchangesPerHour: 6.5,
      coolingWPerM2: 120,
      recSystem: 'Dantherm specijalizovane bazenske komore sa integrisanim odvlaživanjem'
    }
  };

  let activeFacility = 'poslovni';

  function updateKghCalculator() {
    if (!calcAreaSlider) return;

    const area = parseFloat(calcAreaSlider.value) || 150;
    const height = calcHeightSlider ? (parseFloat(calcHeightSlider.value) || 3.0) : 3.0;

    if (calcAreaVal) calcAreaVal.textContent = `${area} m²`;
    if (calcHeightVal) calcHeightVal.textContent = `${height.toFixed(1)} m`;

    const volume = Math.round(area * height);
    const profile = facilityProfiles[activeFacility] || facilityProfiles.poslovni;

    const totalAirflow = Math.round(volume * profile.exchangesPerHour);
    const coolingKw = ((area * profile.coolingWPerM2) / 1000).toFixed(1);
    const heatingKw = (coolingKw * 1.15).toFixed(1);

    if (calcVolumeDisplay) calcVolumeDisplay.textContent = `${volume.toLocaleString('sr-RS')} m³`;
    if (calcAirflowDisplay) calcAirflowDisplay.textContent = `${totalAirflow.toLocaleString('sr-RS')} m³/h (${profile.exchangesPerHour} izm/h)`;
    if (calcCoolingDisplay) calcCoolingDisplay.textContent = `~${coolingKw} kW rashlada`;
    if (calcHeatingDisplay) calcHeatingDisplay.textContent = `~${heatingKw} kW grijanje`;
    if (calcRecommendedSys) calcRecommendedSys.textContent = profile.recSystem;

    if (calcActionBtn) {
      const prefillMsg = `Poštovani AIRCO B tim, zanima me KGH oprema za objekat: ${profile.name}. Parametri: ${area} m², visina ${height} m, proračunati protok ~${totalAirflow} m³/h i snaga ~${coolingKw} kW. Molim ponudu.`;
      calcActionBtn.setAttribute('data-prefill', prefillMsg);
    }
  }

  if (facBtns.length > 0) {
    facBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        facBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFacility = btn.getAttribute('data-type') || 'poslovni';
        updateKghCalculator();
      });
    });
  }

  if (calcAreaSlider) {
    calcAreaSlider.addEventListener('input', updateKghCalculator);
  }
  if (calcHeightSlider) {
    calcHeightSlider.addEventListener('input', updateKghCalculator);
  }

  // Initial calculation run
  updateKghCalculator();

  // ==========================================================================
  // 8. Modal Handlers (Quick Quote / Booking)
  // ==========================================================================
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalCloseBtn = document.querySelector('.modal-close-icon');
  const quoteModalForm = document.getElementById('modal-quote-form');
  const modalNotes = document.getElementById('modal-notes');

  function openModal(prefillMessage = '') {
    if (!modalBackdrop) return;
    if (prefillMessage && modalNotes) {
      modalNotes.value = prefillMessage;
    }
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Trigger modals from buttons with data-open-modal
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefill = btn.getAttribute('data-prefill') || '';
      openModal(prefill);
    });
  });

  // ==========================================================================
  // 9. Toast Notification Utility
  // ==========================================================================
  const toast = document.querySelector('.toast-notice');
  let toastTimer;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // ==========================================================================
  // 10. Forms Submission (Modal & Main Contact Form)
  // ==========================================================================
  function handleFormSubmit(formEl, isModal = false) {
    if (!formEl) return;
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(formEl);
      const name = formData.get('name') || 'Klijent';
      const company = formData.get('company') || '';
      const phone = formData.get('phone') || '';
      const service = formData.get('service') || 'Upit za opremu';
      const notes = formData.get('notes') || '';

      showToast(`Hvala ${name}! Vaš upit za AIRCO B je uspješno poslat. Naši KGH inženjeri će Vam se javiti u najkraćem roku.`);
      formEl.reset();
      if (isModal) closeModal();

      // Email fallback or direct mailto
      const mailSubject = encodeURIComponent(`AIRCO B Upit - ${company ? company + ' / ' : ''}${name}`);
      const mailBody = encodeURIComponent(
        `Poštovani AIRCO B,\n\nIme: ${name}\nFirma: ${company}\nTelefon: ${phone}\nVrsta upita: ${service}\n\nDetalji projekta / specifikacija:\n${notes}\n\nPozdrav,\n${name}`
      );
      
      setTimeout(() => {
        if (confirm('Želite li kopiju ovog upita otvoriti i u Vašem e-mail klijentu prema kontakt@aircob.com?')) {
          window.location.href = `mailto:kontakt@aircob.com?subject=${mailSubject}&body=${mailBody}`;
        }
      }, 700);
    });
  }

  const pageContactForm = document.getElementById('contact-form');
  if (pageContactForm) handleFormSubmit(pageContactForm, false);
  if (quoteModalForm) handleFormSubmit(quoteModalForm, true);

  // ==========================================================================
  // 11. Quick Direct Email for Calculator
  // ==========================================================================
  const calcMailDirectBtn = document.getElementById('calc-mail-direct');
  if (calcMailDirectBtn) {
    calcMailDirectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const area = calcAreaSlider ? calcAreaSlider.value : '150';
      const height = calcHeightSlider ? calcHeightSlider.value : '3.0';
      const airflow = calcAirflowDisplay ? calcAirflowDisplay.textContent : '2.000 m³/h';
      const cooling = calcCoolingDisplay ? calcCoolingDisplay.textContent : '15 kW';
      const system = calcRecommendedSys ? calcRecommendedSys.textContent : 'KGH oprema';

      const subject = encodeURIComponent(`KGH Proračun i ponuda - Objekat ${area}m²`);
      const body = encodeURIComponent(
        `Poštovani AIRCO B tim,\n\nIzvršio sam preliminarni proračun na vašem sajtu:\n- Tip objekta: ${facilityProfiles[activeFacility].name}\n- Površina: ${area} m² (Visina: ${height} m)\n- Proračunati protok: ${airflow}\n- Snaga: ${cooling}\n- Preporučeni sistem: ${system}\n\nMolim vas za tehničku specifikaciju i ponudu.\n\nSrdačan pozdrav,`
      );
      window.location.href = `mailto:kontakt@aircob.com?subject=${subject}&body=${body}`;
    });
  }
});

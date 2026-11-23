// Logica principal da pagina: carrosseis, modais, formulario e WhatsApp

// Telefone da recepcao para mensagens no WhatsApp (Rio Verde - GO)
const CLINIC_WHATSAPP = "5564992981570";

// Dados das especialidades para o modal rapido
const SPECIALTIES_DETAILS = {
  to: {
    title: "Terapia Ocupacional",
    audience: "Crianças e Adultos",
    desc: "Atua na autonomia das atividades cotidianas e na regulação sensorial com sala de Integração Sensorial de Ayres para TEA, TDAH e reabilitação funcional."
  },
  fono: {
    title: "Fonoaudiologia",
    audience: "Bebês, Crianças e Adultos",
    desc: "Desenvolvimento da fala, linguagem, motricidade orofacial, deglutição, mastigação e introdução de Comunicação Alternativa (CAA/PECS)."
  },
  psico: {
    title: "Psicologia Clínica",
    audience: "Infantil e Adulto",
    desc: "Atendimento acolhedor baseado em TCC e ABA para regulação emocional, ansiedade, orientação de pais e desenvolvimento de habilidades sociais."
  },
  fisio: {
    title: "Fisioterapia Neurofuncional",
    audience: "Crianças e Adultos",
    desc: "Estimulação dos marcos motores (sentar, engatinhar, andar), equilíbrio, coordenação, correção postural e reabilitação motora completa."
  },
  psicoped: {
    title: "Psicopedagogia",
    audience: "Crianças e Jovens",
    desc: "Investigação e intervenção nas dificuldades de aprendizagem, alfabetização, leitura, raciocínio lógico, Dislexia e suporte escolar para TDAH."
  },
  psicomot: {
    title: "Psicomotricidade",
    audience: "Infantil",
    desc: "Integração entre mente e movimento pelo brincar terapêutico, desenvolvendo lateralidade, esquema corporal e coordenação motora ampla e fina."
  },
  nutri: {
    title: "Nutrição Clínica & Comportamental",
    audience: "Todas as Idades",
    desc: "Especializada em seletividade e recusa alimentar infantil (TEA), introdução alimentar participativa e equilíbrio metabólico."
  },
  musico: {
    title: "Musicoterapia",
    audience: "Crianças e Adultos",
    desc: "Uso da música, instrumentos e sons como ponte terapêutica para comunicação, expressão de sentimentos e conexão socioemocional."
  },
  neuropsico: {
    title: "Neuropsicologia & Avaliações",
    audience: "Todas as Idades",
    desc: "Aplicação de baterias de testes neuropsicológicos para mapear atenção, memória e funções executivas, com emissão de laudo diagnóstico claro."
  },
  medica: {
    title: "Médica em Neurodesenvolvimento",
    audience: "Bebês, Crianças e Jovens",
    desc: "Consulta médica especializada em marcos do desenvolvimento infantil, diagnóstico clínico diferencial (TEA, TDAH) e direcionamento terapêutico."
  }
};

// Inicializa os modulos e icones quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  initTwoCardCarousel("carousel-especialidades", "spec-prev", "spec-next", "spec-dots");
  initTwoCardCarousel("carousel-ambientes", "amb-prev", "amb-next", "amb-dots");
  initSpecialtyModal();
  initAmbientesLightbox();
  initWhatsAppReception();
  initContactForm();
  initMobileNav();
});

// Carrossel com 1 item no celular e 2 no desktop, com suporte a deslizar o dedo
function initTwoCardCarousel(containerId, prevBtnId, nextBtnId, dotsContainerId) {
  const container = document.getElementById(containerId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const dotsContainer = document.getElementById(dotsContainerId);

  if (!container) return;

  const track = container.querySelector(".carousel-track");
  const slides = container.querySelectorAll(".carousel-slide-2col");
  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  // Calcula itens visiveis e limite de navegacao conforme a tela
  function getStepAndTotal() {
    const isDesktop = window.innerWidth >= 768;
    const step = isDesktop ? 2 : 1;
    const maxIndex = Math.max(0, slides.length - (isDesktop ? 2 : 1));
    return { isDesktop, step, maxIndex };
  }

  // Move os slides e atualiza botoes e marcadores
  function updateCarousel() {
    const { isDesktop, maxIndex } = getStepAndTotal();
    currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

    const targetSlide = slides[currentIndex];
    const baseOffset = slides[0].offsetLeft;
    const offsetPx = targetSlide ? (targetSlide.offsetLeft - baseOffset) : 0;

    track.style.transform = `translateX(-${offsetPx}px)`;

    if (prevBtn) {
      prevBtn.style.opacity = currentIndex === 0 ? "0.3" : "1";
      prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
    }
    if (nextBtn) {
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.3" : "1";
      nextBtn.style.pointerEvents = currentIndex >= maxIndex ? "none" : "auto";
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll("button");
      const activeDotIdx = Math.floor(currentIndex / (isDesktop ? 2 : 1));
      dots.forEach((dot, idx) => {
        if (idx === activeDotIdx) {
          dot.className = "w-6 h-2 rounded-full bg-sky-600 transition-all";
        } else {
          dot.className = "w-2 h-2 rounded-full bg-slate-300 transition-all";
        }
      });
    }
  }

  // Gera marcadores inferiores conforme a quantidade de paginas
  function renderDots() {
    if (!dotsContainer) return;
    const { isDesktop } = getStepAndTotal();
    const count = Math.ceil(slides.length / (isDesktop ? 2 : 1));
    dotsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("button");
      dot.className = i === 0 ? "w-6 h-2 rounded-full bg-sky-600 transition-all" : "w-2 h-2 rounded-full bg-slate-300 transition-all";
      dot.setAttribute("aria-label", `Ir para página ${i + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = i * (isDesktop ? 2 : 1);
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Clique para avancar slide
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const { step } = getStepAndTotal();
      currentIndex += step;
      updateCarousel();
    });
  }

  // Clique para voltar slide
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const { step } = getStepAndTotal();
      currentIndex -= step;
      updateCarousel();
    });
  }

  // Gesto de deslizar (swipe) em telas de toque
  let startX = 0;
  let startY = 0;
  let isTracking = false;
  let isHorizontalSwipe = false;

  container.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isTracking = true;
      isHorizontalSwipe = false;
    }
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    if (!isTracking || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);

    if (deltaX > 10 && deltaX > deltaY) {
      isHorizontalSwipe = true;
    }
  }, { passive: true });

  container.addEventListener("touchend", (e) => {
    if (!isTracking || !isHorizontalSwipe) {
      isTracking = false;
      return;
    }
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const { step } = getStepAndTotal();

    if (diff > 35) {
      currentIndex += step;
      updateCarousel();
    } else if (diff < -35) {
      currentIndex -= step;
      updateCarousel();
    }
    isTracking = false;
    isHorizontalSwipe = false;
  }, { passive: true });

  // Recalcula carrossel ao mudar o tamanho da tela
  window.addEventListener("resize", () => {
    renderDots();
    updateCarousel();
  });

  renderDots();
  updateCarousel();
}

// Modal com informacoes da especialidade e botao direto de agendamento
function initSpecialtyModal() {
  const modal = document.getElementById("specialty-modal");
  const modalClose = document.getElementById("specialty-modal-close");
  const buttons = document.querySelectorAll(".btn-open-specialty");

  if (!modal) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.getAttribute("data-key");
      const data = SPECIALTIES_DETAILS[key];
      if (!data) return;

      document.getElementById("modal-title").innerText = data.title;
      document.getElementById("modal-audience").innerText = data.audience;
      document.getElementById("modal-desc").innerText = data.desc;

      const zapBtn = document.getElementById("modal-zap-btn");
      const msg = encodeURIComponent(`Olá! Gostaria de informações sobre atendimento e agendamento para *${data.title}*.\n\nDesde já, agradeço pela atenção.`);
      zapBtn.href = `https://wa.me/${CLINIC_WHATSAPP}?text=${msg}`;

      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    });
  });

  function close() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  if (modalClose) modalClose.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

// Visualizador ampliado de fotos (lightbox)
function initAmbientesLightbox() {
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const triggers = document.querySelectorAll(".zoomable-image");

  if (!lightbox || !lightboxImg) return;

  triggers.forEach(img => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.getAttribute("src");
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function close() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

// Widget flutuante de conversa rapida no WhatsApp
function initWhatsAppReception() {
  const trigger = document.getElementById("whatsapp-trigger-btn");
  const popup = document.getElementById("whatsapp-chat-popup");
  const closeBtn = document.getElementById("whatsapp-popup-close");
  const sendBtn = document.getElementById("whatsapp-chat-send");
  const input = document.getElementById("whatsapp-chat-input");
  const chips = document.querySelectorAll(".zap-chip");

  if (!trigger || !popup) return;

  trigger.addEventListener("click", () => popup.classList.toggle("hidden"));
  if (closeBtn) closeBtn.addEventListener("click", () => popup.classList.add("hidden"));

  // Botoes de mensagens prontas
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const msg = chip.getAttribute("data-msg");
      window.open(`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    });
  });

  // Envio da mensagem digitada
  if (sendBtn && input) {
    function send() {
      const text = input.value.trim() || "Olá, equipe da Fazendo Terapia! Gostaria de informações sobre atendimentos e agendamento.";
      window.open(`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
    }
    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  }
}

// Formulario de contato integrado com o WhatsApp da recepcao
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("form-name").value.trim();
    const phone = document.getElementById("form-phone").value.trim();
    const specialty = document.getElementById("form-specialty").value;
    const msg = document.getElementById("form-msg").value.trim();
    const observation = msg ? msg : "Gostaria de verificar a disponibilidade de horários e agendar uma avaliação inicial.";

    const formatted = `Olá, equipe da Fazendo Terapia!\n\nGostaria de solicitar informações sobre atendimento:\n\n*Nome:* ${name}\n\n*Telefone:* ${phone}\n\n*Especialidade:* ${specialty}\n\n*Observação:* ${observation}\n\nDesde já, agradeço pela atenção.`;
    window.open(`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(formatted)}`, "_blank");
    form.reset();
  });
}

// Menu lateral para celulares
function initMobileNav() {
  const btn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("mobile-nav");
  const close = document.getElementById("mobile-menu-close");
  const links = document.querySelectorAll(".mobile-link");

  if (!btn || !nav) return;

  function open() {
    nav.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    nav.classList.add("translate-x-full");
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", open);
  if (close) close.addEventListener("click", closeMenu);
  links.forEach(l => l.addEventListener("click", closeMenu));

  // Fecha ao tocar fora do menu
  nav.addEventListener("click", (e) => {
    if (e.target === nav) closeMenu();
  });
}

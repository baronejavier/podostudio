/* ============================================
   PODOSTUDIO · interacción
   Único dato a configurar: CONFIG.telefono
   ============================================ */

const CONFIG = {
  telefono: "5493764834736",
  nombre: "PODOSTUDIO",
  saludoFormulario: "Hola PODOSTUDIO, quiero hacer una consulta."
};

document.documentElement.classList.add("js");

/* ---------- WhatsApp ---------- */
function urlWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje || CONFIG.saludoFormulario);
  return `https://wa.me/${CONFIG.telefono}?text=${texto}`;
}

function iniciarEnlacesWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach((enlace) => {
    enlace.href = urlWhatsApp(enlace.dataset.wa);
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
  });
}

/* ---------- Cabecera ---------- */
function iniciarCabecera() {
  const cabecera = document.getElementById("cabecera");
  const flotante = document.getElementById("wa-flotante");

  const alScroll = () => {
    const y = window.scrollY;
    cabecera.classList.toggle("cabecera--activa", y > 24);
    if (flotante) flotante.classList.toggle("wa-flotante--visible", y > 420);
  };

  alScroll();
  window.addEventListener("scroll", alScroll, { passive: true });
}

/* ---------- Menú móvil ---------- */
function iniciarMenu() {
  const boton = document.getElementById("hamburguesa");
  const menu = document.getElementById("menu");
  if (!boton || !menu) return;

  const cerrar = () => {
    menu.classList.remove("menu--abierto");
    document.body.classList.remove("menu-abierto");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
  };

  const alternar = () => {
    const abierto = menu.classList.toggle("menu--abierto");
    document.body.classList.toggle("menu-abierto", abierto);
    boton.setAttribute("aria-expanded", String(abierto));
    boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  };

  boton.addEventListener("click", alternar);
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrar));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrar();
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("menu--abierto")) return;
    if (!menu.contains(e.target) && !boton.contains(e.target)) cerrar();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) cerrar();
  });
}

/* ---------- Revelado al hacer scroll ---------- */
function iniciarRevelado() {
  const elementos = document.querySelectorAll(".revelar");
  if (!elementos.length) return;

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("revelar--visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const el = entrada.target;
        const hermanos = Array.from(el.parentElement.children).filter((h) =>
          h.classList.contains("revelar")
        );
        const indice = Math.max(hermanos.indexOf(el), 0);
        el.style.transitionDelay = `${Math.min(indice, 5) * 70}ms`;
        el.classList.add("revelar--visible");
        observador.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  elementos.forEach((el) => observador.observe(el));
}

/* ---------- Enlace activo del menú ---------- */
function iniciarNavegacionActiva() {
  const secciones = document.querySelectorAll("main section[id]");
  const enlaces = document.querySelectorAll(".menu__enlace");
  if (!secciones.length || !enlaces.length || !("IntersectionObserver" in window)) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const id = entrada.target.id;
        enlaces.forEach((enlace) => {
          enlace.classList.toggle(
            "menu__enlace--activo",
            enlace.getAttribute("href") === `#${id}`
          );
        });
      });
    },
    { threshold: 0.35 }
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}

/* ---------- Preguntas frecuentes ---------- */
function iniciarFaq() {
  const items = document.querySelectorAll(".faq__item");

  items.forEach((item) => {
    const boton = item.querySelector(".faq__pregunta");
    const panel = item.querySelector(".faq__respuesta");
    if (!boton || !panel) return;

    boton.addEventListener("click", () => {
      const abierto = item.classList.contains("faq__item--abierto");

      items.forEach((otro) => {
        otro.classList.remove("faq__item--abierto");
        otro.querySelector(".faq__respuesta").style.maxHeight = "0px";
        otro.querySelector(".faq__pregunta").setAttribute("aria-expanded", "false");
      });

      if (!abierto) {
        item.classList.add("faq__item--abierto");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        boton.setAttribute("aria-expanded", "true");
      }
    });
  });

  window.addEventListener("resize", () => {
    const abierto = document.querySelector(".faq__item--abierto .faq__respuesta");
    if (abierto) abierto.style.maxHeight = `${abierto.scrollHeight}px`;
  });
}

/* ---------- Scroll suave con altura de cabecera ---------- */
function iniciarAnclas() {
  const cabecera = document.getElementById("cabecera");

  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destino = enlace.getAttribute("href");
      if (!destino || destino === "#" || destino.length < 2) return;

      const elemento = document.querySelector(destino);
      if (!elemento) return;

      evento.preventDefault();
      const alto = cabecera ? cabecera.offsetHeight : 0;
      const y = elemento.getBoundingClientRect().top + window.scrollY - alto + 2;

      window.scrollTo({
        top: y,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  });
}

/* ---------- Año del pie ---------- */
function iniciarAnio() {
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarEnlacesWhatsApp();
  iniciarCabecera();
  iniciarMenu();
  iniciarRevelado();
  iniciarNavegacionActiva();
  iniciarFaq();
  iniciarAnclas();
  iniciarAnio();
});
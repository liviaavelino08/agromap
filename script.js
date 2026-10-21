
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const currentYear = document.getElementById("currentYear");

  // Atualizar automaticamente o ano do rodapé
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Abrir e fechar o menu em telas pequenas
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const aberto = mainNav.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(aberto));
      menuToggle.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
      );

      menuToggle.textContent = aberto ? "×" : "☰";
    });

    // Fechar o menu após selecionar uma opção
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
      });
    });

    // Fechar o menu se a tela voltar ao tamanho de computador
    window.addEventListener("resize", function () {
      if (window.innerWidth > 780) {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
      }
    });
  }

  // Rolagem suave para as seções internas
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const destino = link.getAttribute("href");

      if (!destino || destino === "#") {
        return;
      }

      const secao = document.querySelector(destino);

      if (secao) {
        event.preventDefault();

        secao.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // Tratar imagens externas que falharem ao carregar
  document.querySelectorAll("img").forEach(function (imagem) {
    imagem.addEventListener("error", function () {
      imagem.classList.add("image-error");
      imagem.alt = "Imagem temporariamente indisponível";
    }, { once: true });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const mainNav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const loginFeedback = document.getElementById("loginFeedback");
  const registerFeedback = document.getElementById("registerFeedback");

  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  function closeAllModals() {
    [loginModal, registerModal].forEach((modal) => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });

    document.body.classList.remove("modal-open");
  }

  function openModal(modal) {
    closeAllModals();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (mainNav) {
      mainNav.classList.remove("is-open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    const firstInput = modal.querySelector("input");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function showFeedback(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("error", isError);
  }

  document.getElementById("openLogin").addEventListener("click", () => {
    openModal(loginModal);
  });

  document.getElementById("openRegister").addEventListener("click", () => {
    openModal(registerModal);
  });

  document.getElementById("heroRegister").addEventListener("click", () => {
    openModal(registerModal);
  });

  document.getElementById("bottomRegister").addEventListener("click", () => {
    openModal(registerModal);
  });

  document.getElementById("loginToRegister").addEventListener("click", () => {
    openModal(registerModal);
  });

  document.getElementById("registerToLogin").addEventListener("click", () => {
    openModal(loginModal);
  });

  document.querySelectorAll("[data-close]").forEach((element) => {
    element.addEventListener("click", closeAllModals);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Verifica os dados antes de enviar o cadastro.
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showFeedback(registerFeedback, "");

    const password = document.getElementById("registerPassword").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const latitude = Number(document.getElementById("latitude").value);
    const longitude = Number(document.getElementById("longitude").value);
    const area = Number(document.getElementById("farmArea").value);

    if (password.length < 8) {
      showFeedback(
        registerFeedback,
        "A senha precisa ter pelo menos 8 caracteres.",
        true
      );
      return;
    }

    if (password !== confirmPassword) {
      showFeedback(
        registerFeedback,
        "As senhas digitadas não são iguais.",
        true
      );
      return;
    }

    if (!Number.isFinite(area) || area <= 0) {
      showFeedback(
        registerFeedback,
        "Informe uma área maior que zero hectare.",
        true
      );
      return;
    }

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      showFeedback(
        registerFeedback,
        "Confira a latitude. Ela deve ficar entre -90 e 90.",
        true
      );
      return;
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      showFeedback(
        registerFeedback,
        "Confira a longitude. Ela deve ficar entre -180 e 180.",
        true
      );
      return;
    }

    showFeedback(
      registerFeedback,
      "Os dados foram validados, mas o cadastro ainda não está conectado ao servidor. Para criar uma conta real e salvar as informações, é necessário conectar o site a um backend."
    );
  });

  // O formulário de login ainda depende de um servidor.
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    showFeedback(
      loginFeedback,
      "O login ainda não está conectado ao servidor. É necessário configurar o backend para validar sua conta.",
      true
    );
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const navegacao = document.getElementById("navegacao");
  const menuMobile = document.getElementById("menuMobile");

  document.getElementById("ano").textContent =
    new Date().getFullYear();

  // ABRIR E FECHAR JANELAS

  function fecharModais() {
    document.querySelectorAll(".modal").forEach(function (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });

    document.body.classList.remove("modal-aberto");
  }

  function abrirModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    fecharModais();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-aberto");

    const primeiroCampo = modal.querySelector("input");

    if (primeiroCampo) {
      setTimeout(function () {
        primeiroCampo.focus();
      }, 100);
    }

    // Fecha o menu de celular após escolher uma opção.
    if (navegacao) {
      navegacao.classList.remove("aberto");
    }

    if (menuMobile) {
      menuMobile.setAttribute("aria-expanded", "false");
      menuMobile.textContent = "☰";
    }
  }

  document.querySelectorAll("[data-abrir]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      abrirModal(botao.dataset.abrir);
    });
  });

  document.querySelectorAll("[data-fechar]").forEach(function (botao) {
    botao.addEventListener("click", fecharModais);
  });

  document.querySelectorAll("[data-trocar]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      abrirModal(botao.dataset.trocar);
    });
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      fecharModais();
    }
  });

  // MENU PARA CELULAR

  if (menuMobile && navegacao) {
    menuMobile.addEventListener("click", function () {
      const aberto = navegacao.classList.toggle("aberto");

      menuMobile.setAttribute("aria-expanded", String(aberto));
      menuMobile.textContent = aberto ? "×" : "☰";
    });

    navegacao.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navegacao.classList.remove("aberto");
        menuMobile.setAttribute("aria-expanded", "false");
        menuMobile.textContent = "☰";
      });
    });
  }

  // MENSAGENS

  function mostrarMensagem(id, texto, erro) {
    const elemento = document.getElementById(id);

    elemento.textContent = texto;
    elemento.classList.toggle("erro", Boolean(erro));
  }

  // LOGIN VISUAL

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (evento) {
    evento.preventDefault();

    mostrarMensagem(
      "loginFeedback",
      "A tela está funcionando. Para validar o usuário e a senha, é necessário conectar o sistema ao servidor PHP e ao banco de dados.",
      false
    );
  });

  // CADASTRO E VALIDAÇÃO

  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const senha =
      document.getElementById("registerPassword").value;

    const confirmacao =
      document.getElementById("confirmPassword").value;

    const area =
      Number(document.getElementById("farmArea").value);

    if (senha.length < 8) {
      mostrarMensagem(
        "registerFeedback",
        "A senha deve ter pelo menos 8 caracteres.",
        true
      );
      return;
    }

    if (senha !== confirmacao) {
      mostrarMensagem(
        "registerFeedback",
        "As senhas não correspondem. Confira os dois campos.",
        true
      );
      return;
    }

    if (!Number.isFinite(area) || area <= 0) {
      mostrarMensagem(
        "registerFeedback",
        "Informe uma área válida, maior que zero.",
        true
      );
      return;
    }

    mostrarMensagem(
      "registerFeedback",
      "Os campos foram validados! O salvamento definitivo do cadastro precisa estar conectado ao servidor PHP e ao banco de dados.",
      false
    );
  });

  // SOLICITAR LOCALIZAÇÃO

  const locationButton =
    document.getElementById("locationButton");

  locationButton.addEventListener("click", function () {
    const status =
      document.getElementById("locationStatus");

    if (!navigator.geolocation) {
      status.textContent =
        "Seu navegador não oferece suporte à localização.";
      return;
    }

    status.textContent =
      "Aguardando autorização do navegador...";

    locationButton.disabled = true;
    locationButton.textContent = "Aguardando...";

    navigator.geolocation.getCurrentPosition(
      function (posicao) {
        document.getElementById("latitude").value =
          posicao.coords.latitude;

        document.getElementById("longitude").value =
          posicao.coords.longitude;

        status.textContent =
          "Localização autorizada neste navegador.";

        locationButton.textContent =
          "Localização permitida";

        locationButton.disabled = false;
      },

      function (erro) {
        const mensagens = {
          1: "Permissão negada. Autorize a localização nas configurações do navegador, se desejar.",
          2: "Não foi possível obter a localização. Tente novamente.",
          3: "A solicitação demorou demais. Tente novamente."
        };

        status.textContent =
          mensagens[erro.code] ||
          "Não foi possível obter a localização.";

        locationButton.textContent = "Tentar novamente";
        locationButton.disabled = false;
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
});

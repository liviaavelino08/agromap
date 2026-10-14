document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");
    const mainNav = document.getElementById("mainNav");
    const menuToggle = document.getElementById("menuToggle");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginFeedback = document.getElementById("loginFeedback");
    const registerFeedback = document.getElementById("registerFeedback");

    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    function fecharJanelas() {
        [loginModal, registerModal].forEach((modal) => {
            if (!modal) return;

            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
        });

        document.body.classList.remove("modal-aberto");
    }

    function abrirJanela(modal) {
        if (!modal) return;

        fecharJanelas();

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-aberto");

        if (mainNav) {
            mainNav.classList.remove("is-open");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }

        const primeiroCampo = modal.querySelector("input");

        if (primeiroCampo) {
            primeiroCampo.focus();
        }
    }

    function ligarBotao(id, acao) {
        const botao = document.getElementById(id);

        if (!botao) return;

        botao.addEventListener("click", (event) => {
            event.preventDefault();
            acao();
        });
    }

    function mensagem(elemento, texto, erro = false) {
        if (!elemento) return;

        elemento.textContent = texto;
        elemento.classList.toggle("error", erro);
    }

    ligarBotao("openLogin", () => abrirJanela(loginModal));
    ligarBotao("openRegister", () => abrirJanela(registerModal));
    ligarBotao("heroRegister", () => abrirJanela(registerModal));
    ligarBotao("bottomRegister", () => abrirJanela(registerModal));
    ligarBotao("loginToRegister", () => abrirJanela(registerModal));
    ligarBotao("registerToLogin", () => abrirJanela(loginModal));

    document.querySelectorAll("[data-close]").forEach((botao) => {
        botao.addEventListener("click", fecharJanelas);
    });

    [loginModal, registerModal].forEach((modal) => {
        if (!modal) return;

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                fecharJanelas();
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharJanelas();
        }
    });

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const aberto = mainNav.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(aberto)
            );
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            mensagem(registerFeedback, "");

            const senha =
                document.getElementById("registerPassword").value;

            const confirmar =
                document.getElementById("confirmPassword").value;

            const area =
                Number(document.getElementById("farmArea").value);

            const latitudeTexto =
                document.getElementById("latitude").value.trim();

            const longitudeTexto =
                document.getElementById("longitude").value.trim();

            if (senha.length < 8) {
                mensagem(
                    registerFeedback,
                    "A senha precisa ter pelo menos 8 caracteres.",
                    true
                );
                return;
            }

            if (senha !== confirmar) {
                mensagem(
                    registerFeedback,
                    "As senhas digitadas não são iguais.",
                    true
                );
                return;
            }

            if (!Number.isFinite(area) || area <= 0) {
                mensagem(
                    registerFeedback,
                    "Informe uma área maior que zero hectare.",
                    true
                );
                return;
            }

            if (latitudeTexto !== "") {
                const latitude = Number(latitudeTexto);

                if (!Number.isFinite(latitude) ||
                    latitude < -90 || latitude > 90) {
                    mensagem(
                        registerFeedback,
                        "A latitude deve estar entre -90 e 90.",
                        true
                    );
                    return;
                }
            }

            if (longitudeTexto !== "") {
                const longitude = Number(longitudeTexto);

                if (!Number.isFinite(longitude) ||
                    longitude < -180 || longitude > 180) {
                    mensagem(
                        registerFeedback,
                        "A longitude deve estar entre -180 e 180.",
                        true
                    );
                    return;
                }
            }

            mensagem(
                registerFeedback,
                "Os dados foram validados. O cadastro definitivo ainda precisa ser conectado ao servidor PHP."
            );
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            mensagem(
                loginFeedback,
                "A janela está funcionando, mas a autenticação precisa ser conectada ao servidor PHP.",
                true
            );
        });
    }
});

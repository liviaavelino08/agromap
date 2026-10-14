
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

    function showFeedback(element, message, isError = false) {
        if (!element) return;

        element.textContent = message;
        element.classList.toggle("error", isError);
    }

    function closeAllModals() {
        [loginModal, registerModal].forEach((modal) => {
            if (!modal) return;

            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
        });

        document.body.classList.remove("modal-open");
    }

    function openModal(modal) {
        if (!modal) return;

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
            firstInput.focus();
        }
    }

    function connectButton(id, action) {
        const button = document.getElementById(id);

        if (!button) return;

        button.addEventListener("click", (event) => {
            event.preventDefault();
            action();
        });
    }

    connectButton("openLogin", () => openModal(loginModal));
    connectButton("openRegister", () => openModal(registerModal));
    connectButton("heroRegister", () => openModal(registerModal));
    connectButton("bottomRegister", () => openModal(registerModal));
    connectButton("loginToRegister", () => openModal(registerModal));
    connectButton("registerToLogin", () => openModal(loginModal));

    document.querySelectorAll("[data-close]").forEach((button) => {
        button.addEventListener("click", closeAllModals);
    });

    [loginModal, registerModal].forEach((modal) => {
        if (!modal) return;

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
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

            showFeedback(registerFeedback, "");

            const password =
                document.getElementById("registerPassword").value;

            const confirmation =
                document.getElementById("confirmPassword").value;

            const area =
                Number(document.getElementById("farmArea").value);

            const latitudeText =
                document.getElementById("latitude").value.trim();

            const longitudeText =
                document.getElementById("longitude").value.trim();

            if (password.length < 8) {
                showFeedback(
                    registerFeedback,
                    "A senha precisa ter pelo menos 8 caracteres.",
                    true
                );
                return;
            }

            if (password !== confirmation) {
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

            if (latitudeText !== "") {
                const latitude = Number(latitudeText);

                if (!Number.isFinite(latitude) ||
                    latitude < -90 || latitude > 90) {
                    showFeedback(
                        registerFeedback,
                        "Confira a latitude informada.",
                        true
                    );
                    return;
                }
            }

            if (longitudeText !== "") {
                const longitude = Number(longitudeText);

                if (!Number.isFinite(longitude) ||
                    longitude < -180 || longitude > 180) {
                    showFeedback(
                        registerFeedback,
                        "Confira a longitude informada.",
                        true
                    );
                    return;
                }
            }

            showFeedback(
                registerFeedback,
                "Formulário validado! Para concluir o cadastro e salvar seus dados, precisamos conectar o servidor PHP."
            );
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            showFeedback(
                loginFeedback,
                "A janela está funcionando, mas o login precisa ser conectado ao servidor PHP para validar sua conta.",
                true
            );
        });
    }
});

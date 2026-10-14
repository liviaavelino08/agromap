
document.addEventListener("DOMContentLoaded", function () {
    const modalLogin = document.getElementById("modalLogin");
    const modalCadastro = document.getElementById("modalCadastro");
    const menuMobile = document.getElementById("menuMobile");
    const navegacao = document.getElementById("navegacao");

    function abrirModal(modal) {
        if (!modal) return;

        fecharTodosModais();
        modal.classList.add("aberto");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-aberto");

        const primeiroCampo = modal.querySelector("input");
        if (primeiroCampo) {
            setTimeout(function () {
                primeiroCampo.focus();
            }, 100);
        }
    }

    function fecharModal(modal) {
        if (!modal) return;

        modal.classList.remove("aberto");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".modal.aberto")) {
            document.body.classList.remove("modal-aberto");
        }
    }

    function fecharTodosModais() {
        document.querySelectorAll(".modal").forEach(function (modal) {
            modal.classList.remove("aberto");
            modal.setAttribute("aria-hidden", "true");
        });

        document.body.classList.remove("modal-aberto");
    }

    function mostrarMensagem(elemento, mensagem, tipo) {
        if (!elemento) return;

        elemento.textContent = mensagem;
        elemento.className = "mensagem-form " + tipo;
    }

    // Abrir login
    document.getElementById("abrirLogin")?.addEventListener("click", function () {
        abrirModal(modalLogin);
    });

    // Abrir cadastro pelos botões da página
    ["abrirCadastro", "heroCadastro", "chamadaCadastro"].forEach(function (id) {
        document.getElementById(id)?.addEventListener("click", function () {
            abrirModal(modalCadastro);
        });
    });

    // Alternar entre login e cadastro
    document.getElementById("trocarParaCadastro")?.addEventListener("click", function () {
        abrirModal(modalCadastro);
    });

    document.getElementById("trocarParaLogin")?.addEventListener("click", function () {
        abrirModal(modalLogin);
    });

    // Fechar pelas áreas e botões de fechar
    document.querySelectorAll("[data-fechar]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const nomeModal = botao.getAttribute("data-fechar");

            if (nomeModal === "login") {
                fecharModal(modalLogin);
            } else if (nomeModal === "cadastro") {
                fecharModal(modalCadastro);
            }
        });
    });

    // Fechar com a tecla Escape
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            fecharTodosModais();
        }
    });

    // Menu para celular
    menuMobile?.addEventListener("click", function () {
        const aberto = navegacao.classList.toggle("aberto");
        menuMobile.setAttribute("aria-expanded", String(aberto));
        menuMobile.textContent = aberto ? "×" : "☰";
    });

    // Fechar menu ao escolher uma seção
    navegacao?.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navegacao.classList.remove("aberto");

            if (menuMobile) {
                menuMobile.textContent = "☰";
                menuMobile.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Formatar CEP no padrão 00000-000
    const campoCep = document.getElementById("cep");

    campoCep?.addEventListener("input", function () {
        let numeros = campoCep.value.replace(/\D/g, "").slice(0, 8);

        if (numeros.length > 5) {
            numeros = numeros.slice(0, 5) + "-" + numeros.slice(5);
        }

        campoCep.value = numeros;
    });

    // Validar login
    const formLogin = document.getElementById("formLogin");

    formLogin?.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;
        const mensagem = document.getElementById("mensagemLogin");

        if (!email || !senha) {
            mostrarMensagem(
                mensagem,
                "Preencha o e-mail e a senha.",
                "erro"
            );
            return;
        }

        mostrarMensagem(
            mensagem,
            "O formulário foi preenchido. Para validar o acesso, ele precisa estar conectado ao sistema de login do AgroMap.",
            "erro"
        );
    });

    // Validar cadastro
    const formCadastro = document.getElementById("formCadastro");

    formCadastro?.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const mensagem = document.getElementById("mensagemCadastro");
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;
        const cep = document.getElementById("cep").value.replace(/\D/g, "");
        const area = Number(document.getElementById("area").value);

        if (senha.length < 6) {
            mostrarMensagem(
                mensagem,
                "A senha precisa ter pelo menos 6 caracteres.",
                "erro"
            );
            document.getElementById("senha").focus();
            return;
        }

        if (senha !== confirmarSenha) {
            mostrarMensagem(
                mensagem,
                "As senhas não são iguais. Confira os dois campos.",
                "erro"
            );
            document.getElementById("confirmarSenha").focus();
            return;
        }

        if (cep.length !== 8) {
            mostrarMensagem(
                mensagem,
                "Digite um CEP válido com 8 números.",
                "erro"
            );
            document.getElementById("cep").focus();
            return;
        }

        if (!Number.isFinite(area) || area <= 0) {
            mostrarMensagem(
                mensagem,
                "Informe uma área válida para a propriedade.",
                "erro"
            );
            document.getElementById("area").focus();
            return;
        }

        mostrarMensagem(
            mensagem,
            "Os campos foram validados. Para criar e salvar a conta de verdade, os dados precisam ser enviados ao backend PHP e ao banco de dados do AgroMap.",
            "sucesso"
        );
    });
});

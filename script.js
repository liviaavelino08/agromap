
const modal = document.getElementById("modal");
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");

const modalTitulo = document.getElementById("modalTitulo");
const modalDescricao = document.getElementById("modalDescricao");

const abaLogin = document.getElementById("abaLogin");
const abaCadastro = document.getElementById("abaCadastro");

function abrirModal(tipo = "login") {
  modal.classList.add("aberto");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  mostrarFormulario(tipo);
}

function fecharModal() {
  modal.classList.remove("aberto");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function mostrarFormulario(tipo) {
  const cadastro = tipo === "cadastro";

  formLogin.hidden = cadastro;
  formCadastro.hidden = !cadastro;

  abaLogin.classList.toggle("ativa", !cadastro);
  abaCadastro.classList.toggle("ativa", cadastro);

  modalTitulo.textContent = cadastro
    ? "Crie sua conta AgroMap"
    : "Bem-vindo de volta!";

  modalDescricao.textContent = cadastro
    ? "Preencha seus dados para começar."
    : "Entre na sua conta para continuar.";

  document.getElementById("mensagemLogin").textContent = "";
  document.getElementById("mensagemCadastro").textContent = "";
}

document.getElementById("abrirLogin").addEventListener("click", () => {
  abrirModal("login");
});

document.getElementById("abrirCadastro").addEventListener("click", () => {
  abrirModal("cadastro");
});

document.getElementById("heroCadastro").addEventListener("click", () => {
  abrirModal("cadastro");
});

document.getElementById("chamadaCadastro").addEventListener("click", () => {
  abrirModal("cadastro");
});

document.getElementById("fecharModal").addEventListener("click", fecharModal);

abaLogin.addEventListener("click", () => {
  mostrarFormulario("login");
});

abaCadastro.addEventListener("click", () => {
  mostrarFormulario("cadastro");
});

modal.addEventListener("click", (evento) => {
  if (evento.target === modal) {
    fecharModal();
  }
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    fecharModal();
  }
});

// Menu para celulares
const menu = document.getElementById("menu");
const botaoMenu = document.getElementById("menuMobile");

botaoMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", String(aberto));
});

document.querySelectorAll("#menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  });
});

// Envio para os arquivos PHP existentes
async function enviarFormulario(url, formulario, mensagem) {
  const botao = formulario.querySelector('button[type="submit"]');
  const textoOriginal = botao.textContent;

  mensagem.textContent = "";
  mensagem.classList.remove("sucesso");

  botao.disabled = true;
  botao.textContent = "Aguarde...";

  try {
    const resposta = await fetch(url, {
      method: "POST",
      body: new FormData(formulario),
      headers: {
        "Accept": "application/json"
      },
      credentials: "same-origin"
    });

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
      throw new Error(
        dados.mensagem || "Não foi possível concluir a operação."
      );
    }

    mensagem.textContent = dados.mensagem;
    mensagem.classList.add("sucesso");

    if (url === "cadastrar.php") {
      formulario.reset();

      setTimeout(() => {
        mostrarFormulario("login");
      }, 1200);
    } else {
      formulario.reset();

      setTimeout(() => {
        window.location.href = dados.redirecionar || "painel.php";
      }, 500);
    }
  } catch (erro) {
    if (erro instanceof SyntaxError) {
      mensagem.textContent =
        "O servidor retornou uma resposta inesperada. Verifique o PHP.";
    } else if (erro.message === "Failed to fetch") {
      mensagem.textContent =
        "Não foi possível conectar ao servidor. Verifique sua conexão.";
    } else {
      mensagem.textContent = erro.message;
    }

    mensagem.classList.remove("sucesso");
  } finally {
    botao.disabled = false;
    botao.textContent = textoOriginal;
  }
}

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  enviarFormulario(
    "login.php",
    formLogin,
    document.getElementById("mensagemLogin")
  );
});

formCadastro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const senha = document.getElementById("cadSenha").value;
  const confirmar = document.getElementById("cadConfirmar").value;
  const mensagem = document.getElementById("mensagemCadastro");

  if (senha.length < 8) {
    mensagem.textContent =
      "A senha precisa ter pelo menos 8 caracteres.";
    mensagem.classList.remove("sucesso");
    return;
  }

  if (senha !== confirmar) {
    mensagem.textContent = "As senhas não são iguais.";
    mensagem.classList.remove("sucesso");
    return;
  }

  enviarFormulario(
    "cadastrar.php",
    formCadastro,
    mensagem
  );
});

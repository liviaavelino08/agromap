
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
    ? "Preencha seus dados e os dados da propriedade."
    : "Entre na sua conta para continuar.";

  document.getElementById("mensagemLogin").textContent = "";
  document.getElementById("mensagemCadastro").textContent = "";
}

document.getElementById("abrirLogin")
  .addEventListener("click", () => abrirModal("login"));

document.getElementById("abrirCadastro")
  .addEventListener("click", () => abrirModal("cadastro"));

document.getElementById("heroCadastro")
  .addEventListener("click", () => abrirModal("cadastro"));

document.getElementById("chamadaCadastro")
  .addEventListener("click", () => abrirModal("cadastro"));

document.getElementById("fecharModal")
  .addEventListener("click", fecharModal);

abaLogin.addEventListener("click", () => mostrarFormulario("login"));
abaCadastro.addEventListener("click", () => mostrarFormulario("cadastro"));

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

// Menu para celular
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

// Validação do cadastro
formCadastro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const mensagem = document.getElementById("mensagemCadastro");
  const senha = document.getElementById("cadSenha").value;
  const confirmar = document.getElementById("cadConfirmar").value;

  const campoLatitude = document.getElementById("cadLatitude");
  const campoLongitude = document.getElementById("cadLongitude");

  const latitude = campoLatitude.value.trim();
  const longitude = campoLongitude.value.trim();

  mensagem.classList.remove("sucesso");
  mensagem.textContent = "";

  if (senha.length < 8) {
    mensagem.textContent =
      "A senha precisa ter pelo menos 8 caracteres.";
    return;
  }

  if (senha !== confirmar) {
    mensagem.textContent = "As senhas não são iguais.";
    document.getElementById("cadConfirmar").focus();
    return;
  }

  if (latitude === "" || longitude === "") {
    mensagem.textContent =
      "Informe a latitude e a longitude da propriedade.";
    return;
  }

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    mensagem.textContent =
      "Latitude inválida. Use um valor entre -90 e 90.";
    campoLatitude.focus();
    return;
  }

  if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
    mensagem.textContent =
      "Longitude inválida. Use um valor entre -180 e 180.";
    campoLongitude.focus();
    return;
  }

  mensagem.textContent =
    "Os campos foram validados! O cadastro ainda precisa ser conectado " +
    "ao banco de dados para salvar as informações permanentemente.";
});

// O login ainda não está ligado a um servidor
formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const mensagem = document.getElementById("mensagemLogin");

  mensagem.classList.remove("sucesso");
  mensagem.textContent =
    "O login ainda não está conectado ao servidor. " +
    "Precisamos configurar a autenticação para permitir a entrada.";
});

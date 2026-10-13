// Só mostra o painel se houver login; senão volta para o login.
async function carregarSessao() {
    try {
        const resposta = await fetch("api.php?acao=sessao");
        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("nomeUsuario").textContent = resultado.usuario.nome.split(" ")[0];
        document.getElementById("propriedadeUsuario").textContent =
            resultado.usuario.propriedade || "Minha propriedade";

        document.body.style.visibility = "visible";
    } catch (erro) {
        console.error(erro);
        window.location.href = "login.html";
    }
}

document.body.style.visibility = "hidden";
carregarSessao();

// SAIR
document.getElementById("logout").addEventListener("click", async function () {
    const dados = new FormData();
    dados.append("acao", "logout");
    await fetch("api.php", { method: "POST", body: dados });
    window.location.href = "login.html";
});

// MENU
const menus = document.querySelectorAll(".menu");
menus.forEach(function (menu) {
    menu.addEventListener("click", function () {
        menus.forEach(function (item) { item.classList.remove("active"); });
        menu.classList.add("active");
        const nome = menu.querySelector("span").textContent;
        if (nome !== "Visão geral") {
            alert(nome + " será desenvolvido na próxima etapa.");
        }
    });
});
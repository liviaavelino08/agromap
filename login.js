// Login: só e-mail e senha. Nenhuma localização é pedida aqui.
const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const mensagem = document.getElementById("mensagem");
    const dados = new FormData(formulario);
    dados.append("acao", "login");

    try {
        const resposta = await fetch("api.php", { method: "POST", body: dados });
        const resultado = await resposta.json();

        if (resultado.sucesso) {
            mensagem.textContent = "Login realizado!";
            mensagem.style.color = "#2e7d32";
            setTimeout(function () { window.location.href = "dashboard.html"; }, 700);
        } else {
            mensagem.textContent = resultado.mensagem;
            mensagem.style.color = "#c62828";
        }
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Erro ao conectar ao sistema.";
        mensagem.style.color = "#c62828";
    }
});
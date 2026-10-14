
document.addEventListener("DOMContentLoaded", function () {
    const themeButton = document.getElementById("themeButton");

    // Alternar entre tema claro e escuro
    if (themeButton) {
        themeButton.addEventListener("click", function () {
            document.body.classList.toggle("tema-escuro");

            const temaEscuroAtivo =
                document.body.classList.contains("tema-escuro");

            themeButton.textContent = temaEscuroAtivo ? "☀️" : "🌙";

            themeButton.setAttribute(
                "aria-label",
                temaEscuroAtivo ? "Ativar tema claro" : "Ativar tema escuro"
            );
        });
    }

    // Rolagem suave para as seções da página
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const destino = link.getAttribute("href");

            if (!destino || destino === "#") return;

            const secao = document.querySelector(destino);

            if (secao) {
                event.preventDefault();

                secao.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});

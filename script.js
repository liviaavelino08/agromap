
document.addEventListener("DOMContentLoaded", function () {
    // Alterna o tema claro e escuro
    const botaoTema = document.getElementById("themeButton");

    if (botaoTema) {
        botaoTema.addEventListener("click", function () {
            document.body.classList.toggle("tema-escuro");

            const escuro = document.body.classList.contains("tema-escuro");

            botaoTema.textContent = escuro ? "☀️" : "🌙";
            botaoTema.setAttribute("aria-pressed", String(escuro));
        });
    }

    // Navegação suave entre as seções da página
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (evento) {
            const destino = link.getAttribute("href");
            const secao = document.querySelector(destino);

            if (secao) {
                evento.preventDefault();

                secao.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Os links de cadastro e login abrem as páginas correspondentes.
    // Não interceptamos esses links para não impedir a navegação.
});

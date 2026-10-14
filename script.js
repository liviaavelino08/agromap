
document.addEventListener("DOMContentLoaded", function () {
    const themeButton = document.getElementById("themeButton");

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");

            const escuro = document.body.classList.contains("dark-theme");
            themeButton.textContent = escuro ? "☀️" : "🌙";
            themeButton.setAttribute("aria-pressed", String(escuro));
        });
    }

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

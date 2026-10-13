// TEMA CLARO / ESCURO (usa a classe "dark", que é a do style.css)
const themeButton = document.getElementById("themeButton");

if (localStorage.getItem("agromapTheme") === "dark") {
    document.body.classList.add("dark");
    if (themeButton) themeButton.textContent = "☀️";
}

if (themeButton) {
    themeButton.addEventListener("click", function () {
        const escuro = document.body.classList.toggle("dark");
        themeButton.textContent = escuro ? "☀️" : "🌙";
        localStorage.setItem("agromapTheme", escuro ? "dark" : "light");
    });
}

// "Conheça o AgroMap" rola até os recursos
const startButton = document.getElementById("startButton");
if (startButton) {
    startButton.onclick = function () {
        document.getElementById("recursos").scrollIntoView({ behavior: "smooth" });
    };
}

// "Começar agora" vai para o cadastro
document.querySelectorAll("#ctaButton").forEach(function (btn) {
    btn.onclick = function () { window.location.href = "cadastro.html"; };
});
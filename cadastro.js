const formulario = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

const SOLOS = ["Argiloso", "Arenoso", "Siltoso", "Misto / Franco", "Latossolo", "Terra roxa", "Não sei informar"];
const CULTURAS = ["Soja", "Milho", "Feijão", "Café"];
const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

/* ESTADOS */
const selectEstado = document.getElementById("estado");
selectEstado.innerHTML = '<option value="">UF</option>' +
    ESTADOS.map(uf => `<option value="${uf}">${uf}</option>`).join("");

/* =========================
   POPUP DE LOCALIZAÇÃO
========================= */
const popup = document.getElementById("popupLocalizacao");
const statusLocalizacao = document.getElementById("statusLocalizacao");

function abrirPopup() { popup.classList.add("ativo"); }
function fecharPopup() { popup.classList.remove("ativo"); }

function atualizarStatusGps() {
    const box = document.getElementById("statusGps");
    const texto = document.getElementById("textoGps");
    if (latitudeInput.value && longitudeInput.value) {
        box.classList.add("ok");
        texto.textContent = "✓ Localização registrada com sucesso.";
    } else {
        box.classList.remove("ok");
        texto.textContent = "📍 Localização do dispositivo ainda não autorizada.";
    }
}

window.addEventListener("load", abrirPopup);

document.getElementById("btnPermitir").addEventListener("click", function () {
    if (!navigator.geolocation) {
        statusLocalizacao.textContent = "Seu navegador não suporta localização.";
        statusLocalizacao.style.color = "#c62828";
        return;
    }
    statusLocalizacao.textContent = "Aguardando permissão do navegador...";
    statusLocalizacao.style.color = "#68756c";

    navigator.geolocation.getCurrentPosition(
        function (pos) {
            latitudeInput.value = pos.coords.latitude;
            longitudeInput.value = pos.coords.longitude;
            atualizarStatusGps();
            fecharPopup();
        },
        function (erro) {
            console.log(erro);
            statusLocalizacao.textContent = "Não foi possível acessar sua localização. Verifique a permissão do navegador.";
            statusLocalizacao.style.color = "#c62828";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
});

document.getElementById("btnNegar").addEventListener("click", fecharPopup);
document.getElementById("btnGps").addEventListener("click", abrirPopup);

/* =========================
   TALHÕES
========================= */
const listaTalhoes = document.getElementById("listaTalhoes");

function criarTalhao() {
    const div = document.createElement("div");
    div.className = "talhao-item";
    div.innerHTML = `
        <div class="talhao-topo">
            <span class="titulo-talhao"></span>
            <button type="button" class="remover">Remover</button>
        </div>

        <label>Nome do talhão</label>
        <input type="text" class="t-nome" placeholder="Ex.: Talhão da Sede" required>

        <div class="linha-2">
            <div>
                <label>Área (hectares)</label>
                <input type="number" class="t-area" min="0.01" step="0.01" placeholder="Ex.: 30" required>
            </div>
            <div>
                <label>Tipo de solo</label>
                <select class="t-solo" required>
                    <option value="">Selecione</option>
                    ${SOLOS.map(s => `<option value="${s}">${s}</option>`).join("")}
                </select>
            </div>
        </div>

        <label>Cultura plantada</label>
        <select class="t-cultura">
            <option value="">Nenhuma / ainda não plantado</option>
            ${CULTURAS.map(c => `<option value="${c}">${c}</option>`).join("")}
        </select>

        <div class="campo-data">
            <label>Data do plantio</label>
            <input type="date" class="t-data">
        </div>
    `;

    const selCultura = div.querySelector(".t-cultura");
    const campoData = div.querySelector(".campo-data");
    selCultura.addEventListener("change", function () {
        const tem = selCultura.value !== "";
        campoData.classList.toggle("visivel", tem);
        div.querySelector(".t-data").required = tem;
    });

    div.querySelector(".remover").addEventListener("click", function () {
        if (listaTalhoes.children.length > 1) {
            div.remove();
            renumerarTalhoes();
            atualizarResumoArea();
        }
    });

    div.querySelector(".t-area").addEventListener("input", atualizarResumoArea);

    listaTalhoes.appendChild(div);
    renumerarTalhoes();
}

function renumerarTalhoes() {
    const itens = listaTalhoes.querySelectorAll(".talhao-item");
    itens.forEach(function (item, i) {
        item.querySelector(".titulo-talhao").textContent = "Talhão " + String(i + 1).padStart(2, "0");
        item.querySelector(".remover").style.display = itens.length > 1 ? "inline" : "none";
    });
}

function somaAreas() {
    let soma = 0;
    listaTalhoes.querySelectorAll(".t-area").forEach(function (campo) {
        soma += parseFloat(campo.value) || 0;
    });
    return soma;
}

function atualizarResumoArea() {
    const resumo = document.getElementById("resumoArea");
    const total = parseFloat(document.getElementById("areaTotal").value) || 0;
    const soma = somaAreas();
    resumo.classList.remove("erro");

    if (soma > total && total > 0) {
        resumo.textContent = `A soma dos talhões (${soma.toFixed(2)} ha) passa da área total da propriedade (${total.toFixed(2)} ha).`;
        resumo.classList.add("erro");
    } else {
        resumo.textContent = `Área cadastrada nos talhões: ${soma.toFixed(2)} ha de ${total.toFixed(2)} ha.`;
    }
}

document.getElementById("btnAddTalhao").addEventListener("click", function () {
    criarTalhao();
    atualizarResumoArea();
});

criarTalhao();

/* =========================
   ETAPAS
========================= */
let etapaAtual = 1;
const TOTAL_ETAPAS = 3;

const btnVoltar = document.getElementById("btnVoltar");
const btnProximo = document.getElementById("btnProximo");
const btnEnviar = document.getElementById("btnEnviar");

function mostrarEtapa(n) {
    etapaAtual = n;
    document.querySelectorAll(".etapa").forEach(e =>
        e.classList.toggle("ativa", Number(e.dataset.etapa) === n));
    document.querySelectorAll(".passo").forEach(function (p) {
        const num = Number(p.dataset.passo);
        p.classList.toggle("ativo", num === n);
        p.classList.toggle("feito", num < n);
    });
    btnVoltar.style.display = n > 1 ? "block" : "none";
    btnProximo.style.display = n < TOTAL_ETAPAS ? "block" : "none";
    btnEnviar.style.display = n === TOTAL_ETAPAS ? "block" : "none";
    if (n === 3) atualizarResumoArea();
    mensagem.textContent = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function erro(texto) {
    mensagem.textContent = texto;
    mensagem.style.color = "#c62828";
    return false;
}

function validarEtapa(n) {
    const etapa = document.querySelector(`.etapa[data-etapa="${n}"]`);
    const campos = etapa.querySelectorAll("input, select");

    for (const campo of campos) {
        if (!campo.checkValidity()) {
            campo.reportValidity();
            return false;
        }
    }

    if (n === 1) {
        if (document.getElementById("senha").value !== document.getElementById("confirmarSenha").value) {
            return erro("As senhas não são iguais.");
        }
    }

    if (n === 3) {
        const total = parseFloat(document.getElementById("areaTotal").value) || 0;
        if (somaAreas() > total) {
            return erro("A soma das áreas dos talhões não pode passar da área total da propriedade.");
        }
    }
    return true;
}

btnProximo.addEventListener("click", function () {
    if (validarEtapa(etapaAtual)) mostrarEtapa(etapaAtual + 1);
});
btnVoltar.addEventListener("click", function () { mostrarEtapa(etapaAtual - 1); });

/* =========================
   ENVIO
========================= */
formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    for (let i = 1; i <= TOTAL_ETAPAS; i++) {
        if (!validarEtapa(i)) { mostrarEtapa(i); validarEtapa(i); return; }
    }

    if (!latitudeInput.value || !longitudeInput.value) {
        mostrarEtapa(2);
        erro("É necessário permitir a localização para criar a conta.");
        abrirPopup();
        return;
    }

    const talhoes = [];
    listaTalhoes.querySelectorAll(".talhao-item").forEach(function (item) {
        talhoes.push({
            nome: item.querySelector(".t-nome").value.trim(),
            area: item.querySelector(".t-area").value,
            tipo_solo: item.querySelector(".t-solo").value,
            cultura: item.querySelector(".t-cultura").value,
            data_plantio: item.querySelector(".t-data").value
        });
    });

    const cidade = document.getElementById("cidade").value.trim();
    const uf = document.getElementById("estado").value;
    const ref = document.getElementById("referencia").value.trim();
    const localizacao = cidade + " - " + uf + (ref ? " | " + ref : "");

    const dados = new FormData(formulario);
    dados.append("acao", "cadastro");
    dados.append("localizacao", localizacao);
    dados.append("talhoes", JSON.stringify(talhoes));

    btnEnviar.disabled = true;

    try {
        const resposta = await fetch("api.php", { method: "POST", body: dados });
        const resultado = await resposta.json();

        if (resultado.sucesso) {
            mensagem.textContent = "Cadastro realizado com sucesso!";
            mensagem.style.color = "#2e7d32";
            setTimeout(function () { window.location.href = "login.html"; }, 1200);
        } else {
            btnEnviar.disabled = false;
            erro(resultado.mensagem);
        }
    } catch (e) {
        console.error(e);
        btnEnviar.disabled = false;
        erro("Erro ao realizar o cadastro.");
    }
});
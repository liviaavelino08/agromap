
const SUPABASE_URL = "https://jzjbsjplmjgtltyswyft.supabase.co";
const SUPABASE_KEY = "sb_publishable_lzgGRU_n1Ch3kjZy5wVezw_EwwLDANm";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const $ = (id) => document.getElementById(id);

function preencher(id, valor, padrao = "—") {
    const campo = $(id);

    if (campo) {
        campo.textContent =
            valor !== null && valor !== undefined && String(valor).trim() !== ""
                ? String(valor)
                : padrao;
    }
}

function hectares(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "Não informado";
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "Não informado";
    }

    return numero.toLocaleString("pt-BR", {
        maximumFractionDigits: 2
    }) + " ha";
}

function mostrarErro(texto) {
    const campo = $("mensagemErro");
    if (campo) campo.textContent = texto;
}

async function carregarPainel() {
    try {
        mostrarErro("");

        const { data: sessaoData, error: sessaoErro } =
            await supabaseClient.auth.getSession();

        if (sessaoErro) throw sessaoErro;

        const sessao = sessaoData.session;

        if (!sessao) {
            window.location.replace("login.html");
            return;
        }

        const usuario = sessao.user;
        const metadados = usuario.user_metadata || {};

        preencher(
            "nomeUsuario",
            metadados.nome || metadados.name,
            "Produtor"
        );

        preencher("emailUsuario", usuario.email, "Produtor rural");

        const { data: perfil, error: perfilErro } = await supabaseClient
            .from("usuarios")
            .select("nome, email")
            .eq("id", usuario.id)
            .maybeSingle();

        if (perfilErro) throw perfilErro;

        preencher(
            "nomeUsuario",
            perfil?.nome || metadados.nome || metadados.name,
            "Produtor"
        );

        preencher("emailUsuario", perfil?.email || usuario.email, "Produtor rural");

        const { data: propriedades, error: propriedadeErro } =
            await supabaseClient
                .from("propriedades")
                .select(
                    "id, nome, cidade, estado, endereco, area_total, hectares_plantados, cultura_principal, outras_culturas, epoca_plantio, irrigacao, observacoes"
                )
                .eq("usuario_id", usuario.id)
                .order("id", { ascending: true });

        if (propriedadeErro) throw propriedadeErro;

        const propriedade = propriedades?.[0];

        if (!propriedade) {
            preencher("propriedadeUsuario", "Minha propriedade");
            preencher("areaTotal", "Não informado");
            preencher("areaPlantada", "Não informado");
            preencher("culturaPrincipal", "Não informada");
            preencher("localizacaoUsuario", "Não informada");
            preencher("estadoUsuario", "Cadastre os dados da propriedade");
            preencher(
                "detalhesPropriedade",
                "Ainda não há uma propriedade cadastrada nesta conta."
            );
            return;
        }

        preencher(
            "propriedadeUsuario",
            propriedade.nome,
            "Minha propriedade"
        );

        preencher("areaTotal", hectares(propriedade.area_total));
        preencher("areaPlantada", hectares(propriedade.hectares_plantados));
        preencher(
            "culturaPrincipal",
            propriedade.cultura_principal,
            "Não informada"
        );

        preencher("localizacaoUsuario", propriedade.cidade, "Não informada");
        preencher("estadoUsuario", propriedade.estado, "Estado não informado");

        const detalhes = [
            propriedade.endereco,
            [propriedade.cidade, propriedade.estado].filter(Boolean).join(" - "),
            propriedade.cultura_principal
                ? "Cultura principal: " + propriedade.cultura_principal
                : "",
            propriedade.outras_culturas
                ? "Outras culturas: " + propriedade.outras_culturas
                : "",
            propriedade.epoca_plantio
                ? "Época de plantio: " + propriedade.epoca_plantio
                : "",
            propriedade.irrigacao
                ? "Irrigação: " + propriedade.irrigacao
                : "",
            propriedade.observacoes
        ].filter(Boolean);

        preencher(
            "detalhesPropriedade",
            detalhes.join(" • "),
            "Nenhum detalhe adicional cadastrado."
        );

    } catch (erro) {
        console.error("Erro ao carregar o painel:", erro);
        mostrarErro(
            "Não foi possível carregar os dados. Confira as permissões do Supabase e tente novamente."
        );
    }
}

$("logout")?.addEventListener("click", async () => {
    const botao = $("logout");
    botao.disabled = true;

    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) throw error;

        window.location.replace("login.html");
    } catch (erro) {
        console.error("Erro ao sair:", erro);
        mostrarErro("Não foi possível sair da conta. Tente novamente.");
        botao.disabled = false;
    }
});

document.querySelectorAll(".menu[data-section]").forEach((botao) => {
    botao.addEventListener("click", () => {
        const secao = $(botao.dataset.section);

        if (!secao) return;

        document.querySelectorAll(".menu").forEach((item) => {
            item.classList.remove("active");
        });

        botao.classList.add("active");
        secao.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

carregarPainel();
